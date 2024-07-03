from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

# Create your tests here.
class UserTests(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        
        self.test_user = get_user_model().objects.create_user(
            username='existinguser',
            password='password123',
            email='existinguser@example.com'
        )
        
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
