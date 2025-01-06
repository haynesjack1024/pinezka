from django.contrib.auth import authenticate, get_user_model, login
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rules.contrib.rest_framework import AutoPermissionViewSetMixin

from . import serializers


class UserViewSet(AutoPermissionViewSetMixin, viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = serializers.UserSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return super().get_permissions()


@api_view(["GET"])
def check_session(request):
    return Response(serializers.UserSerializer(request.user).data)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def authenticate_user(request):
    serializer = serializers.UserAuthenticationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    if (
        user := authenticate(
            request,
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )
    ) is not None:
        login(request, user)
        return Response(serializers.UserSerializer(user).data)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)
