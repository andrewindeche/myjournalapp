from .views import RegisterView,LoginView,UserProfileView,PasswordChangeAPIView,DeleteUserView,FirebaseGoogleLoginView
from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='api-login'),
    path('profile/', UserProfileView.as_view(), name='profile_update'),
    path('password-change/', PasswordChangeAPIView.as_view(), name='password-change'),
    path('profile/delete/', DeleteUserView.as_view(), name='delete_user'),
    path('google-login/', FirebaseGoogleLoginView.as_view(), name='google-login'),
]
