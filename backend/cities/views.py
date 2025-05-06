from rest_framework import viewsets
from rules.contrib.rest_framework import AutoPermissionViewSetMixin

from . import models, serializers


class CityViewSet(AutoPermissionViewSetMixin, viewsets.ModelViewSet):
    queryset = models.City.objects.all()
    serializer_class = serializers.CitySerializer
