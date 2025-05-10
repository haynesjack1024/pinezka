from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import connection, models
from django.utils.translation import gettext as _
from model_utils import models as model_utils_models
from rules.contrib.models import RulesModel, RulesModelBase, RulesModelMixin

from common import rules as common_rules

from . import rules


class PostCategory(RulesModel):
    parent = models.ForeignKey(
        "self", null=True, on_delete=models.PROTECT, related_name="subcategories"
    )
    name = models.CharField(max_length=128)

    class Meta:
        rules_permissions = common_rules.user_readonly_ruleset

    def get_full_display_path(self) -> str:
        """Get absolute category path, for display purposes."""
        with connection.cursor() as cursor:
            cursor.execute(
                """
                WITH RECURSIVE cte AS (
                    SELECT
                        1 AS n,
                        %s AS path,
                        %s AS id
                    UNION
                    SELECT
                        n + 1,
                        CONCAT(name, ' > ', path),
                        parent_id
                    FROM cte JOIN posts_postcategory ON cte.id=posts_postcategory.id
                )
                SELECT path FROM (
                    SELECT MAX(n), path FROM cte
                );
                """,
                [
                    self.name,
                    self.parent_id,
                ],
            )
            full_path = cursor.fetchone()[0]
        return full_path

    def __str__(self):
        return self.get_full_display_path()

    @staticmethod
    def validate_is_unique(name: str, parent_id: int = None):
        if (
            category := (
                PostCategory.objects.filter(parent__isnull=True)
                if parent_id is None
                else PostCategory.objects.filter(parent_id=parent_id)
            )
            .filter(name=name)
            .first()
        ):
            raise ValidationError(
                _("Post category `%(path)s` already exists."),
                code="post_category_duplicate",
                params={"path": category},
            )

    def clean(self):
        super().clean()
        self.validate_is_unique(self.name, self.parent_id)

    def save(self, *args, **kwargs):
        self.validate_is_unique(self.name, self.parent_id)
        super().save(*args, **kwargs)


class Post(
    RulesModelMixin, model_utils_models.TimeStampedModel, metaclass=RulesModelBase
):
    city = models.ForeignKey(
        "cities.City", on_delete=models.PROTECT, related_name="posts"
    )
    category = models.ForeignKey(
        PostCategory, null=True, on_delete=models.PROTECT, related_name="posts"
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        on_delete=models.SET_NULL,
        editable=False,
        related_name="posts",
    )
    title = models.CharField(max_length=130)
    content = models.TextField()
    expiry = models.DateField(_("Expires at"))
    views = models.ManyToManyField(settings.AUTH_USER_MODEL)

    class Meta:
        rules_permissions = common_rules.get_public_ownership_ruleset(rules.is_owner)
