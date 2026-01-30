from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from .models import Project
from .serializers import ProjectSerializer
from drf_spectacular.utils import extend_schema, extend_schema_view

@extend_schema_view(
    list=extend_schema(
        tags=['Projects'],
        summary='List all projects',
        description='Get a list of all projects owned by the authenticated user'
    ),
    create=extend_schema(
        tags=['Projects'],
        summary='Create a new project',
        description='Create a new project. The authenticated user will be set as the owner'
    ),
    retrieve=extend_schema(
        tags=['Projects'],
        summary='Get project details',
        description='Retrieve details of a specific project by ID'
    ),
    update=extend_schema(
        tags=['Projects'],
        summary='Update a project',
        description='Update all fields of an existing project'
    ),
    partial_update=extend_schema(
        tags=['Projects'],
        summary='Partially update a project',
        description='Update specific fields of an existing project'
    ),
    destroy=extend_schema(
        tags=['Projects'],
        summary='Delete a project',
        description='Delete a project and all its associated tasks'
    ),
)
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # PDF 3.2: View list of THEIR projects (Filter by owner)
        return Project.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # PDF 3.2: Auto-assign owner
        serializer.save(owner=self.request.user)