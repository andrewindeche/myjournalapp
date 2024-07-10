from .views import (
    JournalEntryListCreateView, JournalEntryRetrieveUpdateDestroyView,
    CategoryListCreateView, CategoryRetrieveUpdateDestroyView
)
from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('entries/create/', JournalEntryListCreateView.as_view(), name='journalentry-list-create'),
    path('entries/<int:pk>/edit', JournalEntryRetrieveUpdateDestroyView.as_view(), name='journalentry-detail'),
    path('categories/create/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/edit', CategoryRetrieveUpdateDestroyView.as_view(), name='category-detail'),
]
