"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '../../services/auth';
import AuthNavbar from '../../components/AuthNavbar';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await registerUser(formData);
            alert("Account created! Please log in.");
            router.push('/login');
        } catch (err: any) {
            // Handle Django error format safely
            let errorMessage = "Registration failed";
            if (typeof err === 'object') {
                // Try to grab the first error message from the object
                const firstKey = Object.keys(err)[0];
                if (firstKey) errorMessage = `${firstKey}: ${err[firstKey]}`;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AuthNavbar />
            <div className="min-h-screen flex items-center justify-center bg-white p-4 pt-20">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-black">
                            Create an account
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Start managing your projects today
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md text-center wrap-break-word">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                            <input
                                type="email"
                                required
                                className="input-field"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <input
                                type="password"
                                required
                                className="input-field"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? 'Creating account...' : 'Sign up'}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-black hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}