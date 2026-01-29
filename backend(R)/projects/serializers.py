from rest_framework import serializers
from .models import Project
from tasks.models import Task

# 1. Define a mini-serializer for Tasks so we can see them inside the Project
class ProjectTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status']

class ProjectSerializer(serializers.ModelSerializer):
    task_count = serializers.SerializerMethodField()
    # 2. This line fetches the actual list of tasks
    tasks = ProjectTaskSerializer(many=True, read_only=True)
    
    # 3. Add owner_name to make it look professional (optional but good)
    owner_name = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('owner', 'created_at')

    def get_task_count(self, obj):
        return obj.tasks.count()