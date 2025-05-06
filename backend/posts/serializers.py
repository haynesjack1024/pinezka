from itertools import chain

from django.core.exceptions import ValidationError
from django.db import connection
from rest_framework import exceptions, serializers

from cities import models as cities_models
from user_management.serializers import UserSerializer

from . import models


class PostCategoryFullNameSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = models.PostCategory
        fields = ["id", "full_name"]

    def get_full_name(self, obj: models.PostCategory):
        return str(obj).split(" > ")


class PostCategoryTinySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PostCategory
        fields = ["id", "name"]


class PostCategorySerializer(serializers.ModelSerializer):
    subcategories = PostCategoryTinySerializer(many=True, read_only=True)
    children = serializers.SerializerMethodField()

    class Meta:
        model = models.PostCategory
        fields = ["id", "parent", "children", "name", "subcategories"]

    def validate(self, attrs):
        try:
            models.PostCategory.validate_is_unique(attrs["name"], attrs["parent"])
        except ValidationError as e:
            raise exceptions.ValidationError(e.message % e.params, e.code)

    def get_children(self, category: "models.PostCategory") -> list[int]:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                WITH RECURSIVE cte AS (
                    SELECT
                        1 as n,
                        %s as id
                    UNION
                    SELECT
                        n + 1,
                        posts_postcategory.id
                    FROM cte JOIN posts_postcategory ON cte.id=posts_postcategory.parent_id
                )
                SELECT id FROM cte WHERE n > 1;
                """,
                [category.id],
            )
            children = list(chain(*cursor.fetchall()))
        return children


class PostSerializer(serializers.ModelSerializer):
    city = serializers.SlugRelatedField(
        slug_field="name", queryset=cities_models.City.objects.all()
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=models.PostCategory.objects.all()
    )
    author = UserSerializer(read_only=True)
    views = serializers.SerializerMethodField()

    class Meta:
        model = models.Post
        fields = "__all__"

    def get_views(self, obj: "models.Post"):
        return obj.views.count()
