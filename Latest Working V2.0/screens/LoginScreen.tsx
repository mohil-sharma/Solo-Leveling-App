import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [animation] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  React.useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        })
      ]).start(() => animate());
    };

    animate();
  }, []);

  const handleSubmit = () => {
    // In a real app, implement actual authentication
    navigation.navigate('Home');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=dark mystical gate with blue magical energy&aspect=9:16' }}
      style={styles.container}
    >
      <Animated.View style={styles.animatedBackground}>
        <LinearGradient
          colors={['rgba(10, 10, 26, 0.95)', 'rgba(11, 22, 34, 0.95)']}
          style={StyleSheet.absoluteFill}
        >
          {Array.from({ length: 20 }).map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.particleEffect,
                {
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: [{
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1000],
                    })
                  }]
                }
              ]}
            />
          ))}

          <View style={styles.content}>
            <MaterialCommunityIcons 
              name="sword-cross" 
              size={80} 
              color="#4d9fff"
              style={styles.logo}
            />
            <Text style={styles.title}>SOLO LEVELING</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Login to Continue' : 'Create Your Account'}
            </Text>

            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={username}
                onChangeText={setUsername}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.5)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <LinearGradient
                colors={['#4d9fff', '#0066cc']}
                style={styles.submitGradient}
              >
                <Text style={styles.submitText}>
                  {isLogin ? 'LOGIN' : 'SIGN UP'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchButton}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchText}>
                {isLogin 
                  ? "Don't have an account? Sign Up" 
                  : "Already have an account? Login"}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedBackground: {
    flex: 1,
  },
  particleEffect: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#4d9fff',
    borderRadius: 1,
    opacity: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    marginBottom: 20,
    shadowColor: "#4d9fff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(77, 159, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(77, 159, 255, 0.3)',
  },
  submitButton: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  submitGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
  },
  switchText: {
    color: '#4d9fff',
    fontSize: 16,
  },
});

export default LoginScreen;