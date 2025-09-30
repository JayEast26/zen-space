// app/zen/breathe.jsx
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';

export default function Breathe() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [counter, setCounter] = useState(4);
  
  // Animation values
  const scaleAnim = new Animated.Value(1);
  const opacityAnim = new Animated.Value(1);
  const colorAnim = new Animated.Value(0);

  // Enhanced color interpolation
  const circleColor = colorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#667eea', '#f093fb', '#f5576c']
  });

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#f8fafc', '#fdfbfb', '#f8fafc']
  });

  useEffect(() => {
    if (!isActive) return;

    const animateBreathing = () => {
      let targetScale, targetColor, duration;
      
      switch(phase) {
        case 'inhale':
          targetScale = 1.6;
          targetColor = 0;
          duration = 4000;
          break;
        case 'hold':
          targetScale = 1.6;
          targetColor = 1;
          duration = 7000;
          break;
        case 'exhale':
          targetScale = 0.7;
          targetColor = 2;
          duration = 8000;
          break;
        default:
          targetScale = 1;
          targetColor = 0;
          duration = 1000;
      }

      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: targetScale,
          duration: duration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(colorAnim, {
          toValue: targetColor,
          duration: duration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: duration / 2,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: duration / 2,
            easing: Easing.ease,
            useNativeDriver: true,
          })
        ])
      ]).start();
    };

    animateBreathing();

    const timer = setInterval(() => {
      setCounter(prev => {
        if (prev <= 1) {
          setPhase(prevPhase => {
            const nextPhase = prevPhase === 'inhale' ? 'hold' : prevPhase === 'hold' ? 'exhale' : 'inhale';
            return nextPhase;
          });
          return phase === 'inhale' ? 7 : phase === 'hold' ? 8 : 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, scaleAnim, opacityAnim, colorAnim]);

  const getInstruction = () => {
    switch(phase) {
      case 'inhale': return 'Breathe In Peace...';
      case 'hold': return 'Hold Stillness...';
      case 'exhale': return 'Release Tension...';
      default: return 'Begin Journey...';
    }
  };

  const getPhaseColor = () => {
    switch(phase) {
      case 'inhale': return '#667eea';
      case 'hold': return '#f093fb';
      case 'exhale': return '#f5576c';
      default: return '#667eea';
    }
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Breathing Exercise</Text>
        <Text style={styles.subtitle}>Find your center</Text>
      </View>
      
      <View style={styles.animationContainer}>
        <Animated.Text 
          style={[
            styles.instruction,
            { 
              color: getPhaseColor(),
              opacity: opacityAnim,
              textShadowColor: getPhaseColor() + '40',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            }
          ]}
        >
          {getInstruction()}
        </Animated.Text>
        
        <Animated.Text 
          style={[
            styles.counter,
            { 
              transform: [{ scale: opacityAnim }],
              color: getPhaseColor(),
              textShadowColor: getPhaseColor() + '30',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 20,
            }
          ]}
        >
          {counter}
        </Animated.Text>
        
        {/* Enhanced background circles */}
        <View style={styles.circleContainer}>
          {[0, 1, 2].map((index) => (
            <Animated.View 
              key={index}
              style={[
                styles.backgroundCircle,
                { 
                  transform: [{ scale: scaleAnim.interpolate({
                    inputRange: [0.7, 1.6],
                    outputRange: [0.8 + index * 0.1, 1.0 + index * 0.2]
                  }) }],
                  opacity: opacityAnim.interpolate({
                    inputRange: [0.6, 1],
                    outputRange: [0.05 + index * 0.05, 0.1 + index * 0.05]
                  })
                }
              ]} 
            />
          ))}
        </View>

        {/* Enhanced breathing circle */}
        <TouchableOpacity 
          onPress={() => setIsActive(!isActive)}
          activeOpacity={0.9}
        >
          <Animated.View 
            style={[
              styles.circle,
              { 
                transform: [{ scale: scaleAnim }],
                backgroundColor: circleColor,
                shadowColor: circleColor,
              }
            ]}
          >
            <Text style={styles.circleText}>
              {isActive ? 'Pause' : 'Begin'}
            </Text>
            <Animated.View 
              style={[
                styles.circleInnerGlow,
                { opacity: opacityAnim.interpolate({
                  inputRange: [0.6, 1],
                  outputRange: [0.3, 0.6]
                })}
              ]} 
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.technique}>4-7-8 Breathing Technique</Text>
        <Text style={styles.description}>
          Inhale for 4s • Hold for 7s • Exhale for 8s
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#1a202c',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginTop: 8,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  instruction: { 
    fontSize: 28,
    fontWeight: '300',
    marginBottom: 30,
    letterSpacing: 1.2,
  },
  counter: {
    fontSize: 84,
    fontWeight: '100',
    marginBottom: 70,
    letterSpacing: 2,
  },
  circleContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundCircle: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#667eea',
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
    overflow: 'hidden',
  },
  circleInnerGlow: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderRadius: 110,
    backgroundColor: 'white',
  },
  circleText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 30,
  },
  technique: {
    fontSize: 20,
    fontWeight: '400',
    color: '#2d3748',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: '#718096',
    fontWeight: '300',
    letterSpacing: 0.3,
  },
});