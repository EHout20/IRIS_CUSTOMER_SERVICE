'use client';

import React from 'react';
import { z } from 'zod';
import {
  useRegisterState,
  useRegisterFrontendTool,
  useSubscribeStateToAgentContext,
} from 'cedar-os';

import FBXViewer from '@/components/FBXViewer';
import Transcript from '@/components/Transcript';
import { CedarCaptionChat } from '@/cedar/components/chatComponents/CedarCaptionChat';
import CalendarWidget from '@/components/CalendarWidget'; // ✅ Added import

function AvatarWithAgentState() {
  const [isTalking, setIsTalking] = React.useState(false);
  useRegisterState({
    key: 'isTalking',
    description: 'Whether the agent is currently talking (controls avatar animation)',
    value: isTalking,
    setValue: setIsTalking,
  });
  useSubscribeStateToAgentContext('isTalking', (isTalking) => ({ isTalking }), {
    showInChat: true,
    color: '#F59E42',
  });
  return (
    <FBXViewer isTalking={isTalking} className="border-2 border-gray-200 shadow-lg" />
  );
}

export default function HomePage() {
  const [mainText, setMainText] = React.useState('Tell Cedar to change me');
  const [textLines, setTextLines] = React.useState<string[]>([]);
  const [transcriptVisible, setTranscriptVisible] = React.useState(true);
  const [isTalking, setIsTalking] = React.useState(false);

  useRegisterState({
    key: 'isTalking',
    description: 'Whether the agent is currently talking (controls avatar animation)',
    value: isTalking,
    setValue: setIsTalking,
    stateSetters: {
      setTalking: {
        name: 'setTalking',
        description: 'Set the agent to talking mode (shows talking animation)',
        argsSchema: z.object({}),
        execute: (_, setValue) => setValue(true),
      },
      setIdle: {
        name: 'setIdle',
        description: 'Set the agent to idle mode (shows idle animation)',
        argsSchema: z.object({}),
        execute: (_, setValue) => setValue(false),
      },
    },
  });

  useSubscribeStateToAgentContext('isTalking', (isTalking) => ({ isTalking }), {
    showInChat: true,
    color: '#F59E42',
  });

  useRegisterState({
    key: 'mainText',
    description: 'The main text that can be modified by Cedar',
    value: mainText,
    setValue: setMainText,
    stateSetters: {
      changeText: {
        name: 'changeText',
        description: 'Change the main text to a new value',
        argsSchema: z.object({
          newText: z.string().min(1).describe('The new text to display'),
        }),
        execute: (_, setValue, args) => setValue(args.newText),
      },
    },
  });

  useSubscribeStateToAgentContext('mainText', (mainText) => ({ mainText }), {
    showInChat: true,
    color: '#4F46E5',
  });

  useRegisterState({
    key: 'transcriptVisible',
    description: 'Controls whether the accessibility transcript is visible or hidden',
    value: transcriptVisible,
    setValue: setTranscriptVisible,
    stateSetters: {
      showTranscript: {
        name: 'showTranscript',
        description: 'Show the accessibility transcript panel',
        argsSchema: z.object({}),
        execute: (_, setValue) => setValue(true),
      },
      hideTranscript: {
        name: 'hideTranscript',
        description: 'Hide the accessibility transcript panel',
        argsSchema: z.object({}),
        execute: (_, setValue) => setValue(false),
      },
      toggleTranscript: {
        name: 'toggleTranscript',
        description: 'Toggle the visibility of the accessibility transcript panel',
        argsSchema: z.object({}),
        execute: (currentVisible, setValue) => setValue(!currentVisible),
      },
    },
  });

  useSubscribeStateToAgentContext('transcriptVisible', (transcriptVisible) => ({ transcriptVisible }), {
    showInChat: true,
    color: '#10B981',
  });

  useRegisterFrontendTool({
    name: 'addNewTextLine',
    description: 'Add a new line of text to the screen via frontend tool',
    argsSchema: z.object({
      text: z.string().min(1).describe('The text to add to the screen'),
      style: z.enum(['normal', 'bold', 'italic', 'highlight']).optional(),
    }),
    execute: async (args) => {
      const styledText =
        args.style === 'bold'
          ? `**${args.text}**`
          : args.style === 'italic'
          ? `*${args.text}*`
          : args.style === 'highlight'
          ? `🌟 ${args.text} 🌟`
          : args.text;
      setTextLines((prev) => [...prev, styledText]);
    },
  });

  useRegisterFrontendTool({
    name: 'executeTalkingAction',
    description: 'Execute a specific conversational action with defined behavior patterns',
    argsSchema: z.object({
      actionId: z.string(),
      parameters: z.record(z.any()),
      context: z.string().optional(),
    }),
    execute: async (args) => {
      console.log(`Executing talking action: ${args.actionId}`, args.parameters);
      setTextLines((prev) => [...prev, `🗣️ **Talking Action:** ${args.actionId} ${args.context ? `(${args.context})` : ''}`]);
    },
  });

  useRegisterFrontendTool({
    name: 'selectTalkingStyle',
    description: 'Set the overall conversational style and personality',
    argsSchema: z.object({
      style: z.enum(['casual', 'formal', 'enthusiastic', 'empathetic', 'informative', 'playful']),
      intensity: z.number().min(1).max(10).optional(),
      duration: z.enum(['this-message', 'short-term', 'conversation']).optional(),
    }),
    execute: async (args) => {
      const intensity = args.intensity || 5;
      const duration = args.duration || 'this-message';
      console.log(`Setting talking style: ${args.style} (${intensity}/10) for ${duration}`);
      setTextLines((prev) => [...prev, `🎭 **Style Change:** Now using ${args.style} style (intensity: ${intensity}/10)`]);
    },
  });

  useRegisterFrontendTool({
    name: 'addToTranscript',
    description: 'Add AI response to the accessibility transcript for users who cannot hear',
    argsSchema: z.object({
      text: z.string().min(1),
      type: z.enum(['ai', 'system']).optional(),
    }),
    execute: async (args) => {
      if (typeof window !== 'undefined' && (window as any).addTranscriptEntry) {
        (window as any).addTranscriptEntry(args.text, args.type || 'ai');
      }
    },
  });

  useRegisterFrontendTool({
    name: 'controlTranscript',
    description: 'Show, hide, toggle, or check status of the accessibility transcript panel',
    argsSchema: z.object({
      action: z.enum(['show', 'hide', 'toggle', 'check_status']),
    }),
    execute: async (args) => {
      let newVisibility = transcriptVisible;
      if (args.action === 'show') {
        setTranscriptVisible(true);
        newVisibility = true;
      } else if (args.action === 'hide') {
        setTranscriptVisible(false);
        newVisibility = false;
      } else if (args.action === 'toggle') {
        setTranscriptVisible((prev) => {
          newVisibility = !prev;
          return newVisibility;
        });
      }
      const status = args.action === 'check_status' ? transcriptVisible : newVisibility;
      const message =
        args.action === 'check_status'
          ? `Transcript is currently ${transcriptVisible ? 'visible' : 'hidden'}`
          : `Transcript ${newVisibility ? 'shown' : 'hidden'} successfully`;
      console.log(`[Transcript Control] ${message}`, {
        action: args.action,
        transcriptVisible: status,
      });
      setTextLines((prev) => [...prev, `📝 **Transcript:** ${message}`]);
    },
  });

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="animated-gradient absolute inset-0 -z-10"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] p-8 space-y-8">
        <div className="w-full max-w-7xl flex gap-6">
          {transcriptVisible ? (
            <>
              <div className="max-w-2xl w-full mx-auto">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
                  🎭 Talking Avatar
                </h2>
                <AvatarWithAgentState />
              </div>
              <div className="w-80">
                <Transcript isVisible={transcriptVisible} onToggleVisible={setTranscriptVisible} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="max-w-2xl w-full mx-auto">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
                  🎭 Talking Avatar
                </h2>
                <AvatarWithAgentState />
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">{mainText}</h1>
          <p className="text-lg text-gray-600 mb-8">This text can be changed by Cedar using state setters</p>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">tell cedar to add new lines of text to the screen</h2>
          <p className="text-md text-gray-500 mb-6">Cedar can add new text using frontend tools with different styles</p>
        </div>

        {textLines.length > 0 && (
          <div className="w-full max-w-2xl">
            <h3 className="text-xl font-medium text-gray-700 mb-4 text-center">Added by Cedar:</h3>
            <div className="space-y-2">
              {textLines.map((line, index) => (
                <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  {line.startsWith('**') && line.endsWith('**') ? (
                    <strong className="text-blue-800">{line.slice(2, -2)}</strong>
                  ) : line.startsWith('*') && line.endsWith('*') ? (
                    <em className="text-blue-700">{line.slice(1, -1)}</em>
                  ) : line.startsWith('🌟') ? (
                    <span className="text-yellow-600 font-semibold">{line}</span>
                  ) : (
                    <span className="text-blue-800">{line}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ Google Calendar Widget Section */}
        <div className="w-full max-w-2xl mt-8">
          <h3 className="text-xl font-medium text-gray-700 mb-4 text-center">📅 Calendar</h3>
          <CalendarWidget />
        </div>
      </div>

      <CedarCaptionChat />
    </div>
  );
}