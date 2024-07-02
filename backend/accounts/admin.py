from django.contrib import admin
from .models import User
from journals.models import JournalEntry

# Register your models here.
admin.site.register(JournalEntry)
admin.site.register(User)
