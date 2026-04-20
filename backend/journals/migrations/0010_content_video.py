from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journals', '0009_alter_journalentry_content_image_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='journalentry',
            name='content_video',
            field=models.ImageField(blank=True, null=True, upload_to='content_videos/'),
        ),
    ]