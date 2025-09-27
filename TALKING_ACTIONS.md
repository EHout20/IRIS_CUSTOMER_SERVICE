# Talking Actions System

## Overview

The Talking Actions system defines structured conversation behaviors that the AI can perform. This system organizes different types of conversational patterns into categories, making it easy for the AI to select appropriate responses based on context.

## File Structure

```
src/backend/src/mastra/tools/
├── talkingActions.ts     # Defines all talking action types and behaviors
└── toolDefinitions.ts   # Registers tools with Cedar backend
```

## Action Categories

### 🤝 Greeting Actions
- **Casual Greeting**: Friendly, informal hellos
- **Formal Greeting**: Professional, polite introductions  
- **Enthusiastic Greeting**: High-energy, excited welcomes

### 💬 Conversation Actions
- **Active Listening**: Demonstrates understanding and engagement
- **Clarifying Questions**: Asks for more details or clarification
- **Topic Transitions**: Smoothly moves between conversation topics

### ❤️ Emotional Actions
- **Empathy Response**: Shows understanding and emotional connection
- **Encouragement**: Provides motivation and positive reinforcement

### 📚 Informational Actions
- **Explanation**: Provides clear, structured explanations
- **Information Gathering**: Systematically collects user information

### 🎮 Interactive Actions
- **Games/Activities**: Initiates interactive experiences
- **Collaboration**: Works together on tasks or projects

### 👥 Social Actions
- **Casual Conversation**: Light, friendly rapport building
- **Humor & Lightness**: Adds appropriate humor to conversations

## How It Works

### 1. Action Definition
Each talking action includes:
- **ID**: Unique identifier
- **Name**: Human-readable name
- **Description**: What the action does
- **Category**: Which type of conversation it belongs to
- **Parameters**: Configurable options (using Zod schemas)
- **Examples**: Sample phrases or approaches

### 2. Backend Tools
The system creates Cedar tools that allow the AI to:
- `executeTalkingAction`: Run a specific conversational behavior
- `selectTalkingStyle`: Set overall conversation tone and style

### 3. Frontend Integration
The frontend receives these actions and can:
- Display visual feedback about active conversation styles
- Show which talking actions are being used
- Provide user interface elements related to conversation modes

## Usage Examples

### For the AI:
```typescript
// Execute a specific talking action
executeTalkingAction({
  actionId: 'empathy_response',
  parameters: {
    emotion: 'frustrated',
    intensity: 7,
    supportType: 'comfort'
  },
  context: 'User just described a difficult work situation'
})

// Set overall conversation style
selectTalkingStyle({
  style: 'empathetic',
  intensity: 8,
  duration: 'conversation'
})
```

### Backend Tool Registration:
```typescript
// In toolDefinitions.ts
export const executeTalkingActionTool = createMastraToolForFrontendTool(
  'executeTalkingAction',
  ExecuteTalkingActionSchema,
  {
    description: 'Execute specific talking action with defined conversational behavior patterns',
    toolId: 'executeTalkingAction',
    streamEventFn: streamJSONEvent,
    errorSchema: ErrorResponseSchema,
  }
);
```

## Benefits

1. **Structured Conversations**: AI responses follow consistent patterns
2. **Context Awareness**: Actions can be selected based on conversation context
3. **Personality Consistency**: Maintains coherent conversational style
4. **Extensibility**: Easy to add new action types and behaviors
5. **User Experience**: More natural, engaging conversations

## Integration with FBX System

The talking actions work alongside the FBX avatar system:
- Actions can trigger avatar expressions and gestures
- Avatar emotions can influence talking action selection
- 3D avatar movements can accompany conversational behaviors

## Adding New Actions

To add a new talking action:

1. **Define the action** in `talkingActions.ts`:
```typescript
export const newCategoryActions = {
  myNewAction: {
    id: 'my_new_action',
    name: 'My New Action',
    description: 'What this action does',
    category: 'conversation' as const,
    parameters: z.object({
      param1: z.string().describe('First parameter'),
      param2: z.number().optional().describe('Optional parameter')
    }),
    examples: [
      'Example phrase 1',
      'Example phrase 2'
    ]
  }
};
```

2. **Update the action registry** in the same file
3. **The system automatically includes** new actions in the tool schemas

This creates a comprehensive, structured system for AI conversational behaviors! 🎯