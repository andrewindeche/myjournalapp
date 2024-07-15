from django.db import models
from accounts.models import User

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')

    def __str__(self):
        return self.name
    
class JournalEntry(models.Model):
    TYPE_CHOICES = (
        ('text', 'Text'),
        ('image', 'Image'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entries')
    type = models.CharField(max_length=5, choices=TYPE_CHOICES, default='text')
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='journal_images/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

def __str__(self):
        return self.title