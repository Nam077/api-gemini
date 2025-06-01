import React from 'react';
import type { ContentData } from '../services/api';

interface ContentDataDisplayProps {
  contentData: ContentData;
}

const ContentDataDisplay: React.FC<ContentDataDisplayProps> = ({ contentData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Topic & Duration</h4>
          <p className="text-blue-800 font-medium">{contentData.topic}</p>
          <p className="text-blue-700 text-sm mt-1">{contentData.duration} seconds</p>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-4">
          <h4 className="font-semibold text-purple-900 mb-2">Target Audience</h4>
          <p className="text-purple-800">{contentData.targetAudience}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-green-50 rounded-xl p-4">
          <h4 className="font-semibold text-green-900 mb-2">Content Tone</h4>
          <p className="text-green-800 capitalize">{contentData.tone}</p>
        </div>
        
        <div className="bg-orange-50 rounded-xl p-4">
          <h4 className="font-semibold text-orange-900 mb-2">Main Message</h4>
          <p className="text-orange-800">{contentData.mainMessage}</p>
        </div>
      </div>
    </div>

    {contentData.tags && contentData.tags.length > 0 && (
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {contentData.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    )}

    {contentData.keyPoints && contentData.keyPoints.length > 0 && (
      <div className="bg-indigo-50 rounded-xl p-6">
        <h4 className="font-semibold text-indigo-900 mb-3">Key Points</h4>
        <ul className="space-y-2">
          {contentData.keyPoints.map((point: string, index: number) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-indigo-800 text-xs font-semibold">{index + 1}</span>
              </div>
              <p className="text-indigo-800">{point}</p>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default ContentDataDisplay; 