from .views import (
    JournalEntryListCreateView, JournalEntryRetrieveUpdateDestroyView,
    CategoryListCreateView, CategoryJournalEntriesView
)
from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('entries/create/', JournalEntryListCreateView.as_view(), name='journalentry-list-create'),
     path('entries/', JournalEntryListCreateView.as_view(), name='journalentry-list-create'),
    path('entries/<int:pk>/', JournalEntryRetrieveUpdateDestroyView.as_view(), name='journalentry-detail'),
    path('entries-by-category/', CategoryJournalEntriesView.as_view(), name='entries-by-category'),
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
]
