'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Headshot } from './headshot';
import { FloatingCedarChat } from '@/cedar/components/chatComponents/FloatingCedarChat';

interface VideoCallInterfaceProps {
  className?: string;
  showControls?: boolean;
}

export const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  className = '',
  showControls = true
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  return (
    <div className={`video-call-interface relative w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden ${className}`}>
      
      {/* Main Video Area */}
      <div className="main-video-area relative w-full h-full flex items-center justify-center">
        
        {/* Background with animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white opacity-10 rounded-full"
              animate={{
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>

        {/* Central Avatar Container */}
        <motion.div
          className="avatar-spotlight relative z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Spotlight effect behind avatar */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-400/20 via-pink-400/10 to-transparent rounded-full blur-3xl scale-150" />
          
          {/* Avatar */}
          <div className="relative z-10">
            <Headshot 
              size="large" 
              enableAutoAnimation={isVideoOn}
              className="drop-shadow-2xl"
            />
          </div>

          {/* Avatar name tag */}
          <motion.div
            className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isVideoOn ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>AI Waifu Assistant</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Status indicators */}
        <div className="absolute top-6 left-6 flex flex-col space-y-3">
          <motion.div
            className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            🎥 Video Call Active
          </motion.div>
          
          <motion.div
            className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            🤖 AI Assistant Ready
          </motion.div>
        </div>

        {/* Quality indicator */}
        <div className="absolute top-6 right-6">
          <motion.div
            className="bg-green-500/20 backdrop-blur-sm rounded-lg px-3 py-2 text-green-400 text-sm flex items-center space-x-2"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-green-500 rounded"></div>
              <div className="w-1 h-3 bg-green-500 rounded"></div>
              <div className="w-1 h-5 bg-green-500 rounded"></div>
              <div className="w-1 h-2 bg-green-500 rounded"></div>
            </div>
            <span>HD</span>
          </motion.div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      {showControls && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-lg border-t border-white/10"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between px-6 py-4">
            
            {/* Left controls */}
            <div className="flex items-center space-x-4">
              <motion.button
                className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'}`}
                onClick={() => setIsMuted(!isMuted)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMuted ? '🔇' : '🎤'}
              </motion.button>
              
              <motion.button
                className={`p-3 rounded-full transition-colors ${!isVideoOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'}`}
                onClick={() => setIsVideoOn(!isVideoOn)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isVideoOn ? '📹' : '📷'}
              </motion.button>
            </div>

            {/* Center - Chat toggle */}
            <motion.button
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                isChatOpen 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
              }`}
              onClick={() => setIsChatOpen(!isChatOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isChatOpen ? '💬 Close Chat' : '💬 Open Chat'}
            </motion.button>

            {/* Right controls */}
            <div className="flex items-center space-x-4">
              <motion.button
                className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ⚙️
              </motion.button>
              
              <motion.button
                className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                📞
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cedar Chat Integration */}
      {isChatOpen && (
        <motion.div
          className="absolute bottom-20 right-6 w-96 h-[500px]"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="bg-black/60 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl h-full">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-white font-medium">Chat with AI Assistant</h3>
              <p className="text-gray-400 text-sm">Control the avatar and have a conversation</p>
            </div>
            
            <div className="h-[calc(100%-80px)]">
              <FloatingCedarChat />
            </div>
          </div>
        </motion.div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-6 left-6 text-white/60 text-xs">
        <div>Press Space to toggle chat • M to mute • V for video</div>
      </div>

      <style jsx>{`
        .video-call-interface {
          font-family: 'Inter', sans-serif;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(var(--tw-gradient-stops));
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .avatar-spotlight {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default VideoCallInterface;