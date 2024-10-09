from .models import User
from rest_framework import serializers
from django.contrib.auth import password_validation
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth import get_user_model
from firebase_admin import auth
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password')

    def validate(self, data):
        errors = {}

        if not data.get('username', '').strip():
            errors['username'] = "Username may not be blank."
        if not data.get('email', '').strip():
            errors['email'] = "Email may not be blank."
        if not data.get('password', '').strip():
            errors['password'] = "Password may not be blank."
        if not data.get('confirm_password', '').strip():
            errors['confirm_password'] = "Confirm Password may not be blank."

        if data.get('password') != data.get('confirm_password'):
            errors['confirm_password'] = "Passwords do not match."

        if User.objects.filter(username=data.get('username')).exists():
            errors['username'] = "This username is already in use."
        if User.objects.filter(email=data.get('email')).exists():
            errors['email'] = "This email address is already registered."

        try:
            validate_password(data['password'])
        except DjangoValidationError as e:
            errors['password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio']
        
class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Incorrect old password")
        return value
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_new_password']:
            raise serializers.ValidationError("New passwords do not match")
        return attrs

    def save(self):
        user = self.context['request'].user
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return self.validated_data

class TokenObtainSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if not username or not password:
            raise serializers.ValidationError("Both username and password are not valid.")
        if not username:
            raise serializers.ValidationError({"username": "Username field is required."})   
        if not password:
            raise serializers.ValidationError({"password": "Password field is required."})

        return attrs

class TokenPairSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()

    def create(self, validated_data):
        return RefreshToken(validated_data['refresh'])

    def update(self, instance, validated_data):
        pass
    
class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if not username or not password:
            raise serializers.ValidationError(_("Both username and password are required."))
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError(_("User with this username does not exist."))

        if not user.check_password(password):
            raise serializers.ValidationError(_("Incorrect password for this username."))

        return super().validate(attrs)

class DeleteUserSerializer(serializers.Serializer):
    """
    Serializer for deleting a user account.
    """
    def validate(self, attrs):
        return attrs
