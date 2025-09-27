import {
  createMastraToolForFrontendTool,
  createMastraToolForStateSetter,
  createRequestAdditionalContextTool,
} from '@cedar-os/backend';
import { streamJSONEvent } from '../../utils/streamUtils';
import { z } from 'zod';
import { 
  ALL_TALKING_ACTIONS, 
  getTalkingActionById, 
  getAllTalkingActionIds 
} from './talkingActions';

// Define the schemas for our tools based on what we registered in page.tsx

// Schema for the addNewTextLine frontend tool
export const AddNewTextLineSchema = z.object({
  text: z.string().min(1, 'Text cannot be empty').describe('The text to add to the screen'),
  style: z
    .enum(['normal', 'bold', 'italic', 'highlight'])
    .optional()
    .describe('Text style to apply'),
});

// Schema for the changeText state setter
export const ChangeTextSchema = z.object({
  newText: z.string().min(1, 'Text cannot be empty').describe('The new text to display'),
});

// Schema for transcript control
export const TranscriptControlSchema = z.object({
  action: z.enum(['show', 'hide', 'toggle', 'check_status']).describe('Action to perform on transcript'),
});

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

// Avatar control schemas
export const PerformAvatarGestureSchema = z.object({
  gesture: z.enum(['wave', 'nod_yes', 'shake_no', 'think', 'celebrate', 'look_around']).describe('The gesture to perform'),
  intensity: z.number().min(0).max(1).optional().describe('Intensity of the gesture (0-1)'),
});

export const ExpressEmotionSchema = z.object({
  emotion: z.enum(['joy', 'surprise', 'concern', 'thoughtful', 'playful', 'sleepy']).describe('The emotion to express'),
  message: z.string().optional().describe('Optional message to accompany the emotion'),
  duration: z.number().optional().describe('How long to hold the expression (in seconds)'),
});

export const AnalyzeUserBehaviorSchema = z.object({
  observation: z.string().describe('What the avatar observed about the user'),
  response: z.string().describe('How the avatar should respond'),
  adjustMood: z.boolean().optional().describe('Whether to adjust mood based on observation'),
});

export const StartVideoCallSchema = z.object({
  greeting: z.string().optional().describe('Optional greeting message to display'),
});

// Avatar state setter schemas
export const ChangeExpressionSchema = z.object({
  expression: z.enum(['neutral', 'happy', 'surprised', 'thinking', 'speaking', 'winking', 'sad']).describe('The new facial expression'),
  duration: z.number().optional().describe('Animation duration in milliseconds'),
});

export const ChangePoseSchema = z.object({
  pose: z.enum(['center', 'left', 'right', 'nodding', 'shaking']).describe('The new head pose'),
  duration: z.number().optional().describe('Animation duration in milliseconds'),
});

export const SetMoodSchema = z.object({
  mood: z.enum(['calm', 'excited', 'focused', 'sleepy']).describe('The avatar\'s mood state'),
});

export const AddToConversationSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').describe('The message to add'),
  speaker: z.enum(['user', 'assistant']).describe('Who said the message'),
});

export const SetAvatarMoodSchema = z.object({
  mood: z.enum(['calm', 'excited', 'focused', 'sleepy']).describe('The new mood for the avatar'),
  reason: z.string().optional().describe('Optional reason for the mood change'),
});

// FBX File handling schemas
export const LoadFbxFromUrlSchema = z.object({
  url: z.string().url().describe('URL of the FBX file to load'),
});

export const SetFbxUrlSchema = z.object({
  url: z.string().url().describe('URL of the FBX file to load'),
});

// Talking Action schemas
export const ExecuteTalkingActionSchema = z.object({
  actionId: z.enum(getAllTalkingActionIds() as [string, ...string[]]).describe('ID of the talking action to execute'),
  parameters: z.record(z.any()).describe('Parameters specific to the chosen talking action'),
  context: z.string().optional().describe('Additional context for the action'),
});

export const SelectTalkingStyleSchema = z.object({
  style: z.enum(['casual', 'formal', 'enthusiastic', 'empathetic', 'informative', 'playful']).describe('Overall talking style to adopt'),
  intensity: z.number().min(1).max(10).default(5).describe('Intensity level of the style (1-10)'),
  duration: z.enum(['this-message', 'short-term', 'conversation']).default('this-message').describe('How long to maintain this style'),
});

// Create backend tools for the frontend tool
export const addNewTextLineTool = createMastraToolForFrontendTool(
  'addNewTextLine',
  AddNewTextLineSchema,
  {
    description:
      'Add a new line of text to the screen with optional styling. This tool allows the agent to dynamically add text content that will be displayed on the user interface with different visual styles.',
    toolId: 'addNewTextLine',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

// Create backend tools for the state setter
export const changeTextTool = createMastraToolForStateSetter(
  'mainText', // The state key
  'changeText', // The state setter name
  ChangeTextSchema,
  {
    description:
      'Change the main text displayed on the screen. This tool allows the agent to modify the primary text content that users see, replacing the current text with new content.',
    toolId: 'changeText',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

// Transcript control tools
export const showTranscriptTool = createMastraToolForStateSetter(
  'transcriptVisible',
  'showTranscript',
  z.object({}),
  {
    description: 'Show the accessibility transcript panel for users who need visual text support.',
    toolId: 'showTranscript',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

export const hideTranscriptTool = createMastraToolForStateSetter(
  'transcriptVisible',
  'hideTranscript',
  z.object({}),
  {
    description: 'Hide the accessibility transcript panel to give more screen space.',
    toolId: 'hideTranscript',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

export const toggleTranscriptTool = createMastraToolForStateSetter(
  'transcriptVisible',
  'toggleTranscript',
  z.object({}),
  {
    description: 'Toggle the visibility of the accessibility transcript panel (show if hidden, hide if shown).',
    toolId: 'toggleTranscript',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

// Advanced transcript control with status checking
export const controlTranscriptTool = createMastraToolForFrontendTool(
  'controlTranscript',
  TranscriptControlSchema,
  {
    description: 'Advanced transcript control that can show, hide, toggle, or check the current status of the accessibility transcript. Updates transcript visibility and provides feedback.',
    toolId: 'controlTranscript',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

// Custom tool for getting transcript status with return value
export const getTranscriptStatusTool = {
  name: 'getTranscriptStatus',
  description: 'Get the current visibility status of the accessibility transcript panel. Returns true if visible, false if hidden.',
  parameters: z.object({
    includeDetails: z.boolean().optional().describe('Include additional details about transcript state (default: false)'),
  }),
  execute: async (args: { includeDetails?: boolean }, context: any) => {
    try {
      // Get current transcript state from context
      const transcriptVisible = context?.state?.transcriptVisible ?? true; // Default to true
      
      const result = {
        transcriptVisible,
        status: transcriptVisible ? 'visible' : 'hidden',
        timestamp: new Date().toISOString(),
      };

      if (args?.includeDetails) {
        return {
          ...result,
          details: {
            canBeToggled: true,
            purpose: 'accessibility support for users who cannot hear audio',
            controlMethods: ['showTranscript', 'hideTranscript', 'toggleTranscript', 'controlTranscript']
          }
        };
      }

      return result;
    } catch (error) {
      return {
        error: 'Failed to get transcript status',
        transcriptVisible: null,
        status: 'unknown'
      };
    }
  },
};

// Avatar control frontend tools
export const performAvatarGestureTool = createMastraToolForFrontendTool(
  'performAvatarGesture',
  PerformAvatarGestureSchema,
  {
    description: 'Make the avatar perform a specific gesture or animation sequence like waving, nodding, or celebrating.',
    toolId: 'performAvatarGesture',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

export const expressEmotionTool = createMastraToolForFrontendTool(
  'expressEmotion',
  ExpressEmotionSchema,
  {
    description: 'Make the avatar express a specific emotion or reaction with optional accompanying message.',
    toolId: 'expressEmotion',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

export const analyzeUserBehaviorTool = createMastraToolForFrontendTool(
  'analyzeUserBehavior',
  AnalyzeUserBehaviorSchema,
  {
    description: 'Analyze and respond to user behavior or conversation patterns, allowing the avatar to be more contextually aware.',
    toolId: 'analyzeUserBehavior',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

export const startVideoCallTool = createMastraToolForFrontendTool(
  'startVideoCall',
  StartVideoCallSchema,
  {
    description: 'Initialize or restart the video call session with an optional greeting message.',
    toolId: 'startVideoCall',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

// Avatar state setter tools
export const changeAvatarExpressionTool = createMastraToolForStateSetter(
  'avatarState',
  'changeExpression',
  ChangeExpressionSchema,
  {
    description: 'Change the avatar\'s facial expression to convey different emotions and reactions.',
    toolId: 'changeExpression',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

export const changeAvatarPoseTool = createMastraToolForStateSetter(
  'avatarState',
  'changePose',
  ChangePoseSchema,
  {
    description: 'Change the avatar\'s head pose and orientation for more dynamic interactions.',
    toolId: 'changePose',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

export const setAvatarMoodTool = createMastraToolForStateSetter(
  'avatarState',
  'setMood',
  SetMoodSchema,
  {
    description: 'Set the avatar\'s overall mood which affects subtle animations and behavior.',
    toolId: 'setMood',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

export const addToConversationTool = createMastraToolForStateSetter(
  'conversationHistory',
  'addToConversation',
  AddToConversationSchema,
  {
    description: 'Add a new message to the conversation history for tracking dialogue.',
    toolId: 'addToConversation',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

export const setAvatarMoodStateTool = createMastraToolForStateSetter(
  'avatarMood',
  'setAvatarMood',
  SetAvatarMoodSchema,
  {
    description: 'Change the avatar\'s mood state with optional reasoning.',
    toolId: 'setAvatarMood',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

// FBX File tools
export const loadFbxFromUrlTool = createMastraToolForFrontendTool(
  'loadFbxFromUrl',
  LoadFbxFromUrlSchema,
  {
    description: 'Load an FBX 3D model file from a URL for avatar or scene use.',
    toolId: 'loadFbxFromUrl',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

export const setFbxUrlTool = createMastraToolForStateSetter(
  'fbxFile',
  'setFbxUrl',
  SetFbxUrlSchema,
  {
    description: 'Set the URL of an FBX file to load into the 3D scene.',
    toolId: 'setFbxUrl',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

// Talking Action tools
export const executeTalkingActionTool = createMastraToolForFrontendTool(
  'executeTalkingAction',
  ExecuteTalkingActionSchema,
  {
    description: 'Execute a specific talking action with defined conversational behavior patterns. Choose from greeting, conversation, emotional, informational, interactive, or social actions.',
    toolId: 'executeTalkingAction',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

export const selectTalkingStyleTool = createMastraToolForFrontendTool(
  'selectTalkingStyle', 
  SelectTalkingStyleSchema,
  {
    description: 'Set the overall talking style and personality for the conversation. Affects how all subsequent messages are delivered.',
    toolId: 'selectTalkingStyle',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  },
);

export const requestAdditionalContextTool = createRequestAdditionalContextTool();

/**
 * Registry of all available tools organized by category
 * This structure makes it easy to see tool organization and generate categorized descriptions
 */
export const TOOL_REGISTRY = {
  textManipulation: {
    changeTextTool,
    addNewTextLineTool,
  },
  transcriptControl: {
    showTranscriptTool,
    hideTranscriptTool,
    toggleTranscriptTool,
    controlTranscriptTool,
    getTranscriptStatusTool,
  },
  avatarControl: {
    performAvatarGestureTool,
    expressEmotionTool,
    analyzeUserBehaviorTool,
    startVideoCallTool,
    changeAvatarExpressionTool,
    changeAvatarPoseTool,
    setAvatarMoodTool,
    addToConversationTool,
    setAvatarMoodStateTool,
  },
  fbxFileHandling: {
    loadFbxFromUrlTool,
    setFbxUrlTool,
  },
  conversationalActions: {
    executeTalkingActionTool,
    selectTalkingStyleTool,
  },
};

// Export all tools as an array for easy registration
export const ALL_TOOLS = [
  // Text manipulation
  changeTextTool, 
  addNewTextLineTool,
  // Transcript control
  showTranscriptTool,
  hideTranscriptTool,
  toggleTranscriptTool,
  controlTranscriptTool,
  getTranscriptStatusTool,
  // Avatar control
  performAvatarGestureTool,
  expressEmotionTool,
  analyzeUserBehaviorTool,
  startVideoCallTool,
  changeAvatarExpressionTool,
  changeAvatarPoseTool,
  setAvatarMoodTool,
  addToConversationTool,
  setAvatarMoodStateTool,
  // FBX file handling
  loadFbxFromUrlTool,
  setFbxUrlTool,
  // Conversational actions
  executeTalkingActionTool,
  selectTalkingStyleTool,
];
