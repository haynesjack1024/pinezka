import rules


@rules.predicate
def is_owner(user, obj):
    return user.pk == obj.pk
