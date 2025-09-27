import { z } from 'zod';

/**
 * Talking Actions - Defines all conversation and communication behaviors the AI can perform
 * This file organizes action types for different conversation scenarios
 */

// Base action interface
export interface TalkingAction {
  id: string;
  name: string;
  description: string;
  category: 'greeting' | 'conversation' | 'emotional' | 'informational' | 'interactive' | 'social';
  parameters: z.ZodSchema;
  examples: string[];
}

// === GREETING ACTIONS ===
export const greetingActions = {
  casualGreeting: {
    id: 'casual_greeting',
    name: 'Casual Greeting',
    description: 'A friendly, informal greeting for everyday interactions',
    category: 'greeting' as const,
    parameters: z.object({
      timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'any']).optional(),
      enthusiasm: z.number().min(1).max(10).default(7).describe('Energy level 1-10'),
      personalTouch: z.string().optional().describe('Personal element to include')
    }),
    examples: [
      'Hey there! How\'s your day going?',
      'Good morning! Ready for another awesome day?',
      'Evening! Hope you\'re having a great time!'
    ]
  },

  formalGreeting: {
    id: 'formal_greeting',
    name: 'Formal Greeting',
    description: 'A professional, polite greeting for formal interactions',
    category: 'greeting' as const,
    parameters: z.object({
      title: z.string().optional().describe('Professional title if known'),
      purpose: z.string().optional().describe('Reason for the interaction')
    }),
    examples: [
      'Good afternoon, how may I assist you today?',
      'Welcome! I\'m here to help with whatever you need.',
      'Hello, it\'s a pleasure to meet you.'
    ]
  },

  enthusiasticGreeting: {
    id: 'enthusiastic_greeting',
    name: 'Enthusiastic Greeting',
    description: 'High-energy, excited greeting to energize the conversation',
    category: 'greeting' as const,
    parameters: z.object({
      occasion: z.string().optional().describe('Special occasion or reason for excitement'),
      emotionalTone: z.enum(['joyful', 'excited', 'celebratory', 'welcoming']).default('excited')
    }),
    examples: [
      'Hey! I\'m so excited to chat with you today! 🎉',
      'Welcome back! I\'ve been looking forward to this!',
      'Hi there! This is going to be amazing!'
    ]
  }
};

// === CONVERSATION ACTIONS ===
export const conversationActions = {
  activeListening: {
    id: 'active_listening',
    name: 'Active Listening Response',
    description: 'Demonstrates attentive listening and understanding',
    category: 'conversation' as const,
    parameters: z.object({
      keyPoint: z.string().describe('Main point the user made'),
      followUpQuestion: z.string().optional().describe('Question to continue conversation'),
      validationLevel: z.enum(['acknowledge', 'empathize', 'encourage']).default('acknowledge')
    }),
    examples: [
      'I hear you saying that... tell me more about that.',
      'That sounds really important to you. How does that make you feel?',
      'You\'re absolutely right about that. What happened next?'
    ]
  },

  clarifyingQuestion: {
    id: 'clarifying_question',
    name: 'Clarifying Question',
    description: 'Asks for more details or clarification on a topic',
    category: 'conversation' as const,
    parameters: z.object({
      topic: z.string().describe('Topic needing clarification'),
      questionType: z.enum(['detail', 'context', 'feeling', 'preference']).describe('Type of clarification needed')
    }),
    examples: [
      'Could you help me understand more about...?',
      'When you say X, do you mean...?',
      'I want to make sure I understand - are you looking for...?'
    ]
  },

  topicTransition: {
    id: 'topic_transition',
    name: 'Topic Transition',
    description: 'Smoothly transitions between conversation topics',
    category: 'conversation' as const,
    parameters: z.object({
      fromTopic: z.string().describe('Current topic'),
      toTopic: z.string().describe('New topic to transition to'),
      transitionStyle: z.enum(['bridge', 'contrast', 'association', 'time-based']).default('bridge')
    }),
    examples: [
      'Speaking of that, it reminds me of...',
      'That\'s interesting! On a related note...',
      'Let\'s shift gears for a moment and talk about...'
    ]
  }
};

// === EMOTIONAL ACTIONS ===
export const emotionalActions = {
  empathyResponse: {
    id: 'empathy_response',  
    name: 'Empathetic Response',
    description: 'Shows understanding and emotional connection with the user',
    category: 'emotional' as const,
    parameters: z.object({
      emotion: z.enum(['sad', 'frustrated', 'excited', 'worried', 'happy', 'confused']).describe('User\'s detected emotion'),
      intensity: z.number().min(1).max(10).describe('Emotional intensity level'),
      supportType: z.enum(['validate', 'comfort', 'encourage', 'celebrate']).describe('Type of emotional support')
    }),
    examples: [
      'I can understand why you\'d feel that way...',
      'That must have been really difficult for you.',
      'I\'m so happy to hear that went well for you!'
    ]
  },

  encouragement: {
    id: 'encouragement',
    name: 'Encouraging Response',
    description: 'Provides motivation and positive reinforcement',
    category: 'emotional' as const,
    parameters: z.object({
      situation: z.string().describe('What the user is facing'),
      encouragementType: z.enum(['motivational', 'supportive', 'confidence-building', 'reassuring']).default('supportive')
    }),
    examples: [
      'You\'ve got this! I believe in your ability to...',
      'That\'s a great step forward, even if it feels small.',
      'Remember how well you handled similar situations before.'
    ]
  }
};

// === INFORMATIONAL ACTIONS ===
export const informationalActions = {
  explanation: {
    id: 'explanation',
    name: 'Clear Explanation',
    description: 'Provides clear, structured explanations of concepts or processes',
    category: 'informational' as const,
    parameters: z.object({
      topic: z.string().describe('Topic to explain'),
      complexity: z.enum(['simple', 'moderate', 'detailed']).default('moderate'),
      useAnalogies: z.boolean().default(true).describe('Whether to use analogies or examples'),
      includeSteps: z.boolean().default(false).describe('Whether to break into steps')
    }),
    examples: [
      'Let me break that down for you...',
      'Think of it like this...',
      'Here\'s how it works, step by step...'
    ]
  },

  informationGathering: {
    id: 'information_gathering',
    name: 'Information Gathering',
    description: 'Systematically collects information from the user',
    category: 'informational' as const,
    parameters: z.object({
      purpose: z.string().describe('Why this information is needed'),
      questionStyle: z.enum(['direct', 'conversational', 'multiple-choice', 'open-ended']).default('conversational'),
      priorityLevel: z.enum(['essential', 'helpful', 'optional']).default('helpful')
    }),
    examples: [
      'To help you better, could you tell me...?',
      'I\'d love to learn more about your preferences on...',
      'What would be most helpful for you right now?'
    ]
  }
};

// === INTERACTIVE ACTIONS ===
export const interactiveActions = {
  gameOrActivity: {
    id: 'game_or_activity',
    name: 'Interactive Game/Activity',
    description: 'Initiates or guides interactive activities and games',
    category: 'interactive' as const,
    parameters: z.object({
      activityType: z.enum(['word-game', 'trivia', 'creative', 'problem-solving', 'storytelling']),
      duration: z.enum(['quick', 'medium', 'extended']).default('medium'),
      difficulty: z.enum(['easy', 'medium', 'hard']).default('medium')
    }),
    examples: [
      'Want to play a quick word association game?',
      'Let\'s try a creative storytelling exercise!',
      'How about we solve a fun puzzle together?'
    ]
  },

  collaboration: {
    id: 'collaboration',
    name: 'Collaborative Task',
    description: 'Works together with the user on a task or project',
    category: 'interactive' as const,
    parameters: z.object({
      taskType: z.string().describe('Type of collaborative task'),
      userRole: z.string().describe('What the user will contribute'),
      aiRole: z.string().describe('What the AI will contribute')
    }),
    examples: [
      'Let\'s work on this together - you handle X and I\'ll take care of Y.',
      'I\'ll help guide the process while you make the creative decisions.',
      'We make a great team! How should we divide this up?'
    ]
  }
};

// === SOCIAL ACTIONS ===
export const socialActions = {
  casualConversation: {
    id: 'casual_conversation',
    name: 'Casual Social Chat',
    description: 'Engages in light, friendly conversation to build rapport',
    category: 'social' as const,
    parameters: z.object({
      topic: z.enum(['hobbies', 'interests', 'experiences', 'preferences', 'general']).optional(),
      personalityTone: z.enum(['friendly', 'playful', 'curious', 'relaxed']).default('friendly')
    }),
    examples: [
      'So, what\'s been the highlight of your week?',
      'I\'m curious about your thoughts on...',
      'That reminds me of something interesting...'
    ]
  },

  humorAndLightness: {
    id: 'humor_and_lightness',
    name: 'Humor and Lightness',
    description: 'Adds appropriate humor and lightness to the conversation',
    category: 'social' as const,
    parameters: z.object({
      humorType: z.enum(['wordplay', 'observational', 'gentle-teasing', 'self-deprecating', 'situational']),
      appropriateness: z.enum(['safe', 'mild', 'contextual']).default('safe')
    }),
    examples: [
      'Well, that\'s one way to look at it! 😄',
      'I promise I\'m funnier than my programming suggests...',
      'You know what they say about great minds... they think alike!'
    ]
  }
};

// Combine all action categories
export const ALL_TALKING_ACTIONS = {
  greeting: greetingActions,
  conversation: conversationActions,
  emotional: emotionalActions,
  informational: informationalActions,
  interactive: interactiveActions,
  social: socialActions
};

// Helper function to get action by ID
export function getTalkingActionById(actionId: string): TalkingAction | null {
  for (const category of Object.values(ALL_TALKING_ACTIONS)) {
    for (const action of Object.values(category)) {
      if (action.id === actionId) {
        return action as TalkingAction;
      }
    }
  }
  return null;
}

// Helper function to get actions by category
export function getTalkingActionsByCategory(category: TalkingAction['category']): TalkingAction[] {
  const categoryActions = ALL_TALKING_ACTIONS[category];
  return Object.values(categoryActions) as TalkingAction[];
}

// Helper function to get all action IDs
export function getAllTalkingActionIds(): string[] {
  const ids: string[] = [];
  for (const category of Object.values(ALL_TALKING_ACTIONS)) {
    for (const action of Object.values(category)) {
      ids.push(action.id);
    }
  }
  return ids;
}