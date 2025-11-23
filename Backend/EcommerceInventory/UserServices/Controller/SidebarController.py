from EcommerceInventory.Helpers import renderResponse
from UserServices.models import Modules
#from rest_framework import generics
from rest_framework.views import APIView
from django.core.serializers import serialize
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated,AllowAny
import json
from django.db.models import Q

class ModuleView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]

    authentication_classes = []          # override any global auth
    permission_classes = [AllowAny]

    def get(self, request):
        # Top-level menus (no parent)parent_id=None
        menus=Modules.objects.filter(is_menu=True, is_active=True, parent_id=None).order_by('display_order')
        serialized_menus=serialize('json', menus)
        serialized_menus=json.loads(serialized_menus)

        cleaned_menus=[]
        for menu in serialized_menus:
            menu['fields']['id']=menu['pk']
            menu['fields']['submenus']=Modules.objects.filter(parent_id=menu['pk'], is_active=True, is_menu=True).order_by('display_order').values('id', 'module_name','module_icon', 'is_menu', 'is_active','module_url', 'parent_id', 'module_description' )
            cleaned_menus.append(menu['fields'])

        
        return renderResponse(data=cleaned_menus, message='All Modules', status=200)
