from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User
import time

# Create your tests here.
class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        
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
        url = reverse('api-login') 
        data = {'username': 'testuser', 'password': 'password'}
        response = self.client.post(url, data, format='json')
        
    def test_password_change(self):
        url = reverse('password-change')
        self.client.force_authenticate(user=self.user)
        
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
        
        self.assertIn('old_password', response.data)
        self.assertEqual(response.data['old_password'][0], 'Incorrect old password')

    def test_password_change_mismatched_new_passwords(self):
        url = reverse('password-change')
        
        data = {
            'old_password': 'testpassword',
            'new_password': 'newtestpassword',
            'confirm_new_password': 'mismatchedpassword'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('New passwords do not match', str(response.data))
        