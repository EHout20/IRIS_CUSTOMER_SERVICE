'use client';

import React from 'react';
import { z } from 'zod';
import {
  useRegisterState,
  useRegisterFrontendTool,
  useSubscribeStateToAgentContext,
} from 'cedar-os';

import { VideoCallInterface } from '@/components/VideoCallInterface';

export default function VideoCallPage() {
  // Cedar state for avatar interaction
  const [conversationHistory, setConversationHistory] = React.useState<string[]>([]);
  const [currentMood, setCurrentMood] = React.useState<'calm' | 'excited' | 'focused' | 'sleepy'>('calm');

  // Register conversation history state
  useRegisterState({
    key: 'conversationHistory',
    description: 'History of the conversation with the AI avatar',
    value: conversationHistory,
    setValue: setConversationHistory,
    stateSetters: {
      addToConversation: {
        name: 'addToConversation',
        description: 'Add a new message to the conversation history',
        argsSchema: z.object({
          message: z.string().min(1, 'Message cannot be empty').describe('The message to add'),
          speaker: z.enum(['user', 'assistant']).describe('Who said the message'),
        }),
        execute: (
          currentHistory: string[],
          setValue: (newValue: string[]) => void,
          args: { message: string; speaker: 'user' | 'assistant' },
        ) => {
          const newEntry = `${args.speaker === 'user' ? '👤' : '🤖'} ${args.message}`;
          setValue([...currentHistory, newEntry]);
        },
      },
    },
  });

  // Register avatar mood state
  useRegisterState({
    key: 'avatarMood',
    description: 'Current mood state of the AI avatar',
    value: currentMood,
    setValue: setCurrentMood,
    stateSetters: {
      setAvatarMood: {
        name: 'setAvatarMood',
        description: 'Change the avatar\'s mood which affects its behavior',
        argsSchema: z.object({
          mood: z.enum(['calm', 'excited', 'focused', 'sleepy']).describe('The new mood for the avatar'),
          reason: z.string().optional().describe('Optional reason for the mood change'),
        }),
        execute: (
          currentMood: string,
          setValue: (newMood: 'calm' | 'excited' | 'focused' | 'sleepy') => void,
          args: { mood: 'calm' | 'excited' | 'focused' | 'sleepy'; reason?: string },
        ) => {
          setValue(args.mood);
          if (args.reason) {
            setConversationHistory(prev => [...prev, `🎭 Mood changed to ${args.mood}: ${args.reason}`]);
          }
        },
      },
    },
  });

  // Subscribe states to agent context
  useSubscribeStateToAgentContext('conversationHistory', (history) => ({ conversationHistory: history }), {
    showInChat: true,
    color: '#8B5CF6',
  });

  useSubscribeStateToAgentContext('avatarMood', (mood) => ({ avatarMood: mood }), {
    showInChat: true,
    color: '#EC4899',
  });

  // Register frontend tools for avatar interactions
  useRegisterFrontendTool({
    name: 'startVideoCall',
    description: 'Initialize or restart the video call session',
    argsSchema: z.object({
      greeting: z.string().optional().describe('Optional greeting message to display'),
    }),
    execute: async (args: { greeting?: string }) => {
      const greeting = args.greeting || 'Hello! I\'m your AI assistant. How can I help you today?';
      setConversationHistory([`🤖 ${greeting}`]);
      setCurrentMood('calm');
    },
  });

  useRegisterFrontendTool({
    name: 'expressEmotion',
    description: 'Make the avatar express a specific emotion or reaction',
    argsSchema: z.object({
      emotion: z.enum(['joy', 'surprise', 'concern', 'thoughtful', 'playful', 'sleepy']).describe('The emotion to express'),
      message: z.string().optional().describe('Optional message to accompany the emotion'),
      duration: z.number().optional().describe('How long to hold the expression (in seconds)'),
    }),
    execute: async (args: { emotion: string; message?: string; duration?: number }) => {
      // Map emotions to avatar expressions and moods
      const emotionMap = {
        joy: { expression: 'happy', mood: 'excited' },
        surprise: { expression: 'surprised', mood: 'excited' },
        concern: { expression: 'sad', mood: 'focused' },
        thoughtful: { expression: 'thinking', mood: 'focused' },
        playful: { expression: 'winking', mood: 'excited' },
        sleepy: { expression: 'neutral', mood: 'sleepy' },
      };

      const mapping = emotionMap[args.emotion as keyof typeof emotionMap] || { expression: 'neutral', mood: 'calm' };
      
      if (args.message) {
        setConversationHistory(prev => [...prev, `🤖 ${args.message}`]);
      }

      // Temporarily change mood for the emotion
      setCurrentMood(mapping.mood as 'calm' | 'excited' | 'focused' | 'sleepy');
      
      // Reset to calm after duration
      setTimeout(() => {
        setCurrentMood('calm');
      }, (args.duration || 3) * 1000);
    },
  });

  useRegisterFrontendTool({
    name: 'analyzeUserBehavior',
    description: 'Analyze and respond to user behavior or conversation patterns',
    argsSchema: z.object({
      observation: z.string().describe('What the avatar observed about the user'),
      response: z.string().describe('How the avatar should respond'),
      adjustMood: z.boolean().optional().describe('Whether to adjust mood based on observation'),
    }),
    execute: async (args: { observation: string; response: string; adjustMood?: boolean }) => {
      // Add the observation to conversation history
      setConversationHistory(prev => [
        ...prev,
        `👁️ Observed: ${args.observation}`,
        `🤖 ${args.response}`
      ]);

      // Optionally adjust mood based on context
      if (args.adjustMood) {
        if (args.observation.toLowerCase().includes('tired') || args.observation.toLowerCase().includes('sleepy')) {
          setCurrentMood('sleepy');
        } else if (args.observation.toLowerCase().includes('excited') || args.observation.toLowerCase().includes('happy')) {
          setCurrentMood('excited');
        } else if (args.observation.toLowerCase().includes('focused') || args.observation.toLowerCase().includes('working')) {
          setCurrentMood('focused');
        }
      }
    },
  });

  return (
    <div className="w-full h-screen bg-black">
      <VideoCallInterface showControls={true} />
      
      {/* Debug panel for development - can be removed in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 bg-black/80 text-white p-4 rounded-lg max-w-sm z-50">
          <h4 className="font-bold mb-2">Debug Info</h4>
          <div className="text-xs space-y-1">
            <div>Mood: {currentMood}</div>
            <div>Messages: {conversationHistory.length}</div>
            <div className="max-h-20 overflow-y-auto">
              {conversationHistory.slice(-3).map((msg, i) => (
                <div key={i} className="truncate">{msg}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}