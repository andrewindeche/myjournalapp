from .models import JournalEntry
from rest_framework import serializers

class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['id', 'title', 'content', 'category', 'created_at']