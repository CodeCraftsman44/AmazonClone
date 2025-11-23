from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from EcommerceInventory.Helpers import getExcludeFields, getSuperAdminDynamicFormModels, renderResponse
from EcommerceInventory.permission import IsSuperAdmin
from django.apps import apps
from django.core.serializers import serialize
import json

class SuperAdminDynamicFormController(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    authentication_classes = [JWTAuthentication]

    def post(self, request, modelName):
        #check if model exists in dynamic form models
        if modelName not in getSuperAdminDynamicFormModels():
            return renderResponse(data='Model not found', message='Model not found', status=404)
        
        #getting the model name from Dynamic form models
        model = getSuperAdminDynamicFormModels()[modelName]
        #Getting the Model Class from the Model Name
        model_class = apps.get_model(model)

        #Checking if model class exists
        if model_class is None:
            return renderResponse(data='Model not found', message='Model not found', status=404)

        #getting the model fields info
        fields_info =model_class._meta.fields
        #getting the model fields names excluding the excluded fields
        model_fields = [field.name for field in fields_info]
        exclude_fields = getExcludedFields()

        #checking for required fields in the model data
        required_fields=[field.name for field in fields_info if not field.null and field.default is not None and field.name not in exclude_fields]
        
        #matching with validation for fields not exist in post data
        missing_fields = [field for field in required_fields if field not in request.data]
        if missing_fields:
            return renderResponse(data= f'Missing required fields: {", ".join(missing_fields)}', message=f'Missing required fields: {", ".join(missing_fields)}', status=400)
        
        #Creating a copy of post data for Manipulation
        fields=request.data.copy()

        #Filtering the fields data to include only model fields and excluding the extra fields
        fieldsdata={key: value for key, value in fields.items() if key in model_fields}
        #Assigning Foreign key instance for Foreign key fields in the post data by getting the instance of the related model by the id
        for field in fields_info:
            if field.is_relation and field.name in fieldsdata and isinstance(fieldsdata[field.name], int):
                related_model=field.related_model
                try:
                    fieldsdata[field.name]=related_model.objects.get(id=fieldsdata[field.name])
                except related_model.DoesNotExist:
                    return renderResponse(data=f'Related {field.name} with id {fieldsdata[field.name]} does not exist', message=f'Related {field.name} with id {fieldsdata[field.name]} does not exist', status=404)

        # Create the model instance and saving data to the database
        model_instance=model_class.objects.create(**fieldsdata)

        # Serialize the model instance
        serialized_data = serialize('json', [model_instance])
        # Convert serialized data to JSON and extract fields
        model_json=json.loads(serialized_data)
        response_json=model_json[0]['fields']
        response_json['id']=model_json[0]['pk']

        return renderResponse(data=response_json, message='Data saved successfully', status=201)

