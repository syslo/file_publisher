from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404

from ..helpers import download_resource_view, tokenize_path
from ..models import Node


def download(request, path):
    tokens = tokenize_path(path)

    try:
        node = Node.objects.get_path(tokens)
        revision = node.revisions.order_by('-created')[:1].get()
    except ObjectDoesNotExist:
        raise Http404

    return download_resource_view(revision.resource)
