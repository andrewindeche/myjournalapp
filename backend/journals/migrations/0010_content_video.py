from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journals', '0009_alter_journalentry_content_image_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='journalentry',
            name='content_video',
            field=models.CharField(max_length=100, blank=True, null=True),
        ),
    ]