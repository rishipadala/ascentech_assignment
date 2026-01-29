"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === '/login';

    const handleNavigate = () => {
        if (isLoginPage) {
            router.push('/register');
        } else {
            router.push('/login');
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
            <Link href="/">
                <h1 className="text-xl font-bold cursor-pointer">ASCENTech Workspace</h1>
            </Link>
            <div className="flex gap-4 items-center">
                <button
                    onClick={handleNavigate}
                    className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
                >
                    {isLoginPage ? 'Sign up' : 'Sign in'}
                </button>
            </div>
        </nav>
    );
}
