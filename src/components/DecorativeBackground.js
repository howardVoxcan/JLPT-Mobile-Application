import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export const DecorativeBackground = () => {
  return (
    <View style={styles.container}>
      <View style={styles.decorativeGroup}>
        <View style={styles.ellipsePink} />
        <View style={styles.ellipseMint} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    overflow: 'hidden',
  },
  decorativeGroup: {
    position: 'absolute',
    width: 295,
    height: 274,
    right: -50,
    top: -80,
  },
  ellipsePink: {
    position: 'absolute',
    left: '32.2%',
    right: 0,
    top: '27.01%',
    bottom: 0,
    backgroundColor: Colors.decorativePink,
    borderRadius: 200,
  },
  ellipseMint: {
    position: 'absolute',
    left: 0,
    right: '32.2%',
    top: 0,
    bottom: '27.01%',
    backgroundColor: Colors.decorativeMint,
    borderRadius: 200,
  },
});

