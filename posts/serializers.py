from django.core.exceptions import ValidationError
from rest_framework import exceptions, serializers

from cities import models as cities_models
from user_management.serializers import UserSerializer

from . import models


class PostCategoryTinySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PostCategory
        fields = ["id", "name"]


class PostCategorySerializer(serializers.ModelSerializer):
    subcategories = PostCategoryTinySerializer(many=True, read_only=True)

    class Meta:
        model = models.PostCategory
        fields = ["id", "parent", "name", "subcategories"]

    def validate(self, attrs):
        try:
            models.PostCategory.validate_is_unique(attrs["name"], attrs["parent"])
        except ValidationError as e:
            raise exceptions.ValidationError(e.message % e.params, e.code)


class PostSerializer(serializers.ModelSerializer):
    city = serializers.SlugRelatedField(
        slug_field="name", queryset=cities_models.City.objects.all()
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=models.PostCategory.objects.all()
    )
    author = UserSerializer(read_only=True)

    class Meta:
        model = models.Post
        fields = "__all__"
