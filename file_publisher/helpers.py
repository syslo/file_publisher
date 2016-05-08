from django.core.files.storage import default_storage
from django.db.models import Q
from django.http import Http404, HttpResponse
from django.shortcuts import redirect
from django.utils.encoding import smart_str

from .constants import FILE_TYPE, REDIRECT_TYPE, ROOT_NAME
from .settings import SERVE_BY_REDIRECT


def tokenize_path(path):
    tokens = path.split('/')
    if tokens and tokens[-1] == '':
        tokens = tokens[:-1]
    if tokens and tokens[0] == '':
        tokens = tokens[1:]
    return tokens


def download_resource_view(resource):
    if resource is None:
        raise Http404()

    if resource.type == FILE_TYPE:
        if SERVE_BY_REDIRECT:
            return redirect(default_storage.url(resource.path))

        response = HttpResponse(
            default_storage.open(resource.path),
            content_type='application/force-download',
        )
        response['Content-Disposition'] = (
            'attachment; filename="%s"' % smart_str(resource.name)
        )
        return response

    if resource.type == REDIRECT_TYPE:
        return redirect(resource.path)

    raise Http404()


def user_has_node_permission_Q(user, prefix=''):
    if user.is_superuser:
        return Q()
    return (
        Q(**{('%sediting_users' % prefix): user}) |
        Q(**{('%sediting_groups__user' % prefix): user})
    )


def root_Q(prefix=''):
    return Q(**{
        ('%sparent__isnull' % prefix): True,
        ('%sname' % prefix): ROOT_NAME,
    })
