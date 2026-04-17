from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string

def send_verification_email(user, verification_code):
    subject = 'Verify your MyJournalApp email'
    message = f'Your verification code is: {verification_code}'
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )

def send_welcome_email(user):
    subject = 'Welcome to MyJournalApp'
    message = f'Welcome {user.username}! Your account has been created successfully.'
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )

def send_password_reset_email(user, reset_code):
    subject = 'Reset your MyJournalApp password'
    message = f'Your password reset code is: {reset_code}'
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )