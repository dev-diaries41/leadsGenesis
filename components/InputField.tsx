import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { themes, sizes } from '../constants/layout';
import { InputFieldProps } from '../constants/types';


const InputField = ({ 
  value, 
  onChangeText, 
  error, 
  placeholder, 
  secureTextEntry = false, 
  errorText, 
  color,
  multiline = false,
  height,
  label
}: InputFieldProps) => {
  
  const inputStyle = [
    styles.input,
    { color },
    height && { height },
    error && styles.inputError,
  ];
  return (
    <View>
      {error && <Text style={styles.errorText}>{errorText}</Text>}
      {label && <Text style={[styles.label, {color}]}>{label}</Text>}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={inputStyle}
        placeholderTextColor={themes.placeholder}        
        secureTextEntry={secureTextEntry}
        scrollEnabled
        textAlignVertical='top'
        multiline = {multiline}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    input: {
      paddingHorizontal: sizes.layout.medium,
      paddingVertical: sizes.layout.small,
      borderRadius: sizes.layout.medSmall,
      marginBottom:sizes.layout.xSmall,
      borderColor: themes.light.borderColor,
      borderWidth: 1,
      color:themes.light.textColor,
      fontFamily:'monserrat-regular'  
    },
    inputError: {
      borderColor: 'red',
    },
    errorText: {
      color: 'red',
      fontSize: sizes.font.small,
      fontFamily:'monserrat-regular',  
      marginTop: sizes.layout.xSmall,
    },
    label:{
      fontSize: sizes.font.small,
      fontFamily:'monserrat-regular',
      marginBottom: sizes.layout.xSmall,
    }
  });  

export default InputField;
