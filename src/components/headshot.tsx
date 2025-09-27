'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRegisterState, useRegisterFrontendTool, useCedarStore } from 'cedar-os';
import { z } from 'zod';

// Define avatar states and expressions
type AvatarExpression = 'neutral' | 'happy' | 'surprised' | 'thinking' | 'speaking' | 'winking' | 'sad';
type AvatarPose = 'center' | 'left' | 'right' | 'nodding' | 'shaking';
type AvatarMood = 'calm' | 'excited' | 'focused' | 'sleepy';

interface AvatarState {
  expression: AvatarExpression;
  pose: AvatarPose;
  mood: AvatarMood;
  isAnimating: boolean;
  eyeBlinkRate: number;
  speechIntensity: number;
}

interface HeadshotProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  enableAutoAnimation?: boolean;
}

export const Headshot: React.FC<HeadshotProps> = ({ 
  className = '', 
  size = 'large',
  enableAutoAnimation = true 
}) => {
  // Avatar state management
  const [avatarState, setAvatarState] = useState<AvatarState>({
    expression: 'neutral',
    pose: 'center',
    mood: 'calm',
    isAnimating: false,
    eyeBlinkRate: 3000, // milliseconds between blinks
    speechIntensity: 0
  });

  const [isBlinking, setIsBlinking] = useState(false);
  const [isBreathing, setIsBreathing] = useState(true);

  // Register avatar state with Cedar so it can be monitored and controlled
  useRegisterState({
    key: 'avatarState',
    description: 'The current state of the 3D avatar including expression, pose, and mood',
    value: avatarState,
    setValue: setAvatarState,
    stateSetters: {
      changeExpression: {
        name: 'changeExpression',
        description: 'Change the avatar\'s facial expression',
        argsSchema: z.object({
          expression: z.enum(['neutral', 'happy', 'surprised', 'thinking', 'speaking', 'winking', 'sad']).describe('The new facial expression'),
          duration: z.number().optional().describe('Animation duration in milliseconds')
        }),
        execute: (currentState: AvatarState, setValue: (newState: AvatarState) => void, args: { expression: AvatarExpression, duration?: number }) => {
          setValue({
            ...currentState,
            expression: args.expression,
            isAnimating: true
          });
          
          // Reset animation flag after duration
          setTimeout(() => {
            const newState = { ...currentState, isAnimating: false };
            setValue(newState);
          }, args.duration || 500);
        }
      },
      changePose: {
        name: 'changePose',
        description: 'Change the avatar\'s head pose and orientation',
        argsSchema: z.object({
          pose: z.enum(['center', 'left', 'right', 'nodding', 'shaking']).describe('The new head pose'),
          duration: z.number().optional().describe('Animation duration in milliseconds')
        }),
        execute: (currentState: AvatarState, setValue: (newState: AvatarState) => void, args: { pose: AvatarPose, duration?: number }) => {
          setValue({
            ...currentState,
            pose: args.pose,
            isAnimating: true
          });
          
          setTimeout(() => {
            const newState = { ...currentState, isAnimating: false, pose: 'center' as AvatarPose };
            setValue(newState);
          }, args.duration || 1000);
        }
      },
      setMood: {
        name: 'setMood',
        description: 'Set the avatar\'s overall mood which affects subtle animations',
        argsSchema: z.object({
          mood: z.enum(['calm', 'excited', 'focused', 'sleepy']).describe('The avatar\'s mood state')
        }),
        execute: (currentState: AvatarState, setValue: (newState: AvatarState) => void, args: { mood: AvatarMood }) => {
          setValue({
            ...currentState,
            mood: args.mood
          });
        }
      }
    }
  });

  // Register frontend tools for direct avatar control
  useRegisterFrontendTool({
    name: 'performAvatarGesture',
    description: 'Make the avatar perform a specific gesture or animation sequence',
    argsSchema: z.object({
      gesture: z.enum(['wave', 'nod_yes', 'shake_no', 'think', 'celebrate', 'look_around']).describe('The gesture to perform'),
      intensity: z.number().min(0).max(1).optional().describe('Intensity of the gesture (0-1)')
    }),
    execute: async (args: { gesture: string, intensity?: number }) => {
      const intensity = args.intensity || 0.7;
      
      switch (args.gesture) {
        case 'wave':
          // Simulate waving by changing pose quickly
          setAvatarState(prev => ({ ...prev, expression: 'happy', pose: 'left', isAnimating: true }));
          setTimeout(() => setAvatarState(prev => ({ ...prev, pose: 'right' })), 200);
          setTimeout(() => setAvatarState(prev => ({ ...prev, pose: 'left' })), 400);
          setTimeout(() => setAvatarState(prev => ({ ...prev, pose: 'center', expression: 'neutral', isAnimating: false })), 600);
          break;
          
        case 'nod_yes':
          setAvatarState(prev => ({ ...prev, pose: 'nodding', isAnimating: true }));
          setTimeout(() => setAvatarState(prev => ({ ...prev, pose: 'center', isAnimating: false })), 800);
          break;
          
        case 'shake_no':
          setAvatarState(prev => ({ ...prev, pose: 'shaking', isAnimating: true }));
          setTimeout(() => setAvatarState(prev => ({ ...prev, pose: 'center', isAnimating: false })), 800);
          break;
          
        case 'think':
          setAvatarState(prev => ({ ...prev, expression: 'thinking', pose: 'left', mood: 'focused' }));
          setTimeout(() => setAvatarState(prev => ({ ...prev, expression: 'neutral', pose: 'center' })), 2000);
          break;
          
        case 'celebrate':
          setAvatarState(prev => ({ ...prev, expression: 'happy', mood: 'excited', isAnimating: true }));
          setTimeout(() => setAvatarState(prev => ({ ...prev, mood: 'calm', isAnimating: false })), 1500);
          break;
          
        case 'look_around':
          setAvatarState(prev => ({ ...prev, pose: 'left', isAnimating: true }));
          setTimeout(() => setAvatarState(prev => ({ ...prev, pose: 'right' })), 500);
          setTimeout(() => setAvatarState(prev => ({ ...prev, pose: 'center', isAnimating: false })), 1000);
          break;
      }
    }
  });

  // Auto-blinking animation
  useEffect(() => {
    if (!enableAutoAnimation) return;
    
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, avatarState.eyeBlinkRate);

    return () => clearInterval(blinkInterval);
  }, [avatarState.eyeBlinkRate, enableAutoAnimation]);

  // Size configurations
  const sizeConfig = {
    small: { width: 120, height: 120, scale: 0.7 },
    medium: { width: 200, height: 200, scale: 0.85 },
    large: { width: 300, height: 300, scale: 1 }
  };

  const currentSize = sizeConfig[size];

  // Expression configurations
  const getExpressionStyles = (expression: AvatarExpression) => {
    switch (expression) {
      case 'happy':
        return {
          mouth: 'smile',
          eyes: 'happy',
          eyebrows: 'raised'
        };
      case 'surprised':
        return {
          mouth: 'open',
          eyes: 'wide',
          eyebrows: 'raised'
        };
      case 'thinking':
        return {
          mouth: 'neutral',
          eyes: 'focused',
          eyebrows: 'furrowed'
        };
      case 'speaking':
        return {
          mouth: 'talking',
          eyes: 'normal',
          eyebrows: 'neutral'
        };
      case 'winking':
        return {
          mouth: 'smile',
          eyes: 'winking',
          eyebrows: 'playful'
        };
      case 'sad':
        return {
          mouth: 'frown',
          eyes: 'sad',
          eyebrows: 'sad'
        };
      default:
        return {
          mouth: 'neutral',
          eyes: 'normal',
          eyebrows: 'neutral'
        };
    }
  };

  // Pose configurations
  const getPoseTransform = (pose: AvatarPose) => {
    switch (pose) {
      case 'left':
        return 'rotateY(-15deg) rotateZ(3deg)';
      case 'right':
        return 'rotateY(15deg) rotateZ(-3deg)';
      case 'nodding':
        return 'rotateX(-10deg)';
      case 'shaking':
        return 'rotateY(-10deg)';
      default:
        return 'rotateY(0deg) rotateZ(0deg) rotateX(0deg)';
    }
  };

  const expressionStyles = getExpressionStyles(avatarState.expression);

  return (
    <div className={`headshot-container ${className}`}>
      <motion.div
        className="avatar-head"
        style={{
          width: currentSize.width,
          height: currentSize.height,
          transform: getPoseTransform(avatarState.pose),
          transformStyle: 'preserve-3d'
        }}
        animate={{
          scale: avatarState.mood === 'excited' ? [1, 1.05, 1] : currentSize.scale,
          rotateZ: avatarState.pose === 'shaking' ? [-5, 5, -5, 5, 0] : 0,
          rotateX: avatarState.pose === 'nodding' ? [-10, 0, -10, 0] : 0
        }}
        transition={{
          duration: avatarState.isAnimating ? 0.3 : 2,
          repeat: avatarState.mood === 'excited' && isBreathing ? Infinity : 0,
          repeatType: 'reverse'
        }}
      >
        {/* Avatar Base - Using CSS to create a stylized head */}
        <div className="avatar-base relative bg-gradient-to-b from-pink-200 to-pink-300 rounded-full border-4 border-pink-400 shadow-lg">
          
          {/* Eyes */}
          <div className="eyes-container absolute top-1/3 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <motion.div
              className={`eye ${expressionStyles.eyes === 'wide' ? 'w-8 h-8' : 'w-6 h-6'} bg-white rounded-full border-2 border-gray-800 flex items-center justify-center`}
              animate={{
                scaleY: isBlinking || expressionStyles.eyes === 'winking' ? 0.1 : 1,
                scaleX: expressionStyles.eyes === 'focused' ? 0.8 : 1
              }}
              transition={{ duration: 0.1 }}
            >
              <div className={`pupil ${expressionStyles.eyes === 'wide' ? 'w-4 h-4' : 'w-3 h-3'} bg-black rounded-full`} />
            </motion.div>
            
            <motion.div
              className={`eye ${expressionStyles.eyes === 'wide' ? 'w-8 h-8' : 'w-6 h-6'} bg-white rounded-full border-2 border-gray-800 flex items-center justify-center`}
              animate={{
                scaleY: isBlinking ? 0.1 : expressionStyles.eyes === 'winking' ? 0.1 : 1,
                scaleX: expressionStyles.eyes === 'focused' ? 0.8 : 1
              }}
              transition={{ duration: 0.1 }}
            >
              <div className={`pupil ${expressionStyles.eyes === 'wide' ? 'w-4 h-4' : 'w-3 h-3'} bg-black rounded-full`} />
            </motion.div>
          </div>

          {/* Eyebrows */}
          <div className="eyebrows-container absolute top-1/4 left-1/2 transform -translate-x-1/2 flex space-x-6">
            <motion.div
              className="eyebrow w-6 h-1 bg-gray-700 rounded"
              animate={{
                rotateZ: expressionStyles.eyebrows === 'raised' ? -10 : expressionStyles.eyebrows === 'furrowed' ? 10 : 0,
                y: expressionStyles.eyebrows === 'raised' ? -2 : expressionStyles.eyebrows === 'furrowed' ? 2 : 0
              }}
            />
            <motion.div
              className="eyebrow w-6 h-1 bg-gray-700 rounded"
              animate={{
                rotateZ: expressionStyles.eyebrows === 'raised' ? 10 : expressionStyles.eyebrows === 'furrowed' ? -10 : 0,
                y: expressionStyles.eyebrows === 'raised' ? -2 : expressionStyles.eyebrows === 'furrowed' ? 2 : 0
              }}
            />
          </div>

          {/* Mouth */}
          <motion.div
            className="mouth absolute bottom-1/3 left-1/2 transform -translate-x-1/2"
            animate={{
              scaleX: expressionStyles.mouth === 'smile' ? 1.3 : expressionStyles.mouth === 'talking' ? [1, 1.2, 1] : 1,
              scaleY: expressionStyles.mouth === 'open' ? 1.5 : expressionStyles.mouth === 'talking' ? [1, 0.8, 1] : 1,
              rotateZ: expressionStyles.mouth === 'smile' ? 0 : expressionStyles.mouth === 'frown' ? 180 : 0
            }}
            transition={{
              repeat: expressionStyles.mouth === 'talking' ? Infinity : 0,
              duration: expressionStyles.mouth === 'talking' ? 0.3 : 0.5
            }}
          >
            <div className={`
              ${expressionStyles.mouth === 'smile' || expressionStyles.mouth === 'frown' ? 'w-8 h-2 border-2 border-gray-800 border-t-0 rounded-b-full' : ''}
              ${expressionStyles.mouth === 'open' ? 'w-4 h-6 bg-gray-800 rounded-full' : ''}
              ${expressionStyles.mouth === 'neutral' ? 'w-6 h-1 bg-gray-800 rounded' : ''}
              ${expressionStyles.mouth === 'talking' ? 'w-6 h-4 bg-gray-800 rounded-full' : ''}
            `} />
          </motion.div>

          {/* Mood indicator (subtle glow) */}
          <motion.div
            className="mood-glow absolute inset-0 rounded-full pointer-events-none"
            animate={{
              boxShadow: 
                avatarState.mood === 'excited' ? '0 0 20px rgba(255, 215, 0, 0.5)' :
                avatarState.mood === 'focused' ? '0 0 15px rgba(59, 130, 246, 0.3)' :
                avatarState.mood === 'sleepy' ? '0 0 10px rgba(139, 69, 19, 0.2)' :
                '0 0 5px rgba(0, 0, 0, 0.1)'
            }}
            transition={{ duration: 1 }}
          />
        </div>
      </motion.div>

      {/* Avatar Status Indicator */}
      <div className="avatar-status mt-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <div className={`w-2 h-2 rounded-full ${avatarState.isAnimating ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="capitalize">{avatarState.expression}</span>
          <span>•</span>
          <span className="capitalize">{avatarState.mood}</span>
        </div>
      </div>

      <style jsx>{`
        .headshot-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
        }
        
        .avatar-head {
          transition: transform 0.3s ease;
        }
        
        .avatar-base {
          width: 100%;
          height: 100%;
          position: relative;
          background: linear-gradient(145deg, #fce7f3, #f3e8ff);
          box-shadow: 
            0 10px 25px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        .avatar-base::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #ec4899, #8b5cf6, #06b6d4, #ec4899);
          border-radius: inherit;
          z-index: -1;
          background-size: 400% 400%;
          animation: ${avatarState.mood === 'excited' ? 'rainbow 2s ease infinite' : 'none'};
        }

        @keyframes rainbow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Headshot;
