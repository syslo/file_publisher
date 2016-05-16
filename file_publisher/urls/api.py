from django.conf.urls import url

from ..views.nodes import FolderView, NodeViewSet, RevisionView
from ..views.resources import (FileResourceView, RedirectResourceView,
                               ResourceView)

app_name = 'file_publisher_api'

urlpatterns = [
    # Nodes
    url(
        r'^node/(?P<path>.*)$',
        NodeViewSet.as_view({'get': 'by_path'}),
        name='node_detail'
    ),
    url(
        r'^roots/$',
        NodeViewSet.as_view({'get': 'roots'}),
        name='roots'
    ),
    url(
        r'^folders/$',
        FolderView.as_view(),
        name='folders'
    ),
    url(
        r'^revisions/$',
        RevisionView.as_view(),
    ),

    # Resources
    url(
        r'^resources/$',
        ResourceView.as_view({'get': 'list'}),
    ),
    url(
        r'^resources/(?P<pk>[0-9]+)/download/$',
        ResourceView.as_view({'get': 'download'}),
        name='resource_download',
    ),
    url(
        r'^resources/file/$',
        FileResourceView.as_view()
    ),
    url(
        r'^resources/redirect/$',
        RedirectResourceView.as_view()
    ),
]
