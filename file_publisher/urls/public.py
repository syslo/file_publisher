from django.conf.urls import url

from ..views.download import download

app_name = 'file_publisher_public'

urlpatterns = [
    url(r'^(?P<path>.*)$', download, name='download'),
]
