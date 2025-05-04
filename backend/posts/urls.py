from rest_framework import routers

from . import views

router = routers.SimpleRouter()
router.register("post-categories", views.PostCategoryViewSet)
router.register(r"posts", views.PostViewSet)
urlpatterns = router.urls
