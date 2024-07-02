from .views import JournalEntryView
from rest_framework.routers import DefaultRouter
from . import views
from django.urls import path, include

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('journal/', JournalEntryView.as_view(), name='journal'),
]
