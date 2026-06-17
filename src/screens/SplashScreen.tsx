import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Platform } from 'react-native';

const native = Platform.OS !== 'web';

type Props = {
  onDone: () => void;
};

export default function SplashScreen({ onDone }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in logo
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: native,
    }).start();

    // After 3s, fade out and call onDone
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: native,
      }).start(() => onDone());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity }}>
        {/* Replace this View+Text with <Image> once you have your logo asset */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>$</Text>
        </View>
        <Text style={styles.appName}>Triple T</Text>
        <Text style={styles.tagline}>Track. Think. Thrive.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00C853',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#ffffff22',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 52,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
    color: '#ffffffaa',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 1,
  },
});
