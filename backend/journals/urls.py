from .views import (
    JournalEntryListCreateView, JournalEntryRetrieveUpdateDestroyView,
    CategoryListCreateView, CategoryJournalEntriesView, CategoryRetrieveUpdateDestroyView
)
from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('entries-create/', JournalEntryListCreateView.as_view(), name='journalentry-list-create'),
    path('entries-update/<int:pk>/', JournalEntryRetrieveUpdateDestroyView.as_view(), name='journalentry-detail'),
    path('categories-view/<int:pk>/', CategoryJournalEntriesView.as_view(), name='entries-by-category'),
    path('categories-create/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryRetrieveUpdateDestroyView.as_view(), name='category-detail'),
]

