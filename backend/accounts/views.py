from django.shortcuts import render
from firebase_admin import auth
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User
from django.contrib.auth import logout
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserProfileSerializer,TokenObtainSerializer,DeleteUserSerializer
from .serializers import TokenPairSerializer,RegisterSerializer,LoginSerializer,PasswordChangeSerializer
from rest_framework.permissions import AllowAny 

# Create your views here.
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
class ObtainTokenPairView(TokenObtainPairView):
    serializer_class = TokenObtainSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        token_pair = self.get_tokens_for_user(serializer.validated_data['username'])
        return Response(TokenPairSerializer(token_pair).data, status=status.HTTP_200_OK)

obtain_token_pair = ObtainTokenPairView.as_view()

class PasswordChangeAPIView(generics.UpdateAPIView):
    serializer_class = PasswordChangeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def put(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteUserView(generics.DestroyAPIView):
    serializer_class = DeleteUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def perform_destroy(self, instance):
        instance.delete()
        logout(self.request)
    
    def delete(self, request, *args, **kwargs):
        self.perform_destroy(self.get_object())
        return Response({'message': 'Account deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    
class FirebaseGoogleLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            firebase_token = request.data.get('firebase_auth_token')
            decoded_token = auth.verify_id_token(firebase_token)
            firebase_uid = decoded_token['uid']

            user, created = User.objects.get_or_create(username=firebase_uid)

            refresh = RefreshToken.for_user(user)

            return Response({
                'message': 'Login successful.',
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)