from typing import TYPE_CHECKING

import rules

if TYPE_CHECKING:
    from . import models


@rules.predicate
def is_owner(user, obj: "models.Post"):
    return user.pk == obj.author.pk
