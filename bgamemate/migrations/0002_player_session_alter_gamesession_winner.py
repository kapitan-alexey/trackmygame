# Generated by Django 5.0.1 on 2024-01-08 08:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bgamemate', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='session',
            field=models.ManyToManyField(to='bgamemate.gamesession'),
        ),
        migrations.AlterField(
            model_name='gamesession',
            name='winner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='bgamemate.player'),
        ),
    ]
