import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  PlayIcon, 
  RobotIcon, 
  DocumentIcon, 
  TargetIcon, 
  RocketIcon,
  HomeIcon
} from './Icons';

export const Layout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: HomeIcon },
    { path: '/generator', label: 'Script Generator', icon: DocumentIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                  <PlayIcon className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    AI Video Script Generator
                  </h1>
                  <p className="text-gray-600 text-sm font-medium">
                    Create professional video scripts with AI
                  </p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        isActive(item.path)
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* External Links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://zalo.me/g/okuuzs756"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg border border-blue-400 hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 font-medium"
                >
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">Z</span>
                  </div>
                  <span className="hidden sm:inline">Zalo Community</span>
                  <span className="sm:hidden">Zalo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-t border-gray-200/60 shadow-lg">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-blue-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 pb-20 md:pb-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200/60 mt-16 pb-20 md:pb-8 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <RobotIcon className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Powered</h3>
                <p className="text-sm text-gray-600">Advanced AI content generation</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <DocumentIcon className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Professional Scripts</h3>
                <p className="text-sm text-gray-600">Industry-standard formatting</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <TargetIcon className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Video Ready</h3>
                <p className="text-sm text-gray-600">Optimized for Runway, Pika, Sora</p>
              </div>
            </div>
          </div>
          
          {/* Footer Text */}
          <div className="text-center">
            <div className="inline-flex items-center gap-6 bg-gray-50 rounded-2xl px-8 py-4 border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  Ready to create amazing videos
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <p className="text-sm text-gray-500">
                Each step includes detailed instructions and examples
              </p>
            </div>
            
            {/* AI ToolCheap & Developer Info */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-center gap-4 text-sm">
                <a 
                  href="https://aitoolcheap.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  <RocketIcon size={18} className="text-blue-500" />
                  AI ToolCheap
                </a>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">Powered by Advanced AI</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <span>Developed by</span>
                <a 
                  href="https://fb.com/nam077.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  nam077
                </a>
                <span>© 2025</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button - Zalo Group */}
      <div className="fixed bottom-6 right-6 animate-slide-in-up" style={{ zIndex: 50 }}>
        <div className="relative animate-float">
          {/* Background glow effect - behind button */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse blur-sm" style={{ zIndex: -1 }}></div>
          
          {/* Subtle Ripple Effects */}
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-10" style={{ zIndex: 0 }}></div>
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse opacity-15 animation-delay-500" style={{ zIndex: 0 }}></div>
          
          {/* Main Button */}
          <a
            href="https://zalo.me/g/okuuzs756"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-3 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group animate-breathe"
            style={{ zIndex: 2 }}
          >
            {/* Zalo Icon */}
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <span className="text-base font-bold">Z</span>
            </div>
            
            {/* Text */}
            <div className="hidden sm:block">
              <div className="text-sm font-semibold">Masters VEO 3</div>
              <div className="text-xs opacity-90">Tổ Đội Prompt Thần Sầu</div>
            </div>
            
            {/* Arrow with bounce */}
            <div className="transform group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}; 