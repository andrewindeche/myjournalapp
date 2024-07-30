from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import JournalEntry, Category,User
from django.core.files.uploadedfile import SimpleUploadedFile

# Create your tests here.
class JournalEntryTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.category = Category.objects.create(name='Test Category', user=self.user)
        self.client.force_authenticate(user=self.user)
        self.entry = JournalEntry.objects.create(
            title='Original Title',
            content_text='Original Content',
            user=self.user,
            category=self.category
        )
        self.mock_image = SimpleUploadedFile(
            "test_image.jpg",
            b"file_content",
            content_type="image/jpeg"
        )

    def test_create_journal_entry(self):
        url = reverse('journalentry-list-create')
        data = {
            'title': 'Test Entry',
            'content': 'This is a test entry.',
            'category': self.category.name, 
            'user': self.user.id,
        }
        entry = JournalEntry.objects.create(
            title='New Entry',
            content_text='Some content',
            user=self.user,
            category=self.category
        )
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JournalEntry.objects.count(), 2)

    def test_update_journal_entry(self):
        entry = JournalEntry.objects.get(id=self.entry.id)
        url = reverse('journalentry-detail', args=[entry.id])
        updated_data = {
            'title': 'Updated Title',
            'content': 'Updated Content',
            'category': self.category.name 
        }
        response = self.client.put(url, updated_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        entry.refresh_from_db()
        self.assertEqual(entry.title, 'Updated Title')

    def test_retrieve_journal_entry(self):
        url = reverse('journalentry-detail', args=[self.entry.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'Original Title')

    def test_delete_journal_entry(self):
        url = reverse('journalentry-detail', args=[self.entry.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(JournalEntry.objects.count(), 0)

#Category Test cases
class CategoryTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.client.force_authenticate(user=self.user)
    
    def test_create_category(self):
        url = reverse('category-list-create')
        data = {
            'name': 'Test Category',
            'user': self.user.id,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 1)
        self.assertEqual(Category.objects.get().name, 'Test Category')

    def test_category_edge_cases(self):
        url = reverse('category-list-create')
        response = self.client.post(url, {'name': ''}, format='json')
        self.assertEqual(response.status_code, 400) 

        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, 400) 
    
