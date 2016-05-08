from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from file_publisher.constants import REDIRECT_TYPE
from file_publisher.models import Node, Resource, Revision


def create_nodes(level, parent, path):
    if level <= 0:
        res = Resource(type=REDIRECT_TYPE)
        res.path = 'https://api.adorable.io/avatars/285/%s@example.png' % path
        res.save()
        rev = Revision(node=parent, resource=res)
        rev.save()
        return

    for name in "abcde":
        n = Node(name=name, parent=parent, is_folder=(level > 1))
        n.save()
        create_nodes(level-1, n, '%s.%s' % (path, name))


class Command(BaseCommand):
    help = 'Creates simple testdata'

    def handle(self, *args, **options):
        u = User(username='root', is_superuser=True, is_staff=True)
        u.set_password('root')
        u.save()

        create_nodes(4, Node.objects.get_root(), 'root')
