from .models import JournalEntry,Category
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'user']
        read_only_fields = ['id', 'user']

class JournalEntrySerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        queryset=Category.objects.all(),
        slug_field='name',
        allow_null=True,
        required=False
    )

    class Meta:
        model = JournalEntry
        fields = ['id', 'user', 'title', 'content', 'category', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']