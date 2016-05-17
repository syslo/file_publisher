from django import template

register = template.Library()


@register.inclusion_tag('file_publisher/app.html')
def file_publisher_app(bundle_url=''):
    return {
        'bundle_url': bundle_url,
    }
