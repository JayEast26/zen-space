// app/zen/timer.jsx
import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function MeditationTimer() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Use useRef for animation values
  const progressAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isRunning) {
      progressAnim.setValue(1);
      return;
    }

    let timer;
    let pulseAnimation;

    // Simple pulse animation
    pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      ])
    );
    pulseAnimation.start();

    // Progress animation - simplified
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: timeLeft * 1000,
      easing: Easing.linear,
      useNativeDriver: false, // Keep as false for width animation
    }).start();

    timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsComplete(true);
          // Simple completion animation
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.delay(1000),
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            })
          ]).start();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsComplete(false);
    setTimeLeft(300);
    progressAnim.setValue(1);
    pulseAnim.setValue(1);
    fadeAnim.setValue(0);
  };

  const startTimer = () => {
    if (isComplete) {
      resetTimer();
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  // Safe progress interpolation
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.7]
  });

  const getTimerColor = () => {
    if (isComplete) return '#48bb78';
    if (isRunning) return '#667eea';
    return '#a0aec0';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meditation Timer</Text>
        <Text style={styles.subtitle}>Find your inner peace</Text>
      </View>
      
      <View style={styles.timerContainer}>
        <Animated.View style={[styles.circleProgress, { 
          transform: [{ scale: pulseAnim }],
          borderColor: getTimerColor()
        }]}>
          <Text style={[styles.timerText, { color: getTimerColor() }]}>
            {formatTime(timeLeft)}
          </Text>
          <Text style={styles.timerLabel}>
            {isRunning ? 'Meditating...' : isComplete ? 'Complete!' : 'Ready'}
          </Text>
        </Animated.View>

        {/* Simple progress bar */}
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, { 
            width: progressWidth 
          }]} />
        </View>

        {/* Completion message */}
        <Animated.View style={[styles.completionContainer, { opacity: fadeAnim }]}>
          <Text style={styles.completeText}>🎉 Session Complete!</Text>
        </Animated.View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          onPress={isRunning ? pauseTimer : startTimer}
          style={[styles.button, styles.primaryButton, { backgroundColor: getTimerColor() }]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Pause' : isComplete ? 'Restart' : 'Begin Session'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={resetTimer}
          style={[styles.button, styles.secondaryButton]}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.presetContainer}>
        <Text style={styles.presetTitle}>Quick Sessions</Text>
        <View style={styles.presetButtons}>
          {[1, 5, 10, 15, 20].map(minutes => (
            <TouchableOpacity
              key={minutes}
              onPress={() => {
                setTimeLeft(minutes * 60);
                setIsRunning(false);
                setIsComplete(false);
                progressAnim.setValue(1);
              }}
              style={[
                styles.presetButton,
                timeLeft === minutes * 60 && { backgroundColor: getTimerColor() }
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.presetText,
                timeLeft === minutes * 60 && { color: 'white' }
              ]}>
                {minutes} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Simple stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{Math.floor(timeLeft / 60)}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{timeLeft % 60}</Text>
          <Text style={styles.statLabel}>Seconds</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{isRunning ? '🔴' : '⚪'}</Text>
          <Text style={styles.statLabel}>Status</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#2d3748',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginTop: 8,
    fontWeight: '300',
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  circleProgress: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timerText: {
    fontSize: 42,
    fontWeight: '200',
    letterSpacing: 1,
  },
  timerLabel: {
    fontSize: 14,
    color: '#a0aec0',
    marginTop: 8,
    fontWeight: '300',
  },
  progressContainer: {
    width: width * 0.7,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 3,
  },
  completionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  completeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#48bb78',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 30,
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#667eea',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#718096',
  },
  presetContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  presetTitle: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 15,
    fontWeight: '500',
  },
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  presetButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  presetText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#667eea',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '300',
  },
});