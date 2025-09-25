// app/zen/pomodoro.jsx
import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions, Vibration } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  // Use useRef for animation values to prevent recreation on re-render
  const progressAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sessionSwitchAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  const workTime = 25 * 60;
  const shortBreakTime = 5 * 60;
  const longBreakTime = 15 * 60;

  // Pre-calculate interpolations
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Create a separate interpolation for the second shape
  const rotateInterpolate2 = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '540deg']
  });

  const sessionSwitchOpacity = sessionSwitchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  });

  useEffect(() => {
    if (!isRunning) {
      progressAnim.setValue(1);
      return;
    }

    let animationHandles = [];

    // Background rotation animation - use native driver for transform
    const rotationAnimation = Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 30000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotationAnimation.start();
    animationHandles.push(rotationAnimation);

    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      ])
    );
    pulseAnimation.start();
    animationHandles.push(pulseAnimation);

    // Progress animation - can't use native driver for width changes
    const progressAnimation = Animated.timing(progressAnim, {
      toValue: 0,
      duration: timeLeft * 1000,
      easing: Easing.linear,
      useNativeDriver: false, // Must be false for layout properties
    });
    progressAnimation.start();
    animationHandles.push(progressAnimation);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          Vibration.vibrate(500);
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      animationHandles.forEach(animation => animation.stop());
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    // Session switch animation
    Animated.sequence([
      Animated.timing(sessionSwitchAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(sessionSwitchAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      })
    ]).start();

    if (sessionType === 'work') {
      setSessionsCompleted(prev => prev + 1);
      
      if ((sessionsCompleted + 1) % 4 === 0) {
        setSessionType('longBreak');
        setTimeLeft(longBreakTime);
      } else {
        setSessionType('break');
        setTimeLeft(shortBreakTime);
      }
    } else {
      setSessionType('work');
      setTimeLeft(workTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSessionType('work');
    setTimeLeft(workTime);
    setSessionsCompleted(0);
    progressAnim.setValue(1);
    pulseAnim.setValue(1);
    rotationAnim.setValue(0);
    sessionSwitchAnim.setValue(0);
  };

  const skipSession = () => {
    Vibration.vibrate(100);
    handleSessionComplete();
  };

  const getSessionColor = () => {
    switch(sessionType) {
      case 'work': return '#f56565';
      case 'break': return '#48bb78';
      case 'longBreak': return '#667eea';
      default: return '#a0aec0';
    }
  };

  const getSessionTitle = () => {
    switch(sessionType) {
      case 'work': return 'Focus Time';
      case 'break': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Pomodoro Timer';
    }
  };

  const getSessionDescription = () => {
    switch(sessionType) {
      case 'work': return 'Stay focused and avoid distractions';
      case 'break': return 'Relax and recharge';
      case 'longBreak': return 'Take a well-deserved longer break';
      default: return 'Time to be productive!';
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <Animated.View style={[styles.bgShape1, { 
        transform: [{ rotate: rotateInterpolate }],
        backgroundColor: getSessionColor() + '15'
      }]} />
      <Animated.View style={[styles.bgShape2, { 
        transform: [{ rotate: rotateInterpolate2 }],
        backgroundColor: getSessionColor() + '10'
      }]} />

      <View style={styles.header}>
        <Text style={styles.title}>Pomodoro Timer</Text>
        <Text style={styles.subtitle}>Work smart, not just hard</Text>
      </View>

      <Animated.View style={[styles.sessionInfo, { opacity: sessionSwitchOpacity }]}>
        <Text style={[styles.sessionTitle, { color: getSessionColor() }]}>
          {getSessionTitle()}
        </Text>
        <Text style={styles.sessionDescription}>
          {getSessionDescription()}
        </Text>
        
        <View style={styles.sessionsCounter}>
          <Text style={styles.sessionsText}>
            Sessions Completed: {sessionsCompleted}
          </Text>
          <View style={styles.sessionDots}>
            {[1, 2, 3, 4].map(dot => (
              <View 
                key={dot}
                style={[
                  styles.sessionDot,
                  { 
                    backgroundColor: dot <= (sessionsCompleted % 4) ? getSessionColor() : '#e2e8f0',
                    opacity: dot === (sessionsCompleted % 4) && sessionType === 'work' ? 1 : 0.7
                  }
                ]}
              />
            ))}
          </View>
        </View>
      </Animated.View>

      <View style={styles.timerContainer}>
        <Animated.View style={[styles.timerCircle, { 
          transform: [{ scale: pulseAnim }],
          borderColor: getSessionColor()
        }]}>
          <Text style={[styles.timerText, { color: getSessionColor() }]}>
            {formatTime(timeLeft)}
          </Text>
          <Text style={styles.timerLabel}>
            {isRunning ? (sessionType === 'work' ? 'Focusing...' : 'Breaking...') : 'Ready'}
          </Text>
        </Animated.View>

        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, { 
            width: progressWidth,
            backgroundColor: getSessionColor()
          }]} />
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          onPress={() => setIsRunning(!isRunning)}
          style={[styles.button, styles.primaryButton, { backgroundColor: getSessionColor() }]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={skipSession}
          style={[styles.button, styles.secondaryButton]}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Skip</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={resetTimer}
          style={[styles.button, styles.tertiaryButton]}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, styles.tertiaryButtonText]}>Reset</Text>
        </TouchableOpacity>
      </View>

      
    </View>
  );
}

// Your styles remain the same
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  bgShape1: {
    position: 'absolute',
    top: -width * 0.2,
    right: -width * 0.1,
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
  },
  bgShape2: {
    position: 'absolute',
    bottom: -width * 0.3,
    left: -width * 0.1,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2d3748',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginTop: 8,
    fontWeight: '300',
  },
  sessionInfo: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  sessionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 5,
  },
  sessionDescription: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 15,
  },
  sessionsCounter: {
    alignItems: 'center',
  },
  sessionsText: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 10,
  },
  sessionDots: {
    flexDirection: 'row',
    gap: 8,
  },
  sessionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: 'all 0.3s ease',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  timerText: {
    fontSize: 42,
    fontWeight: '200',
    letterSpacing: 2,
  },
  timerLabel: {
    fontSize: 14,
    color: '#a0aec0',
    marginTop: 5,
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
    borderRadius: 3,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: '#f56565',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#718096',
  },
  tertiaryButtonText: {
    color: '#a0aec0',
  },
  presetContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  presetTitle: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 15,
    fontWeight: '500',
  },
  presetButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  presetButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 2,
    minWidth: 100,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '300',
  },
});