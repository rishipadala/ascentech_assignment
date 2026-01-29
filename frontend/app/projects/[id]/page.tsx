"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProjectById } from '../../../services/projects';
import { createTask, updateTaskStatus, deleteTask } from '../../../services/tasks';
import Navbar from '@/components/Navbar';

export default function ProjectDetails() {
    const { id } = useParams(); // Get the ID from the URL (e.g., "1")
    const router = useRouter();

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Task Form State
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'TODO' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (id) fetchProjectData();
    }, [id]);

    const fetchProjectData = async () => {
        try {
            const data = await getProjectById(id as string);
            setProject(data);
        } catch (error) {
            console.error("Failed to fetch project", error);
            // router.push('/dashboard'); // Uncomment if you want strict redirects
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // API call to create task linked to this project
            await createTask({ ...newTask, project: Number(id) });
            setNewTask({ title: '', description: '', status: 'TODO' }); // Reset form
            fetchProjectData(); // Refresh data to see new task
        } catch (error) {
            alert("Failed to add task");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusChange = async (taskId: number, newStatus: string) => {
        try {
            await updateTaskStatus(taskId, newStatus);
            fetchProjectData(); // Refresh UI
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        if (confirm("Delete this task?")) {
            await deleteTask(taskId);
            fetchProjectData();
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Project...</div>;
    if (!project) return <div className="p-10 text-center">Project not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <Navbar />
            <div className="max-w-4xl mx-auto">
                {/* Header / Back Button */}
                <Link href="/dashboard" className="text-sm text-gray-500 hover:text-black mb-6 inline-block">
                    ← Back to Dashboard
                </Link>

                {/* Project Info */}
                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm mb-8">
                    <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                    <p className="text-gray-500">{project.description}</p>
                </div>

                {/* Task Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Column: Task List */}
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold mb-4">Tasks ({project.tasks?.length || 0})</h2>

                        {project.tasks?.length === 0 ? (
                            <p className="text-gray-400 italic">No tasks yet. Add one!</p>
                        ) : (
                            project.tasks?.map((task: any) => (
                                <div key={task.id} className="bg-white p-5 rounded-lg border border-gray-200 flex justify-between items-start group">
                                    <div>
                                        <h3 className={`font-medium ${task.status === 'DONE' ? 'line-through text-gray-400' : ''}`}>
                                            {task.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                                        <span className={`text-xs px-2 py-1 rounded mt-2 inline-block font-medium 
                      ${task.status === 'TODO' ? 'bg-yellow-100 text-yellow-800' :
                                                task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'}`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2 items-end">
                                        {/* Status Dropdown */}
                                        <select
                                            className="text-xs border rounded p-1 bg-gray-50 cursor-pointer"
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                        >
                                            <option value="TODO">To Do</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="DONE">Done</option>
                                        </select>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Right Column: Add Task Form (Improved UI) */}
                    <div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg sticky top-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg">Add New Task</h3>
                            </div>

                            <form onSubmit={handleAddTask} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Title</label>
                                    <input
                                        className="input-field text-sm font-medium"
                                        placeholder="e.g. Fix Database Bug"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Description</label>
                                    <textarea
                                        className="input-field text-sm min-h-[80px]"
                                        placeholder="What needs to be done?"
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Initial Status</label>
                                    <div className="relative">
                                        <select
                                            className="input-field text-sm appearance-none bg-gray-50"
                                            value={newTask.status}
                                            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                                        >
                                            <option value="TODO">📌 To Do</option>
                                            <option value="IN_PROGRESS">🚧 In Progress</option>
                                            <option value="DONE">✅ Done</option>
                                        </select>
                                        <div className="absolute right-3 top-3 pointer-events-none text-gray-400">▼</div>
                                    </div>
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-black text-white py-3 rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                                >
                                    {isSubmitting ? 'Adding...' : '+ Create Task'}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}