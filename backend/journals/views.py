from rest_framework import generics, permissions
from .models import JournalEntry, Category
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import  JournalEntrySerializer, CategorySerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import Http404
import logging

logger = logging.getLogger(__name__)

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
class CategoryJournalEntriesView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)


# Journal Entry Views
class JournalEntryListCreateView(generics.ListCreateAPIView):
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        category_name = self.request.data.get('category')
        if category_name:
            category, created = Category.objects.get_or_create(name=category_name, user=self.request.user)
            serializer.save(user=self.request.user, category=category)
        else:
            serializer.save(user=self.request.user)
            
    def get_object(self):
        try:
            return JournalEntry.objects.filter(user=self.request.user).latest('created_at')
        except JournalEntry.DoesNotExist:
            raise Http404("No JournalEntry found for this user.")

class JournalEntryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user)
    
    def get_object(self):
        return JournalEntry.objects.filter(user=self.request.user).latest('created_at')

    def perform_update(self, serializer):
        category_name = self.request.data.get('category')
        if category_name:
            category, created = Category.objects.get_or_create(name=category_name, user=self.request.user)
            serializer.save(category=category)
        else:
            serializer.save()
            
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def most_recent_entry(request):
    user = request.user
    most_recent_entry = JournalEntry.objects.filter(user=user).order_by('-created_at').first()
    if most_recent_entry:
        serializer = JournalEntrySerializer(most_recent_entry)
        return Response(serializer.data)
    else:
        logger.warning(f"No recent entry found for user: {user}")
        return Response({'error': 'No recent entry found'}, status=404)