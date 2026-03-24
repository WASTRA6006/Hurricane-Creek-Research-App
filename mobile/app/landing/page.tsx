'use client';

import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-primary-light/20 to-secondary-light/20 p-8">
            <div className="max-w-md w-full text-center space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
                    <p className="text-gray-600">Upload photos for ELC with ease!</p>
                </div>
            
                <div className="space-y-3">
                    <button className="w-full bg-blue-600 text-white px-4 py-3 rounded font-medium hover:bg-blue-700" onClick={() => router.push("/login")}>
                        Student Login
                    </button>
                    
                    <button className="w-full bg-green-600 text-white px-4 py-3 rounded font-medium hover:bg-green-700" onClick={() => router.push("/admin/login")}>
                        Faculty/Admin Login
                    </button>
                    
                    <button className="w-full bg-gray-600 text-white px-4 py-3 rounded font-medium hover:bg-gray-700" onClick={() => router.push("/register")}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}

