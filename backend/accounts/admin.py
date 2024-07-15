from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin

# Register your models here.

class CustomUserAdmin(UserAdmin):
    model = User
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('bio', 'profile_image')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'username', 'email', 'password', 'bio', 'profile_image'}),
    )
    list_display = ('username', 'email', 'location', 'bio', 'profile_image')
    
    def profile_image_thumbnail(self, obj):
        if obj.profile_image:
            return mark_safe('<img src="{url}" width="50" height="50" />'.format(url=obj.profile_image.url))
        else:
            return '(No image)'

    profile_image_thumbnail.short_description = 'Profile Image'

admin.site.register(User, CustomUserAdmin)
