# forms.py
from django import forms
from .models import JournalEntry, Category,  User

class JournalEntryForm(forms.ModelForm):
    class Meta:
        model = JournalEntry
        fields = ['title', 'content', 'category']

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name']
        
class UserProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['bio', 'profile_image']
