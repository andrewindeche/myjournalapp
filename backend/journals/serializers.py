from .models import JournalEntry,Category
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'user']
        read_only_fields = ['id', 'user']
        

class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['id', 'title', 'content', 'created_at', 'category', 'image']

class Journals(serializers.ModelSerializer):
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
        
    def validate(self, data):
        if not data.get('title'):
            raise serializers.ValidationError("Title cannot be empty.")
        
        if not data.get('content'):
            raise serializers.ValidationError("Content cannot be empty.")

        return data
        
    def create(self, validated_data):
        category_name = validated_data.pop('category', None)
        if category_name:
            category, created = Category.objects.get_or_create(name=category_name, user=validated_data['user'])
            validated_data['category'] = category
        return JournalEntry.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        category_name = validated_data.pop('category', None)
        if category_name:
            category, created = Category.objects.get_or_create(name=category_name, user=self.context['request'].user)
            validated_data['category'] = category
        return super().update(instance, validated_data)