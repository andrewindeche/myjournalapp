from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import JournalEntry

class JournalEntryAdmin(admin.ModelAdmin):
    fields = ('title', 'content_text', 'content_image', 'category', 'created_at')
    readonly_fields = ('created_at',)
    list_display = ('title', 'content_text', 'content_image', 'category', 'created_at')

admin.site.register(JournalEntry)