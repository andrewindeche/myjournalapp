from .views import RegisterView,LoginView,UserProfileView,PasswordChangeAPIView,UserProfileImageView
from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='api-login'),
    path('profile/update/', UserProfileView.as_view(), name='profile_update'),
    path('profile/update/profile-image/', UserProfileImageView.as_view(), name='user-profile-image'),
    path('profile/update/password-change/', PasswordChangeAPIView.as_view(), name='password-change'),
]
