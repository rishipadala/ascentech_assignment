"use client";

import { useEffect, useState } from 'react';
import { logoutUser, getUsername } from '../services/auth';
import Link from 'next/link';

export default function Navbar() {
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        const name = getUsername();
        if (name) setUsername(name);
    }, []);

    return (
        <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link href="/dashboard">
                <h1 className="text-xl font-bold cursor-pointer">ASCENTech Workspace</h1>
            </Link>
            <div className="flex gap-6 items-center">
                <span className="text-sm text-gray-500">
                    Welcome back{username ? `, ${username}!` : '!'}
                </span>
                <button
                    onClick={logoutUser}
                    className="text-sm text-red-500 font-medium hover:underline"
                >
                    Sign Out
                </button>
            </div>
        </nav>
    );
}