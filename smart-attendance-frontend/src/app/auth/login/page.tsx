"use client";
import { useState, useEffect } from "react";
import { BookOpen, Eye, EyeOff, Loader2, ArrowRight, Shield, Users, BarChart3 } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
export default function EnhancedLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { login } = useAuth();
  const router = useRouter();

  // Mouse tracking for gradient effects
  useEffect(() => {
    const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    if (success) {
      router.push('/teacher/dashboard'); // Will redirect based on role
    }
    
    setIsLoading(false);
  };

  const features = [
    { icon: Shield, title: "Secure Access", desc: "Advanced security protocols" },
    { icon: Users, title: "Role Management", desc: "Teacher & student portals" },
    { icon: BarChart3, title: "Analytics", desc: "Real-time insights & reports" }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(79, 70, 229, 0.15), transparent 40%)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-indigo-900/20" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Branding Panel */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-lg space-y-8 animate-fade-in">
            {/* Logo and Title */}
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-4 group">
                <div className="relative">
                  <BookOpen size={56} className="text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute -inset-2 bg-indigo-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  EduERP Portal
                </h1>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-200">
                  Smart Educational Management
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Transform your institution with our comprehensive ERP solution. 
                  Manage attendance, academics, and administration seamlessly.
                </p>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
                      <feature.icon size={20} className="text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                      <p className="text-sm text-gray-400">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6">
          <div className="w-full max-w-md animate-slide-up">
            {/* Login Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse" />
              
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
                {/* Header */}
                <div className="text-center space-y-2 mb-8">
                <div className="text-2xl">👋</div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Welcome back! Professor </h2>
                  
                  <p className="text-gray-400">
                    Sign in to access your dashboard
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Email Address
                    </label>
                    <div className="relative group">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        placeholder="Enter your email"
                      />
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-100' : ''} -z-10 blur-xl`} />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm pr-12"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-100' : ''} -z-10 blur-xl`} />
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-600 bg-white/5 text-indigo-500 focus:ring-indigo-500" />
                      <span>Remember me</span>
                    </label>
                    <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!email || !password || isLoading}
                    className="group relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </div>

            
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}