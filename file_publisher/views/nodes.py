from django.core.exceptions import ObjectDoesNotExist
from rest_framework import exceptions, permissions, status, views, viewsets
from rest_framework.response import Response

from ..helpers import root_Q, tokenize_path
from ..models import Node, Revision
from ..serializers import (InputFolderSerializer, InputRevisionSerializer,
                           NodeListSerializer, NodeSerializer,
                           RevisionSerializer)


class NodeViewSet(
    viewsets.GenericViewSet
):
    serializer_class = NodeSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        qs = Node.objects.all()

        if 'folder' in self.request.query_params:
            qs = qs.folders()

        if 'file' in self.request.query_params:
            qs = qs.files()

        return qs

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        if 'many' in kwargs and kwargs['many']:
            return NodeListSerializer(*args, **kwargs)
        else:
            return NodeSerializer(*args, **kwargs)

    def by_path(self, request, path):
        tokens = tokenize_path(path)
        try:
            instance = self.get_queryset().get_path(tokens, request.user)
        except ObjectDoesNotExist:
            raise exceptions.NotFound()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def roots(self, request):
        if request.user.is_superuser:
            instances = self.get_queryset().filter(root_Q())
        else:
            instances = self.get_queryset().with_direct_permision(request.user)
        serializer = self.get_serializer(instances, many=True)
        return Response(serializer.data)


class FolderView(views.APIView):

    serializer_class = InputFolderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            tokens = tokenize_path(serializer.validated_data['path'])
            node, _ = Node.objects.get_or_create_by_path(tokens, request.user)
        except ObjectDoesNotExist:
            raise exceptions.NotFound(detail='Base folder does not exist.')

        if not node.is_folder:
            st = status.HTTP_201_CREATED
            node.is_folder = True
            node.save()
        else:
            st = status.HTTP_200_OK

        data = NodeSerializer(node, context={'request': request}).data
        del data.serializer
        return Response(data, status=st)


class RevisionView(views.APIView):

    serializer_class = InputRevisionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            tokens = tokenize_path(serializer.validated_data['path'])
            node, _ = Node.objects.get_or_create_by_path(tokens, request.user)
        except ObjectDoesNotExist:
            raise exceptions.NotFound(detail='Base folder does not exist.')

        revision = Revision(
            node=node,
            author=request.user if request.user.is_active else None,
            resource=serializer.validated_data.get('resource', None),
            comment=serializer.validated_data.get('comment', '')
        )
        revision.save()

        data = RevisionSerializer(revision, context={'request': request}).data
        del data.serializer
        return Response(data, status=status.HTTP_201_CREATED)
