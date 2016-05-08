import posixpath as path
import uuid

from django.core.files.storage import default_storage
from rest_framework import mixins, status, views, viewsets
from rest_framework.response import Response

from ..constants import FILE_TYPE, REDIRECT_TYPE
from ..helpers import download_resource_view
from ..models import Resource
from ..serializers import (InputFileSerializer, InputRedirectSerializer,
                           ResourceSerializer)
from ..settings import BASE_FOLDER


class ResourceView(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):

    serializer_class = ResourceSerializer

    def get_queryset(self):
        qs = Resource.objects.all().order_by('-created')

        if 'file' in self.request.query_params:
            qs = qs.filter(type=FILE_TYPE)

        if 'redirect' in self.request.query_params:
            qs = qs.filter(type=REDIRECT_TYPE)

        return qs

    def download(self, request, pk):
        return download_resource_view(self.get_object())


class FileResourceView(views.APIView):

    serializer_class = InputFileSerializer

    def put(self, request):

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        file = serializer.validated_data['file']

        filepath = path.join(
            BASE_FOLDER, 'files',
            str(uuid.uuid4())+path.splitext(file.name)[1]
        )

        filepath = default_storage.save(filepath, file)

        resource = Resource(
            type=FILE_TYPE,
            path=filepath,
            name=file.name,
            author=request.user if request.user.is_active else None,
        )
        resource.save()

        data = ResourceSerializer(resource, context={'request': request}).data
        del data.serializer
        return Response(data, status=status.HTTP_201_CREATED)


class RedirectResourceView(views.APIView):

    serializer_class = InputRedirectSerializer

    def put(self, request):

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        resource = Resource(
            type=REDIRECT_TYPE,
            path=serializer.validated_data['destination'],
            name=serializer.validated_data['name'],
            author=request.user if request.user.is_active else None,
        )
        resource.save()

        data = ResourceSerializer(resource, context={'request': request}).data
        del data.serializer
        return Response(data, status=status.HTTP_201_CREATED)
