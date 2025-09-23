// app/zen/timer.jsx
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MeditationTimer() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsComplete(false);
    setTimeLeft(300);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meditation Timer</Text>
      
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        
        {isComplete && (
          <Text style={styles.completeText}>🎉 Session Complete!</Text>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          onPress={() => setIsRunning(!isRunning)}
          style={[styles.button, styles.primaryButton]}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Pause' : isComplete ? 'Restart' : 'Start'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={resetTimer}
          style={[styles.button, styles.secondaryButton]}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.presetContainer}>
        <Text style={styles.presetTitle}>Quick Presets:</Text>
        <View style={styles.presetButtons}>
          {[1, 5, 10, 15].map(minutes => (
            <TouchableOpacity
              key={minutes}
              onPress={() => {
                setTimeLeft(minutes * 60);
                setIsRunning(false);
                setIsComplete(false);
              }}
              style={styles.presetButton}
            >
              <Text style={styles.presetText}>{minutes} min</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f5f7fa' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 40,
    color: '#2e3b4e'
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  timerText: {
    fontSize: 72,
    fontWeight: '200',
    color: '#8da676'
  },
  completeText: {
    fontSize: 18,
    color: '#8da676',
    marginTop: 10
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 40
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25
  },
  primaryButton: {
    backgroundColor: '#8da676'
  },
  secondaryButton: {
    backgroundColor: '#ccc'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  presetContainer: {
    alignItems: 'center'
  },
  presetTitle: {
    fontSize: 16,
    color: '#7a869a',
    marginBottom: 15
  },
  presetButtons: {
    flexDirection: 'row',
    gap: 10
  },
  presetButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 15
  },
  presetText: {
    color: '#8da676',
    fontWeight: '500'
  }
});