import rules
from django.contrib.auth.models import AbstractUser
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
