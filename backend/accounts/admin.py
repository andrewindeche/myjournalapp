from django.contrib import admin
from .models import User
from journals.models import JournalEntry
from django.contrib.auth.admin import UserAdmin

# Register your models here.
admin.site.register(JournalEntry)

class CustomUserAdmin(UserAdmin):
    model = User
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('bio', 'profile_image')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('bio', 'profile_image')}),
    )
    list_display = ('username', 'email', 'location', 'bio', 'profile_image')

admin.site.register(User, CustomUserAdmin)
