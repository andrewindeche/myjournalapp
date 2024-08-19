from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


# Create your models here.
class User(AbstractUser):
        username = models.CharField(_('Name'), max_length=150, unique=True)
        email = models.EmailField(_('Email address'), unique=True)
        location = models.CharField(_('Location'), max_length=255, blank=True)
        bio = models.TextField(blank=True, null=True)
        
        def __str__(self):
            return self.username
    

