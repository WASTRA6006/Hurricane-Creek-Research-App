'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50">
      {/* Header/Hero Section */}
     <div className="pt-8 pb-6 px-8 text-center">
        <div className="mb-6">
            {/* Outer ring - matches background */}
            <div className="w-44 h-44 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                {/* Second ring */}
                <div className="w-40 h-40 bg-blue-100 rounded-full flex items-center justify-center">
                    {/* Third ring */}
                    <div className="w-36 h-36 bg-blue-200 rounded-full flex items-center justify-center">
                        {/* Inner circle - logo blue */}
                        <div className="w-32 h-32 bg-[#092f87] rounded-full flex items-center justify-center p-4">
                            <Image
                            src="/splash_logo.png"
                            alt="ELC Logo"
                            width={100}
                            height={100}
                            className="object-contain rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Hurricane Creek Research Site
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Document your field research with geotagged photos and notes
        </p>
      </div>

      {/* Main Cards Section */}
    <div className="max-w-4xl mx-auto px-6 pb-16 space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
    
    {/* Student Login Card - Compact on mobile */}
    <div 
        onClick={() => router.push("/login")}
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden"
    >
        <div className="flex md:flex-col">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 md:p-6 text-white flex items-center md:block">
            <div className="text-3xl md:text-5xl md:mb-3">🎓</div>
            <h2 className="text-xl md:text-2xl font-bold ml-3 md:ml-0">User Login</h2>
        </div>
        <div className="p-4 md:p-6 flex-1">
            <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-4">
            Upload photos from the field
            </p>
            <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
            <span>Sign in</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
        </div>
        </div>
    </div>

    {/* Faculty/Admin Login Card - Compact on mobile */}
    <div 
        onClick={() => router.push("/admin/login")}
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden"
    >
        <div className="flex md:flex-col">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 md:p-6 text-white flex items-center md:block">
            <div className="text-3xl md:text-5xl md:mb-3">👨‍🏫</div>
            <h2 className="text-xl md:text-2xl font-bold ml-3 md:ml-0">Admin Login</h2>
        </div>
        <div className="p-4 md:p-6 flex-1">
            <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-4">
            Manage and review submissions
            </p>
            <div className="flex items-center text-emerald-600 font-medium text-sm group-hover:gap-2 transition-all">
            <span>Admin access</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
        </div>
        </div>
    </div>

    {/* Register Card - Horizontal on both mobile and desktop */}
    <div 
        onClick={() => router.push("/register")}
        className="md:col-span-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden"
    >
        <div className="flex">
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-4 md:p-8 text-white w-1/3 flex flex-col justify-center">
            <div className="text-3xl md:text-5xl mb-2 md:mb-3">✨</div>
            <h2 className="text-lg md:text-2xl font-bold">New Here?</h2>
        </div>
        <div className="p-4 md:p-8 w-2/3 flex flex-col justify-center">
            <p className="text-sm md:text-lg text-gray-600 mb-2 md:mb-4">
            Create your account to start contributing
            </p>
            <div className="flex items-center text-cyan-600 font-medium text-sm group-hover:gap-2 transition-all">
            <span>Get started</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
        </div>
        </div>
    </div>

    </div>

      {/* Footer */}
      <div className="text-center pb-8 px-8">
        <p className="text-sm text-gray-500">
          University of North Georgia Environmental Leadership Center
        </p>
      </div>
    </div>
  );
}