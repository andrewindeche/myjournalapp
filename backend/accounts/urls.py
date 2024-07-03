from .views import RegisterView,LoginView,UserProfileView,PasswordChangeAPIView,TokenObtainPairView
from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/update/', UserProfileView.as_view(), name='profile_update'),
    path('profile/update/password-change/', PasswordChangeAPIView.as_view(), name='password-change'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]
