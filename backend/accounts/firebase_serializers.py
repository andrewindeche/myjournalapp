# firebase_serializers.py
from rest_framework import serializers

class FirebaseAuthTokenSerializer(serializers.Serializer):
    firebase_auth_token = serializers.CharField()