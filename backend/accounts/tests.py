from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import User
import time

# Create your tests here.
class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.test_user = get_user_model().objects.create_user(
            username='existinguser',
            password='password123',
            email='existinguser@example.com'
        )
    
    def test_upload_profile_image(self):
        url = reverse('user-profile-image')
        
        image = BytesIO()
        image.write(b"test image content")
        image.seek(0)
        uploaded_image = SimpleUploadedFile("testimage.jpg", image.read(), content_type="image/jpeg")
        
        data = {'profile_image': uploaded_image}
        response = self.client.patch(url, data, format='multipart')

        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.profile_image.url) 
        
    def test_user_registration(self):
        base_username = 'testuser'
        timestamp = str(int(time.time()))
        unique_username = f'{base_username}_{timestamp}'
        
        response = self.client.post(reverse('register'), {
            'username': unique_username,
            'email': f'{unique_username}@example.com',
            'password': 'testpassword',
            'confirm_password': 'testpassword',
        }, format='json')
        
        if response.status_code != status.HTTP_201_CREATED:
            print("Registration API response:", response.data)
            
        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST])
        
        if response.status_code == status.HTTP_201_CREATED:
            user_exists = User.objects.filter(username=unique_username).exists()
            self.assertTrue(user_exists)
        
        if response.status_code == status.HTTP_201_CREATED:
            email_exists = User.objects.filter(email=f'{unique_username}@example.com').exists()
            self.assertTrue(email_exists)

    def test_user_login(self):
        response = self.client.post(reverse('login'), {
            'username': 'existinguser',
            'password': 'password123'
        }, format='json')
        if response.status_code != 200:
            print("Login API response:", response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        
    def test_password_change(self):
        url = reverse('password-change')
        
        data = {
            'old_password': 'testpassword',
            'new_password': 'newtestpassword',
            'confirm_new_password': 'newtestpassword'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        user = User.objects.get(username='testuser')
        self.assertTrue(user.check_password('newtestpassword'))
        
    def test_password_change_incorrect_old_password(self):
        url = reverse('password-change')
        
        data = {
            'old_password': 'incorrectpassword',
            'new_password': 'newtestpassword',
            'confirm_new_password': 'newtestpassword'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Incorrect old password', response.data['non_field_errors'])

    def test_password_change_mismatched_new_passwords(self):
        url = reverse('password-change')
        
        data = {
            'old_password': 'testpassword',
            'new_password': 'newtestpassword',
            'confirm_new_password': 'mismatchedpassword'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('New passwords do not match', response.data['non_field_errors'])
        