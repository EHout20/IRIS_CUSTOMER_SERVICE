# Adding FBX Models to Your 3D Avatar

This guide will help you add FBX models with animations to your 3D avatar interface.

## 📁 File Structure

Create this folder structure in your project:

```
public/
  models/
    avatar.fbx          # Your main avatar model
    animations/
      idle.fbx         # Idle animation
      wave.fbx         # Waving animation
      dance.fbx        # Dance animation
      walk.fbx         # Walking animation
    textures/
      avatar_diffuse.jpg
      avatar_normal.jpg
```

## 🎯 Where to Get FBX Models

### Free Sources:
1. **Mixamo** (Adobe) - https://www.mixamo.com/
   - Free animated characters
   - Automatic rigging
   - Export as FBX

2. **VRoid Studio** - https://vroid.com/studio
   - Create anime-style characters
   - Export as VRM (convertible to FBX)

3. **Ready Player Me** - https://readyplayer.me/
   - Create personalized avatars
   - Export options available

### Paid Sources:
1. **Unity Asset Store**
2. **Unreal Engine Marketplace**
3. **TurboSquid**
4. **CGTrader**

## 🛠️ Using Mixamo (Recommended for Beginners)

1. **Upload Your Model**:
   - Go to mixamo.com
   - Upload a basic humanoid model or use their characters
   - The system will auto-rig it

2. **Add Animations**:
   - Browse animations (idle, wave, dance, etc.)
   - Click on animation to preview
   - Adjust settings if needed

3. **Download**:
   - Select "FBX for Unity" format
   - Download with "Skin" option
   - Download animations separately

## 📥 Installing the Models

1. **Place Files**:
   ```bash
   # Copy your FBX files to the public folder
   cp your-avatar.fbx public/models/avatar.fbx
   cp idle-animation.fbx public/models/animations/idle.fbx
   ```

2. **Update Component**:
   The `Avatar3DInterface` component will automatically try to load:
   - `/models/avatar.fbx` - Main character model
   - Built-in animations from the FBX file

## 🎮 Available Animations

The system recognizes these animation names:
- `idle` - Default standing animation
- `wave` - Hand waving
- `walk` - Walking cycle
- `run` - Running cycle
- `dance` - Dance moves
- `jump` - Jumping
- `sitting` - Sitting pose
- `happy` - Happy expression/pose
- `sad` - Sad expression/pose

## 🎨 Customizing Your Avatar

### In the Chat Interface:
```
"Play the wave animation"
"Switch to dance animation"
"Make the avatar walk"
"Change to idle pose"
```

### Programmatically:
```typescript
// In your component
const handleAnimationChange = (animationName: string) => {
  setAvatarState(prev => ({
    ...prev,
    currentAnimation: animationName,
    isAnimating: true
  }));
};
```

## 🔧 Troubleshooting

### Model Not Loading:
1. Check file path: `/public/models/avatar.fbx`
2. Check file size (keep under 50MB for web)
3. Ensure FBX version compatibility (FBX 2020 or earlier)

### Animations Not Working:
1. Make sure animations are embedded in the FBX file
2. Check animation names in browser console
3. Verify the model has proper rigging

### Performance Issues:
1. Reduce polygon count of your model
2. Compress textures
3. Use LOD (Level of Detail) models
4. Limit simultaneous animations

## 📱 Model Requirements

### Recommended Specs:
- **Polygons**: 5,000 - 20,000 triangles
- **Textures**: 1024x1024 or 2048x2048
- **File Size**: Under 50MB total
- **Format**: FBX 2020 or earlier
- **Rigging**: Humanoid skeleton

### Texture Maps:
- Diffuse/Albedo
- Normal maps
- Roughness/Metallic (optional)
- Emission (optional)

## 🚀 Quick Start Example

1. **Download a character from Mixamo**
2. **Add animations** (idle, wave, dance)
3. **Place in** `public/models/avatar.fbx`
4. **Start the app** and visit `/avatar-3d`
5. **Chat command**: "Play the wave animation"

## 🎯 Advanced Features

### Multiple Characters:
```typescript
// Load different character models
const characterPaths = {
  'anime-girl': '/models/anime-girl.fbx',
  'robot': '/models/robot.fbx',
  'fantasy': '/models/fantasy-character.fbx'
};
```

### Custom Animations:
```typescript
// Add custom animation sequences
const customAnimations = {
  'greeting-sequence': ['wave', 'idle', 'happy'],
  'dance-party': ['dance', 'jump', 'dance'],
};
```

### Morph Targets:
```typescript
// For facial expressions (if supported by model)
const morphTargets = {
  'smile': 0.8,
  'blink': 1.0,
  'surprised': 0.6,
};
```

## 📚 Resources

- [Three.js FBX Loader Documentation](https://threejs.org/docs/#examples/en/loaders/FBXLoader)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Mixamo Tutorial Videos](https://www.youtube.com/results?search_query=mixamo+tutorial)
- [FBX Format Specification](https://help.autodesk.com/view/FBX/2020/ENU/)

---

🎭 **Happy Avatar Creation!** Your 3D companion awaits!