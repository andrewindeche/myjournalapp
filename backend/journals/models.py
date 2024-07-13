from django.db import models
from accounts.models import User

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')

    def __str__(self):
        return self.name
    
class JournalEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entries')
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    most_recent_entry = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.most_recent_entry:
            JournalEntry.objects.filter(user=self.user, most_recent_entry=True).update(most_recent_entry=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title