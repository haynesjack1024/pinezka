from common import rules as common_rules
from django.db import models
from rules.contrib import models as rules_models


class City(rules_models.RulesModel):
    name = models.CharField(max_length=60, unique=True)

    class Meta:
        rules_permissions = common_rules.user_readonly_ruleset

    def __str__(self):
        return self.name
