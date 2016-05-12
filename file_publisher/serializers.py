from django.core.urlresolvers import reverse
from rest_framework import serializers

from .models import Node, Resource, Revision


class ResourceSerializer(serializers.ModelSerializer):
    download_url = serializers.HyperlinkedIdentityField(
        view_name='file_publisher_api:resource_download',
        read_only=True
    )

    class Meta:
        model = Resource
        fields = (
            'id', 'created', 'author', 'type', 'name', 'path', 'download_url'
        )


class RevisionSerializer(serializers.ModelSerializer):
    resource = ResourceSerializer(required=False)

    class Meta:
        model = Revision
        fields = ('id', 'created', 'author', 'resource', 'comment')


class NodeListSerializer(serializers.ModelSerializer):
    is_file = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = Node
        fields = (
            'path', 'name', 'url', 'download_url', 'is_folder', 'is_file',
        )

    def get_is_file(self, obj):
        return obj.revisions.count() > 0

    def get_url(self, obj):
        return self.context['request'].build_absolute_uri(reverse(
            'file_publisher_api:node_detail',
            kwargs={'path': obj.path[1:]},
        ))

    def get_download_url(self, obj):
        return self.context['request'].build_absolute_uri(reverse(
            'file_publisher_public:download',
            kwargs={'path': obj.path[1:]},
        ))


class NodeSerializer(serializers.ModelSerializer):
    kids = NodeListSerializer(many=True, read_only=True)
    revisions = RevisionSerializer(many=True, read_only=True)

    predecessors = serializers.SerializerMethodField()

    class Meta:
        model = Node
        fields = (
            'path', 'name', 'kids', 'predecessors', 'revisions',
        )

    def get_folders(self, obj):
        return NodeListSerializer(
            obj.kids.folders(),
            many=True, context=self.context,
        ).data

    def get_files(self, obj):
        return NodeListSerializer(
            obj.kids.files(),
            many=True, context=self.context,
        ).data

    def get_predecessors(self, obj):
        return NodeListSerializer(
            obj.iterate_predecessors(),
            many=True, context=self.context,
        ).data


class InputFolderSerializer(serializers.Serializer):
    path = serializers.CharField()


class InputRevisionSerializer(serializers.Serializer):
    path = serializers.CharField()
    resource = serializers.PrimaryKeyRelatedField(
        queryset=Resource.objects.all(), allow_null=True, required=False,
    )


class InputFileSerializer(serializers.Serializer):
    file = serializers.FileField()


class InputRedirectSerializer(serializers.Serializer):
    destination = serializers.CharField()
    name = serializers.CharField()
