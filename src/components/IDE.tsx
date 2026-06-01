'use client';

import { useEffect, useState } from 'react';

export default function IDE() {
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Vertical purple line behind IDE */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 w-1 h-full bg-[#7030E0] shadow-lg shadow-[#7030E0]/50"></div>
      
      {/* IDE Window */}
      <div className="relative bg-gray-900 border border-[#7030E0] rounded-lg shadow-2xl shadow-[#7030E0]/30 overflow-hidden">
        {/* Window Header */}
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-400 text-sm font-mono">index.js</span>
          <div className="w-16"></div>
        </div>
        
        {/* Code Content */}
        <div className="p-4 font-mono text-sm">
          <div className="space-y-1">
            <div className="flex">
              <span className="text-gray-500 mr-4">1</span>
              <span className="text-purple-400">import</span>
              <span className="text-white ml-2">React</span>
              <span className="text-purple-400 ml-2">from</span>
              <span className="text-green-400 ml-2">'react'</span>
              <span className="text-gray-400">;</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 mr-4">2</span>
              <span className="text-purple-400">import</span>
              <span className="text-white ml-2">{`{`}</span>
              <span className="text-[#7030E0] ml-2">useState</span>
              <span className="text-white ml-2">{`}`}</span>
              <span className="text-purple-400 ml-2">from</span>
              <span className="text-green-400 ml-2">'react'</span>
              <span className="text-gray-400">;</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 mr-4">3</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 mr-4">4</span>
              <span className="text-purple-400">const</span>
              <span className="text-yellow-400 ml-2">App</span>
              <span className="text-white ml-2">=</span>
              <span className="text-white ml-2">{`()`}</span>
              <span className="text-white ml-2">{`=>`}</span>
              <span className="text-white ml-2">{`{`}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 mr-4">5</span>
              <span className="text-purple-400 ml-4">const</span>
              <span className="text-white ml-2">[data</span>
              <span className="text-white">,</span>
              <span className="text-white ml-2">setData</span>
              <span className="text-white">]</span>
              <span className="text-white ml-2">=</span>
              <span className="text-[#7030E0] ml-2">useState</span>
              <span className="text-white">{`(`}</span>
              <span className="text-purple-400">null</span>
              <span className="text-white">{`)`}</span>
              <span className="text-gray-400">;</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 mr-4">6</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 mr-4">7</span>
              <span className="text-purple-400 ml-4">const</span>
              <span className="text-yellow-400 ml-2">handleClick</span>
              <span className="text-white ml-2">=</span>
              <span className="text-purple-400 ml-2">async</span>
              <span className="text-white ml-2">{`()`}</span>
              <span className="text-white ml-2">{`=>`}</span>
              <span className="text-white ml-2">{`{`}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 mr-4">8</span>
              <span className="text-purple-400 ml-8">const</span>
              <span className="text-white ml-2">result</span>
              <span className="text-white ml-2">=</span>
              <span className="text-purple-400 ml-2">await</span>
              <span className="text-[#7030E0] ml-2">fetchData</span>
              <span className="text-white">{`(`}</span>
              <span className="text-red-500 border-b border-red-500">;</span>
              <span className="text-white">{`)`}</span>
              <span className="text-gray-400">;</span>
              {cursorVisible && (
                <span className="ml-1 w-0.5 h-4 bg-[#7030E0] animate-pulse"></span>
              )}
            </div>
            <div className="flex">
              <span className="text-gray-500 mr-4">9</span>
              <span className="text-purple-400 ml-8">setData</span>
              <span className="text-white">{`(result)`}</span>
              <span className="text-gray-400">;</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 mr-4">10</span>
              <span className="text-white ml-4">{`}`}</span>
              <span className="text-gray-400">;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
