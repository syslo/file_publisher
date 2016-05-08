from django.contrib import admin

from .models import Node, Revision


class NodeAdmin(admin.ModelAdmin):
    fieldsets = (
        None, {'fields': (
            'parent', 'name', 'is_folder', 'editing_users', 'editing_groups',
        )}
    ),

    def get_readonly_fields(self, request, obj=None):
        if not obj:
            return self.readonly_fields
        return self.readonly_fields + ('name', 'parent')

    def has_delete_perm(self, request, obj=None):
        return False


class RevisionAdmin(admin.ModelAdmin):

    fieldsets = (
        None, {'fields': (
            'node', 'resource', 'author', 'comment',
        )}
    ),

    def get_readonly_fields(self, request, obj=None):
        if not obj:
            return self.readonly_fields
        return self.readonly_fields + ('node', 'resource', 'author', 'comment')

    def has_delete_perm(self, request, obj=None):
        return False


admin.site.register(Node, NodeAdmin)
admin.site.register(Revision, RevisionAdmin)
