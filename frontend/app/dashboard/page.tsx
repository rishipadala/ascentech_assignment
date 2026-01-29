"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProjects, createProject, deleteProject } from '../../services/projects';
import { getTasks } from '../../services/tasks';
import { logoutUser } from '../../services/auth';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';

export default function Dashboard() {
    const router = useRouter();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalProjects: 0, totalTasks: 0, completedTasks: 0 });

    // Modal State for "New Project"
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // 1. Fetch Projects and Tasks in parallel
            const [projectsData, tasksData] = await Promise.all([
                getProjects(),
                getTasks()
            ]);

            // 2. Set Projects
            setProjects(projectsData);

            // 3. Calculate Stats for PDF Requirement 3.4
            const completed = tasksData.filter((t: any) => t.status === 'DONE').length;
            setStats({
                totalProjects: projectsData.length,
                totalTasks: tasksData.length,
                completedTasks: completed
            });

        } catch (error) {
            console.error("Failed to load data", error);
            // If error (token invalid), send back to login
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProject(newProject);
            setShowModal(false);
            setNewProject({ name: '', description: '' });
            fetchData(); // Refresh list to show the new project
        } catch (error) {
            alert("Failed to create project");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure? This will delete all tasks in this project.")) {
            await deleteProject(id);
            fetchData(); // Refresh list
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            <main className="max-w-6xl mx-auto p-8">

                {/* PDF 3.4: Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard label="Total Projects" value={stats.totalProjects} />
                    <StatCard label="Total Tasks" value={stats.totalTasks} />
                    <StatCard label="Completed Tasks" value={stats.completedTasks} />
                </div>

                {/* Projects Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Your Projects</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                    >
                        + New Project
                    </button>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.length === 0 ? (
                        <div className="col-span-3 text-center py-10 text-gray-400">
                            No projects yet. Create one to get started!
                        </div>
                    ) : (
                        projects.map((project) => (
                            <div key={project.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                {/* NEW CODE: Wrap it in a Link */}
                                <Link href={`/projects/${project.id}`} className="hover:underline decoration-2 underline-offset-4">
                                    <h3 className="text-lg font-bold mb-2 cursor-pointer">{project.name}</h3>
                                </Link>
                                <p className="text-gray-500 text-sm mb-4 h-10 line-clamp-2">{project.description}</p>
                                <div className="flex justify-between items-center mt-4 border-t pt-4">
                                    <span className="text-xs text-gray-400">
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </span>
                                    <div className="space-x-3">
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="text-red-500 text-xs hover:text-red-700 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Simple Modal for Creating Project */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                className="input-field"
                                placeholder="Project Name"
                                value={newProject.name}
                                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                required
                            />
                            <textarea
                                className="input-field"
                                placeholder="Description"
                                rows={3}
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                required
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="w-full py-3 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

