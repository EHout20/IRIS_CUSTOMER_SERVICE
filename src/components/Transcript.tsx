'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: Date;
  type: 'ai' | 'system';
}

interface TranscriptProps {
  className?: string;
  isVisible?: boolean;
  onToggleVisible?: (visible: boolean) => void;
}

export default function Transcript({ className = '', isVisible = true, onToggleVisible }: TranscriptProps) {
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  // Function to add new transcript entry
  const addEntry = (text: string, type: 'ai' | 'system' = 'ai') => {
    const newEntry: TranscriptEntry = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      type
    };
    setEntries(prev => [...prev, newEntry]);
  };

  // Clear all entries
  const clearTranscript = () => {
    setEntries([]);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  // Expose methods globally for AI to use
  useEffect(() => {
    // @ts-ignore - Adding global methods for AI integration
    window.addTranscriptEntry = addEntry;
    // @ts-ignore
    window.clearTranscript = clearTranscript;

    // Add initial welcome message
    addEntry("Transcript started - AI responses will appear here", "system");

    return () => {
      // @ts-ignore
      delete window.addTranscriptEntry;
      // @ts-ignore
      delete window.clearTranscript;
    };
  }, []);

  if (!isVisible) {
    return (
      <motion.button
        onClick={() => onToggleVisible?.(true)}
        className="fixed right-4 top-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        📝 Show Transcript
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`bg-white border-l-4 border-blue-500 shadow-lg flex flex-col ${className}`}
      style={{ height: '500px' }}
    >
      {/* Header */}
      <div className="bg-blue-50 px-4 py-3 border-b border-blue-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold text-gray-800">AI Transcript</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearTranscript}
            className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1 rounded"
            title="Clear transcript"
          >
            🗑️
          </button>
          <button
            onClick={() => onToggleVisible?.(false)}
            className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1 rounded"
            title="Hide transcript"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Transcript Content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
      >
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-3 rounded-lg shadow-sm ${
                entry.type === 'ai' 
                  ? 'bg-blue-100 border-l-4 border-blue-500' 
                  : 'bg-gray-100 border-l-4 border-gray-400'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`text-xs font-medium ${
                  entry.type === 'ai' ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {entry.type === 'ai' ? '🤖 AI Assistant' : '⚙️ System'}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(entry.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">
                {entry.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {entries.length === 1 && entries[0].type === 'system' && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">👂</div>
            <p className="text-sm">Waiting for AI responses...</p>
            <p className="text-xs mt-2 text-gray-400">
              All AI messages will appear here for accessibility
            </p>
          </div>
        )}
      </div>

      {/* Footer with accessibility info */}
      <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
        <p className="text-xs text-gray-600 text-center">
          🔊 Real-time AI transcript for accessibility
        </p>
      </div>
    </motion.div>
  );
}