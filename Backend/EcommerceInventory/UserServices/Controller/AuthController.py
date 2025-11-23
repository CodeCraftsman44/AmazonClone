from django.http import HttpResponse
from EcommerceInventory.permission import IsSuperAdmin
from EcommerceInventory.Helpers import renderResponse
from rest_framework.views import APIView
from UserServices.models import Users
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate

class SignupAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        profile_pic = request.data.get('profile_pic')

        emailCheck=Users.objects.filter(email=email)
        if emailCheck.exists():
            return renderResponse(data='Email already exists',message='Email already exists', status=status.HTTP_400_BAD_REQUEST)
        
        usernameCheck=Users.objects.filter(username=username)
        if usernameCheck.exists():
            return renderResponse(data='Username already exists',message='Username already exists', status=status.HTTP_400_BAD_REQUEST)

        if username is None or password is None or email is None:
            return renderResponse(data='Please provide username, password, and email',message='Please provide username, password, and email', status=status.HTTP_400_BAD_REQUEST)

        if Users.objects.filter(username=username).exists():
            return renderResponse(data='Username already exists',message='Username already exists', status=status.HTTP_400_BAD_REQUEST)

        user = Users.objects.create_user(username=username, password=password, email=email, profile_pic=profile_pic)
        if request.data.get('domain_user_id'):
            user.domain_user_id = Users.objects.get(id=request.data.get('domain_user_id'))
        user.save()

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        access['username'] = user.username
        access['email'] = user.email
        access['profile_pic'] = user.profile_pic

        return Response({'access':str(access), 'refresh':str(refresh),'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

    def get(self, request):
        return Response({'message': 'Please Use Post Method to Signup'})

class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if username is None or password is None:
            return renderResponse(data='Please provide both username and password',message= 'Please provide both username and password', status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token
            access['username'] = user.username
            access['email'] = user.email
            access['profile_pic'] = user.profile_pic

            return Response({
                'refresh': str(refresh),
                'access': str(access),
            })
        else:
            return renderResponse(data='Invalid Credentials',message='Invalid Credentials', status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request):
        return renderResponse(data='Please Use Post Method to Login', message='Please Use Post Method to Login', status=status.HTTP_200_OK)

class PublicAPIView(APIView):
    def get(self, request):
        return renderResponse(data='This is a public endpoint.', message='This is a public endpoint.', status=status.HTTP_200_OK)

class ProtectedAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        return renderResponse(data='This is a protected endpoint.', message='This is a protected endpoint.', status=status.HTTP_200_OK)

class SuperAdminCheckApi(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        return renderResponse(data='This is a Super Admin Api.', message='This is a Super Admin Api.', status=status.HTTP_200_OK)
