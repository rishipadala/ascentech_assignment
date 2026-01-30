from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer
from drf_spectacular.utils import extend_schema, extend_schema_view

@extend_schema_view(
    list=extend_schema(
        tags=['Tasks'],
        summary='List all tasks',
        description='Get a list of all tasks belonging to projects owned by the authenticated user'
    ),
    create=extend_schema(
        tags=['Tasks'],
        summary='Create a new task',
        description='Create a new task within a project'
    ),
    retrieve=extend_schema(
        tags=['Tasks'],
        summary='Get task details',
        description='Retrieve details of a specific task by ID'
    ),
    update=extend_schema(
        tags=['Tasks'],
        summary='Update a task',
        description='Update all fields of an existing task'
    ),
    partial_update=extend_schema(
        tags=['Tasks'],
        summary='Partially update a task',
        description='Update specific fields (e.g., status) of an existing task'
    ),
    destroy=extend_schema(
        tags=['Tasks'],
        summary='Delete a task',
        description='Delete a task from a project'
    ),
)
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show tasks belonging to projects owned by the user
        return Task.objects.filter(project__owner=self.request.user)