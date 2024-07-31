from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import JournalEntry, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')
    search_fields = ('name',)
    list_filter = ('user',)

class JournalEntryAdmin(admin.ModelAdmin):
    fields = ('title', 'content_text', 'content_image', 'category', 'created_at')
    readonly_fields = ('created_at',)
    list_display = ('title', 'content_text', 'content_image', 'category', 'created_at')

admin.site.register(JournalEntry)