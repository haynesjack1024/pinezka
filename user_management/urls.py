from django.urls import path
from rest_framework import routers

from . import views

router = routers.SimpleRouter()
router.register(r"users", views.UserViewSet)
urlpatterns = router.urls + [
    path("login/", views.authenticate_user, name="login"),
    path("check-session/", views.check_session, name="check-session"),
]
