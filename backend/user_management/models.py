import rules
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from rules.contrib.models import RulesModelBase, RulesModelMixin

from . import rules as user_management_rules


class User(RulesModelMixin, AbstractUser, metaclass=RulesModelBase):
    class Meta:
        rules_permissions = {
            "add": rules.always_allow,
            "view": rules.is_authenticated,
            "change": user_management_rules.is_owner | rules.is_staff,
            "delete": user_management_rules.is_owner | rules.is_staff,
        }


class AdditionalField(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="additional_fields",
    )
    name = models.CharField(max_length=20)
    value = models.CharField(max_length=120)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "name"], name="unique_additional_field"
            )
        ]
