from rest_framework import routers

from . import views

router = routers.SimpleRouter()
router.register(r"cities", views.CityViewSet)
urlpatterns = router.urls
