import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, TextInput, View } from 'react-native';

const CustomFloatingLabelInput = ({ label, value, onChangeText, secureTextEntry }) => {
  const floatingLabelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => {
    Animated.timing(floatingLabelAnimation, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (!value) {
      Animated.timing(floatingLabelAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  const floatingLabelStyle = {
    top: floatingLabelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -5],
    }),
    fontSize: floatingLabelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 10],
    }),
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.label, floatingLabelStyle]}>{label}</Animated.Text>
      <TextInput
        style={styles.input}
        value={value}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: '100%',
    //alignItems: 'flex-end',
    alignItems: 'flex-start',
    marginVertical: 10
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'grey',
    fontSize: 16,
    width: '100%',
    paddingVertical: 5
  },
  label: {
    position: 'absolute',
  },
});

export default CustomFloatingLabelInput;