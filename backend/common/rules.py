import rules

user_readonly_ruleset = rules.RuleSet()
user_readonly_ruleset.add_rule("add", rules.is_staff)
user_readonly_ruleset.add_rule("view", rules.is_authenticated)
user_readonly_ruleset.add_rule("change", rules.is_staff)
user_readonly_ruleset.add_rule("delete", rules.is_staff)


def get_public_ownership_ruleset(is_owner: callable) -> rules.RuleSet:
    ownership_ruleset = rules.RuleSet()
    ownership_ruleset.add_rule("add", rules.is_authenticated)
    ownership_ruleset.add_rule("view", rules.is_authenticated)
    ownership_ruleset.add_rule("change", is_owner | rules.is_staff)
    ownership_ruleset.add_rule("delete", is_owner | rules.is_staff)
    return ownership_ruleset
