from .views import RegisterView,LoginView,UserProfileView
from rest_framework.routers import DefaultRouter
from . import views
from django.urls import path, include
from .views import obtain_token_pair

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/update/', UserProfileView.as_view(), name='profile_update'),
    path('api/token/', obtain_token_pair, name='token_obtain_pair'),
]
