from rest_framework import viewsets
from rest_framework.decorators import action
from rules.contrib.rest_framework import AutoPermissionViewSetMixin

from . import models, serializers


class PostCategoryViewSet(AutoPermissionViewSetMixin, viewsets.ModelViewSet):
    queryset = models.PostCategory.objects.all()
    serializer_class = serializers.PostCategorySerializer

    permission_type_map = {
        **AutoPermissionViewSetMixin.permission_type_map,
        "all": None,
    }

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "list":
            return qs.filter(parent__isnull=True)
        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.PostCategoryTinySerializer
        if self.action == "all":
            return serializers.PostCategoryFullNameSerializer
        return super().get_serializer_class()

    @action(detail=False)
    def all(self, request):
        return self.list(request)


class PostViewSet(AutoPermissionViewSetMixin, viewsets.ModelViewSet):
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
