'use client';

import React from 'react';
import { z } from 'zod';
import {
  useRegisterState,
  useRegisterFrontendTool,
  useSubscribeStateToAgentContext,
} from 'cedar-os';

// import { ChatModeSelector } from '@/components/ChatModeSelector';
import FBXViewer from '@/components/FBXViewer';

// Wrapper to link FBXViewer to Cedar agent state
function AvatarWithAgentState() {
  // Subscribe to Cedar state for agent thinking/responding
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
import Transcript from '@/components/Transcript';
import { CedarCaptionChat } from '@/cedar/components/chatComponents/CedarCaptionChat';

export default function HomePage() {
  // Cedar state for the main text that can be changed by the agent
  const [mainText, setMainText] = React.useState('Tell Cedar to change me');

  // Cedar state for dynamically added text lines
  const [textLines, setTextLines] = React.useState<string[]>([]);

  // Cedar state for transcript visibility
  const [transcriptVisible, setTranscriptVisible] = React.useState(true);

  // Cedar state for whether the agent is talking
  const [isTalking, setIsTalking] = React.useState(false);

  // Register isTalking as Cedar state
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
        execute: (current: boolean, setValue: (v: boolean) => void) => {
          setValue(true);
        },
      },
      setIdle: {
        name: 'setIdle',
        description: 'Set the agent to idle mode (shows idle animation)',
        argsSchema: z.object({}),
        execute: (current: boolean, setValue: (v: boolean) => void) => {
          setValue(false);
        },
      },
    },
  });

  useSubscribeStateToAgentContext('isTalking', (isTalking) => ({ isTalking }), {
    showInChat: true,
    color: '#F59E42',
  });

  // Register the main text as Cedar state with a state setter
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
          newText: z.string().min(1, 'Text cannot be empty').describe('The new text to display'),
        }),
        execute: (currentText: string, setValue: (newValue: string) => void, args: { newText: string }) => {
          setValue(args.newText);
        },
      },
    },
  });

  // Subscribe the main text state to the backend
  useSubscribeStateToAgentContext('mainText', (mainText) => ({ mainText }), {
    showInChat: true,
    color: '#4F46E5',
  });

  // Register transcript visibility as Cedar state
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
        execute: (_, setValue: (newValue: boolean) => void) => {
          setValue(true);
        },
      },
      hideTranscript: {
        name: 'hideTranscript',
        description: 'Hide the accessibility transcript panel',
        argsSchema: z.object({}),
        execute: (_, setValue: (newValue: boolean) => void) => {
          setValue(false);
        },
      },
      toggleTranscript: {
        name: 'toggleTranscript',
        description: 'Toggle the visibility of the accessibility transcript panel',
        argsSchema: z.object({}),
        execute: (currentVisible: boolean, setValue: (newValue: boolean) => void) => {
          setValue(!currentVisible);
        },
      },
    },
  });

  // Subscribe transcript visibility to the backend
  useSubscribeStateToAgentContext('transcriptVisible', (transcriptVisible) => ({ transcriptVisible }), {
    showInChat: true,
    color: '#10B981',
  });

  // Register frontend tool for adding text lines
  useRegisterFrontendTool({
    name: 'addNewTextLine',
    description: 'Add a new line of text to the screen via frontend tool',
    argsSchema: z.object({
      text: z.string().min(1, 'Text cannot be empty').describe('The text to add to the screen'),
      style: z.enum(['normal', 'bold', 'italic', 'highlight']).optional().describe('Text style to apply'),
    }),
    execute: async (args: { text: string; style?: 'normal' | 'bold' | 'italic' | 'highlight' }) => {
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

  // Register talking action tools
  useRegisterFrontendTool({
    name: 'executeTalkingAction',
    description: 'Execute a specific conversational action with defined behavior patterns',
    argsSchema: z.object({
      actionId: z.string().describe('ID of the talking action to execute'),
      parameters: z.record(z.any()).describe('Parameters for the action'),
      context: z.string().optional().describe('Additional context'),
    }),
    execute: async (args: { actionId: string; parameters: Record<string, any>; context?: string }) => {
      console.log(`Executing talking action: ${args.actionId}`, args.parameters);
      setTextLines((prev) => [...prev, `🗣️ **Talking Action:** ${args.actionId} ${args.context ? `(${args.context})` : ''}`]);
    },
  });

  useRegisterFrontendTool({
    name: 'selectTalkingStyle',
    description: 'Set the overall conversational style and personality',
    argsSchema: z.object({
      style: z.enum(['casual', 'formal', 'enthusiastic', 'empathetic', 'informative', 'playful']).describe('Talking style'),
      intensity: z.number().min(1).max(10).optional().describe('Style intensity'),
      duration: z.enum(['this-message', 'short-term', 'conversation']).optional().describe('Duration'),
    }),
    execute: async (args: { style: string; intensity?: number; duration?: string }) => {
      const intensity = args.intensity || 5;
      const duration = args.duration || 'this-message';
      console.log(`Setting talking style: ${args.style} (${intensity}/10) for ${duration}`);
      setTextLines((prev) => [...prev, `🎭 **Style Change:** Now using ${args.style} style (intensity: ${intensity}/10)`]);
    },
  });

  // Register transcript management tool
  useRegisterFrontendTool({
    name: 'addToTranscript',
    description: 'Add AI response to the accessibility transcript for users who cannot hear',
    argsSchema: z.object({
      text: z.string().min(1).describe('The AI response text to add to transcript'),
      type: z.enum(['ai', 'system']).optional().describe('Type of message (default: ai)'),
    }),
    execute: async (args: { text: string; type?: 'ai' | 'system' }) => {
      if (typeof window !== 'undefined' && (window as any).addTranscriptEntry) {
        (window as any).addTranscriptEntry(args.text, args.type || 'ai');
      }
    },
  });

  // Register transcript control tool
  useRegisterFrontendTool({
    name: 'controlTranscript',
    description: 'Show, hide, toggle, or check status of the accessibility transcript panel. Updates transcript visibility and logs status.',
    argsSchema: z.object({
      action: z.enum(['show', 'hide', 'toggle', 'check_status']).describe('Action to perform on transcript'),
    }),
    execute: async (args: { action: 'show' | 'hide' | 'toggle' | 'check_status' }) => {
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
      {/* Background gradient */}
      <div className="animated-gradient absolute inset-0 -z-10"></div>

      {/* Main interactive content area with Avatar and Transcript side by side */}
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

        {/* Big text that Cedar can change */}
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">{mainText}</h1>
          <p className="text-lg text-gray-600 mb-8">This text can be changed by Cedar using state setters</p>
        </div>

        {/* Instructions for adding new text */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">tell cedar to add new lines of text to the screen</h2>
          <p className="text-md text-gray-500 mb-6">Cedar can add new text using frontend tools with different styles</p>
        </div>

        {/* Display dynamically added text lines */}
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
      </div>

      {/* Always show CedarCaptionChat */}
      <CedarCaptionChat />
    </div>
  );
}
