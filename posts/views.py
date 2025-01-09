from rest_framework import viewsets
from rules.contrib.rest_framework import AutoPermissionViewSetMixin

from . import models, serializers


class PostCategoryViewSet(AutoPermissionViewSetMixin, viewsets.ModelViewSet):
    queryset = models.PostCategory.objects.all()
    serializer_class = serializers.PostCategorySerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "list":
            return qs.filter(parent__isnull=True)
        return qs


class PostViewSet(AutoPermissionViewSetMixin, viewsets.ModelViewSet):
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
