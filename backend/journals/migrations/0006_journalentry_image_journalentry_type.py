# Generated by Django 5.0.6 on 2024-07-15 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journals', '0005_remove_journalentry_most_recent_entry'),
    ]

    operations = [
        migrations.AddField(
            model_name='journalentry',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='journal_images/'),
        ),
        migrations.AddField(
            model_name='journalentry',
            name='type',
            field=models.CharField(choices=[('text', 'Text'), ('image', 'Image')], default='text', max_length=5),
        ),
    ]
