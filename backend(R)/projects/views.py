from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from .models import Project
from .serializers import ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated] # PDF 3.1: Protected endpoints

    def get_queryset(self):
        # PDF 3.2: View list of THEIR projects (Filter by owner)
        return Project.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # PDF 3.2: Auto-assign owner
        serializer.save(owner=self.request.user)