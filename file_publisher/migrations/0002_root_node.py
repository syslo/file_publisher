# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-05-02 09:34
from __future__ import unicode_literals

from django.db import migrations

ROOT_NAME = '__root__'


def create_root(apps, schema_editor):
        Node = apps.get_model("file_publisher", "Node")
        Node(name=ROOT_NAME, parent=None, is_folder=True).save()


class Migration(migrations.Migration):

    dependencies = [
        ('file_publisher', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_root),
    ]
