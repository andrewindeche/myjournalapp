from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import JournalEntry, Category,User

# Create your tests here.
class JournalEntryTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.category = Category.objects.create(name='Test Category', user=self.user)

    def test_create_journal_entry(self):
        url = reverse('journalentry-list')
        data = {
            'title': 'Test Entry',
            'content': 'This is a test entry.',
            'category': self.category.name,  # Optional, depends on your serializer
            'user': self.user.id,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JournalEntry.objects.count(), 1)
        self.assertEqual(JournalEntry.objects.get().title, 'Test Entry')

    def test_update_journal_entry(self):
        entry = JournalEntry.objects.create(title='Original Title', content='Original Content', user=self.user)
        url = reverse('journalentry-detail', args=[entry.id])
        updated_data = {
            'title': 'Updated Title',
            'content': 'Updated Content',
        }
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        entry.refresh_from_db()
        self.assertEqual(entry.title, 'Updated Title')

    def test_retrieve_journal_entry(self):
        entry = JournalEntry.objects.create(title='Test Entry', content='This is a test entry.', user=self.user)
        url = reverse('journalentry-detail', args=[entry.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Entry')

    def test_delete_journal_entry(self):
        entry = JournalEntry.objects.create(title='Test Entry', content='This is a test entry.', user=self.user)
        url = reverse('journalentry-detail', args=[entry.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(JournalEntry.objects.filter(id=entry.id).exists())

#Category Test cases
class CategoryTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')

    def test_create_category(self):
        url = reverse('category-list')
        data = {
            'name': 'Test Category',
            'user': self.user.id,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 1)
        self.assertEqual(Category.objects.get().name, 'Test Category')

    def test_update_category(self):
        category = Category.objects.create(name='Original Category', user=self.user)
        url = reverse('category-detail', args=[category.id])
        updated_data = {
            'name': 'Updated Category',
        }
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        category.refresh_from_db()
        self.assertEqual(category.name, 'Updated Category')

    def test_retrieve_category(self):
        category = Category.objects.create(name='Test Category', user=self.user)
        url = reverse('category-detail', args=[category.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Category')

    def test_delete_category(self):
        category = Category.objects.create(name='Test Category', user=self.user)
        url = reverse('category-detail', args=[category.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Category.objects.filter(id=category.id).exists())

    
