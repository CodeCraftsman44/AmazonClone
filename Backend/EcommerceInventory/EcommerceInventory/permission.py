from rest_framework.permissions import BasePermission
from rest_framework import status
from EcommerceInventory.Helpers import renderResponse


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        if hasattr(request.user, 'role') and request.user.role == 'SuperAdmin':
            return True
        return False
    def __call__(self,request):
        if not self.has_permission(request, None):
            return renderResponse(data='You are not authorized to access this page', message='You are not authorized to access this page', status=status.HTTP_401_UNAUTHORIZED)
