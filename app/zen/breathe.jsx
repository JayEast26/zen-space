import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

export default function Breathe() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [counter, setCounter] = useState(4);
  
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    if (!isActive) return;

    const animateBreathing = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
      ]).start();
    };

    animateBreathing();

    const timer = setInterval(() => {
      setCounter(prev => {
        if (prev <= 1) {
          setPhase(prevPhase => {
            if (prevPhase === 'inhale') return 'hold';
            if (prevPhase === 'hold') return 'exhale';
            return 'inhale';
          });
          return phase === 'inhale' ? 7 : phase === 'hold' ? 8 : 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  const getInstruction = () => {
    switch(phase) {
      case 'inhale': return 'Breathe In...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
      default: return 'Begin...';
    }
  };

  const getPhaseColor = () => {
    switch(phase) {
      case 'inhale': return '#8da676';
      case 'hold': return '#4a90e2';
      case 'exhale': return '#e74c3c';
      default: return '#8da676';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Breathing Exercise</Text>
        <Text style={styles.technique}>4-7-8 Breathing Technique</Text>
      </View>
      
      <View style={styles.animationContainer}>
        <Animated.View 
          style={[
            styles.circle,
            { 
              transform: [{ scale: scaleAnim }],
              backgroundColor: getPhaseColor()
            }
          ]}
        >
          <Text style={styles.counter}>{counter}</Text>
          <Text style={styles.phaseText}>{getInstruction()}</Text>
        </Animated.View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          onPress={() => setIsActive(!isActive)}
          style={[styles.controlButton, { backgroundColor: getPhaseColor() }]}
        >
          <Text style={styles.controlButtonText}>
            {isActive ? '⏸️ Pause' : '▶️ Begin'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => {
            setIsActive(false);
            setPhase('inhale');
            setCounter(4);
            scaleAnim.setValue(1);
          }}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>How to practice:</Text>
        <Text style={styles.instruction}>• Inhale through your nose for 4 seconds</Text>
        <Text style={styles.instruction}>• Hold your breath for 7 seconds</Text>
        <Text style={styles.instruction}>• Exhale slowly for 8 seconds</Text>
        <Text style={styles.instruction}>• Repeat 4-5 times</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8faf9",
    paddingHorizontal: 20
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 8, 
    color: "#2e3b4e",
  },
  technique: {
    fontSize: 16,
    color: "#7a869a",
    textAlign: "center",
  },
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  counter: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  phaseText: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  controls: {
    paddingBottom: 40,
    alignItems: "center",
    gap: 15,
  },
  controlButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 150,
    alignItems: "center",
  },
  controlButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  secondaryButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  instructions: {
    paddingBottom: 30,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e3b4e",
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    color: "#7a869a",
    marginBottom: 5,
  },
});