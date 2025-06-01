import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlayIcon, 
  DocumentIcon, 
  RobotIcon, 
  TargetIcon, 
  RocketIcon,
  ArrowRightIcon 
} from '../components/Icons';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25 animate-pulse">
          <PlayIcon className="text-white" size={32} />
        </div>
        
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
          Welcome to AI Video Script Generator
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Create professional video scripts in minutes with our advanced AI system. 
          Perfect for content creators, marketers, and video producers.
        </p>
        
        <Link
          to="/generator"
          className="relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse hover:animate-none group overflow-hidden"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <RobotIcon size={24} className="relative z-10 group-hover:animate-bounce" />
          <span className="relative z-10">Start Creating Scripts</span>
          <ArrowRightIcon size={20} className="relative z-10 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/generator"
          className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/10 relative overflow-hidden"
        >
          {/* Subtle glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:from-blue-600 group-hover:to-purple-700 transition-all group-hover:animate-pulse">
              <DocumentIcon className="text-white" size={24} />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Script Generator</h3>
            <p className="text-gray-600 mb-4">
              Create professional video scripts with our 4-step AI process. 
              From content planning to final script generation.
            </p>
            
            <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
              Start Creating
              <ArrowRightIcon size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <div className="group bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:animate-pulse">
            <TargetIcon className="text-white" size={24} />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Video Ready</h3>
          <p className="text-gray-600 mb-4">
            Scripts are optimized for AI video generation platforms 
            like Runway, Pika Labs, and OpenAI Sora.
          </p>
          
          <div className="flex items-center text-orange-600 font-semibold group-hover:text-orange-700 transition-colors">
            Learn More
            <ArrowRightIcon size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Why Choose Our AI Script Generator?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 group-hover:animate-bounce transition-colors">
              <RobotIcon className="text-blue-600" size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">AI Powered</h4>
            <p className="text-sm text-gray-600">Advanced AI understands your content needs</p>
          </div>
          
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 group-hover:animate-bounce transition-colors">
              <DocumentIcon className="text-green-600" size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Professional Quality</h4>
            <p className="text-sm text-gray-600">Industry-standard script formatting</p>
          </div>
          
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 group-hover:animate-bounce transition-colors">
              <TargetIcon className="text-purple-600" size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Video Optimized</h4>
            <p className="text-sm text-gray-600">Ready for AI video generation</p>
          </div>
          
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 group-hover:animate-bounce transition-colors">
              <RocketIcon className="text-orange-600" size={24} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Fast & Reliable</h4>
            <p className="text-sm text-gray-600">Generate scripts in minutes</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-center text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Creating?</h2>
          <p className="text-blue-100 mb-6 text-lg">
            Join thousands of creators using our AI to generate professional video scripts
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/generator"
              className="relative bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 group overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10">Create Your First Script</span>
            </Link>
            
            <a
              href="https://zalo.me/g/okuuzs756"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 border border-blue-400 transform hover:scale-105 hover:shadow-lg"
            >
              Join Community
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}; 