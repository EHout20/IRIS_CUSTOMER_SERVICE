# AI Anime Waifu - Interactive Video Call Avatar

This project creates an interactive AI avatar that can be controlled through natural language chat, similar to a video call interface like Zoom. The avatar responds to Cedar's AI capabilities and can change expressions, poses, and moods based on the conversation.

## 🌟 Features

### 🎭 Interactive 3D Avatar
- **Dynamic Expressions**: The avatar can display different facial expressions (happy, surprised, thinking, speaking, winking, sad, neutral)
- **Animated Poses**: Head movements and orientations (center, left, right, nodding, shaking)
- **Mood States**: Overall mood affects subtle animations (calm, excited, focused, sleepy)
- **Auto-animations**: Automatic blinking and breathing effects for realism

### 💬 Cedar AI Integration
- **Natural Language Control**: Chat with the AI to control the avatar's behavior
- **State Management**: Avatar state is managed through Cedar's state system
- **Real-time Updates**: Changes reflect immediately in the 3D avatar
- **Context Awareness**: Avatar can analyze and respond to user behavior

### 🎥 Video Call Interface
- **Zoom-like UI**: Familiar video call interface with controls
- **Chat Integration**: Cedar chat panel slides in from the right
- **Visual Effects**: Animated particles and spotlight effects
- **Responsive Design**: Works on different screen sizes

## 🚀 Available Commands

The AI can control the avatar through these capabilities:

### Avatar Expressions
- Change facial expressions: "Make the avatar look happy", "Show a surprised expression"
- Control animations: "Make the avatar think", "Show a winking face"

### Avatar Gestures
- Perform gestures: "Wave hello", "Nod yes", "Shake no", "Look around"
- Complex sequences: "Celebrate", "Think deeply"

### Mood Control
- Set overall mood: "Make the avatar excited", "Set a calm mood", "Focus mode"
- Contextual responses: "The avatar should look sleepy"

### Conversation Management
- Track dialogue: "Add this to our conversation history"
- Analyze behavior: "Notice that the user seems tired"

## 🎮 How to Use

1. **Start the Application**:
   ```bash
   npm run dev
   ```

2. **Access Video Call Mode**:
   - Visit `http://localhost:3000`
   - Click the "📹 Video Call Mode" button in the top-right
   - Or go directly to `http://localhost:3000/video-call`

3. **Interact with the Avatar**:
   - Click "💬 Open Chat" to open the Cedar chat panel
   - Type natural language commands like:
     - "Make the avatar wave hello"
     - "Change the expression to happy"
     - "Set the mood to excited"
     - "Make the avatar nod yes"

4. **Example Interactions**:
   ```
   User: "Hello! Can you wave at me?"
   AI: *Makes avatar wave and change expression to happy*
   
   User: "I'm feeling tired today"
   AI: *Analyzes behavior and sets avatar to a more gentle, sleepy mood*
   
   User: "Show me you're thinking"
   AI: *Changes avatar expression to thinking pose*
   ```

## 🏗️ Architecture

### Frontend Components
- **`Headshot.tsx`**: Core 3D avatar component with animations
- **`VideoCallInterface.tsx`**: Video call UI wrapper
- **`/video-call/page.tsx`**: Main video call page with Cedar integration

### Backend Tools
Located in `src/backend/src/mastra/tools/toolDefinitions.ts`:

#### Frontend Tools
- `performAvatarGesture`: Control avatar gestures
- `expressEmotion`: Make avatar express emotions
- `analyzeUserBehavior`: Contextual behavior analysis
- `startVideoCall`: Initialize video call session

#### State Setters
- `changeExpression`: Change facial expressions
- `changePose`: Change head pose/orientation
- `setMood`: Set overall mood
- `addToConversation`: Track conversation history

### State Management
- **Avatar State**: Expression, pose, mood, animation flags
- **Conversation History**: Track dialogue between user and AI
- **Mood State**: Current avatar mood affecting behavior

## 🎨 Customization

### Avatar Appearance
Edit `src/components/headshot.tsx`:
- Modify colors in the CSS-in-JS styles
- Adjust size configurations
- Add new expressions or poses

### Video Call Interface
Edit `src/components/VideoCallInterface.tsx`:
- Change background effects
- Modify control layout
- Add new UI elements

### AI Behavior
Edit backend tools in `toolDefinitions.ts`:
- Add new gestures or expressions
- Modify behavior analysis logic
- Create custom avatar responses

## 🔧 Technical Details

### Animation System
- Uses Framer Motion for smooth animations
- CSS transforms for 3D-like effects
- State-driven animation triggers

### Cedar Integration
- `useRegisterState`: Register avatar state with Cedar
- `useRegisterFrontendTool`: Create controllable actions
- `useSubscribeStateToAgentContext`: Share state with AI

### Responsive Design
- Tailwind CSS for styling
- Mobile-friendly interface
- Adaptive avatar sizing

## 🐛 Troubleshooting

### Avatar Not Responding
- Check if Cedar backend is running (`npm run dev` starts both)
- Verify OpenAI API key is set in `.env`
- Look for errors in browser console

### Chat Not Working
- Ensure backend is accessible at `http://localhost:4111`
- Check network tab for API call failures
- Verify state registration in browser dev tools

### Performance Issues
- Reduce particle count in VideoCallInterface
- Disable auto-animations if needed
- Check for memory leaks in animation cleanup

## 🚀 Future Enhancements

- **Voice Integration**: Add speech recognition and synthesis
- **3D Graphics**: Integrate Three.js for true 3D avatar
- **Multiple Avatars**: Support different character models
- **Gesture Recognition**: Use camera input for gesture mirroring
- **Emotion Recognition**: Analyze user emotions from video
- **Custom Animations**: User-defined gesture sequences

## 🤝 Contributing

Feel free to contribute new features, expressions, or improvements! The modular architecture makes it easy to extend avatar capabilities.

---

Enjoy your interactive AI avatar experience! 🎭✨