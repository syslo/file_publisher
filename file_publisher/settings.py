from django.conf import settings


def get_setting(name, default):
    return getattr(settings, 'FILE_PUBLISHER_%s' % name, default)


BASE_FOLDER = get_setting('BASE_FOLDER', 'file_publisher')
SERVE_BY_REDIRECT = get_setting('SERVE_BY_REDIRECT', False)
