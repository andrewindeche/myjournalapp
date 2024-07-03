from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import User

# Create your tests here.
class UserTests(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        
        self.test_user = get_user_model().objects.create_user(
            username='existinguser',
            password='password123',
            email='existinguser@example.com'
        )
    
    def test_upload_profile_image(self):
        self.client.force_authenticate(user=self.user)
        image_data = {
            'profile_image': SimpleUploadedFile('test_image.jpg', b'file_content', content_type='image/jpeg')
        }
        response = self.client.patch(reverse('profile_update'), image_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('profile_image', response.data)
        
    def test_user_registration(self):
        response = self.client.post(reverse('register'), {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword',
            'confirm_password': 'testpassword',
        }, format='json')
        if response.status_code != 201:
            print("Registration API response:", response.data)
        self.assertEqual(response.status_code, 201)
        user_exists = get_user_model().objects.filter(username='newuser').exists()
        self.assertTrue(user_exists)

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
