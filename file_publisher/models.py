from django.conf import settings
from django.contrib.auth.models import Group
from django.db import models
from django.db.models import Q

from .constants import RESOURCE_TYPES
from .helpers import root_Q, user_has_node_permission_Q


class NodeQuerySet(models.QuerySet):

    def get_path(self, path, user=None):
        prefix = ""
        nameQ = Q()
        permQ = ~Q()
        for item in reversed(path):
            nameQ &= Q(**{('%sname' % prefix): item})
            if user:
                permQ |= user_has_node_permission_Q(user, prefix)
            prefix = "parent__%s" % prefix

        qs = self.filter(nameQ).filter(root_Q(prefix=prefix))
        if user:
            qs = qs.filter(permQ)

        return qs.distinct().get()

    def get_root(self):
        return self.get(root_Q())

    def get_or_create_by_path(self, path, user=None):
        if len(path) < 1:
            return self.get_root(), True
        parent = self.folders().get_path(path[:-1], user)
        return self.get_or_create(parent=parent, name=path[-1])

    def files(self):
        return self.filter(~Q(revisions__isnull=True))

    def folders(self):
        return self.filter(is_folder=True)

    def with_direct_permision(self, user):
        return self.filter(user_has_node_permission_Q(user))


class Node(models.Model):
    name = models.CharField(max_length=30, db_index=True)
    parent = models.ForeignKey('self', null=True, related_name='kids')
    is_folder = models.BooleanField(default=False)

    editing_groups = models.ManyToManyField(
        Group, related_name='+', blank=True
    )
    editing_users = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name='+', blank=True
    )

    objects = NodeQuerySet.as_manager()

    @property
    def path(self):
        tokens = list(map(lambda x: x.name, self.iterate_predecessors()))
        tokens[-1] = ''
        return '/'.join(reversed(tokens))

    def iterate_predecessors(self):
        obj = self
        while obj is not None:
            yield obj
            obj = obj.parent

    def __str__(self):
        return 'Node:%s/' % self.path

    class Meta:
        unique_together = (("name", "parent"),)


class Resource(models.Model):
    type = models.IntegerField(choices=RESOURCE_TYPES)
    path = models.CharField(max_length=256)
    name = models.CharField(max_length=256, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, related_name='+'
    )

    def __str__(self):
        return 'Resource(%d):%s' % (self.pk, self.name)


class Revision(models.Model):

    node = models.ForeignKey(Node, related_name='revisions')
    created = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, related_name='+'
    )
    resource = models.ForeignKey(Resource, null=True)
    comment = models.TextField(blank=True)

    def __str__(self):
        return '%s@%s' % (self.node, self.created)
