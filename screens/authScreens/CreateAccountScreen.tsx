import {StyleSheet, SafeAreaView, Text, TextInput, View, ScrollView } from 'react-native';
import React, { useState} from 'react'
import { useSettingsContext } from '../../context/SettingsContext';
import { Button, Spacer, InputField } from '../../components';
import { themes, sizes } from '../../constants/layout';

const CreateAccountScreen = ({route, navigation}: any) => {

  //Screen constants
  const { theme} = useSettingsContext();
  const isDark = theme === "dark";

  //State variables
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [inputErrors, setInputErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    passwordDoNotMatch: '',
  });
  
  const [loading, setLoading] = useState(false);


  const handleFirstNameChange = (text: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      firstName: text,
    }));
  };
  
  const handleLastNameChange = (text: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      lastName: text,
    }));
  };
  
  const handleEmailChange = (text: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      email: text,
    }));
  };
  
  const handlePasswordChange = (text: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      password: text,
    }));
  };
  
  const handleConfirmPasswordChange = (text: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      confirmPassword: text,
    }));
  };
  

  const handleInputError = () => {
    setInputErrors({
      firstName: !user.firstName ? "Please enter your first name" : '',
      lastName: !user.lastName ? "Please enter your last name" : '',
      email: !user.email ? "Please enter a valid email address" : '',
      password: !user.password ? "Please enter a valid password" : '',
      confirmPassword: !user.confirmPassword ? "Please confirm your password" : '',
      passwordDoNotMatch: user.password !== user.confirmPassword ? "This does not match your password" : '',
    });
  };
  
  
  const resetState = () => {
    setInputErrors({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      passwordDoNotMatch: '',
    });
    setUser({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };
  
  
  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      if(user.firstName && user.lastName && user.email && user.password && user.confirmPassword && user.password === user.confirmPassword){
        resetState();
        navigation.navigate('Home');
      }else{
        handleInputError();
      }
    } 
    catch (error) {
      console.error(error);
    }
    finally{
      setLoading(false);
    }
  };
 
  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView
        contentContainerStyle={[styles.container,{backgroundColor:isDark? themes.dark.backgroundColor : themes.light.backgroundColor}]}      
      >
      <Text style={[styles.HeaderText, {color:isDark? themes.dark.textColor : themes.light.textColor}]}>Create Account</Text>
      <Text style={[styles.label, {color:isDark? themes.dark.textColor : themes.light.textColor}]}>Enter your personal information</Text>
      <Spacer marginBottom={32}/>
      <View style={styles.inputContainer}>
        <InputField
          value={user.firstName}
          onChangeText={handleFirstNameChange}
          error={!!(!user.firstName && inputErrors.firstName)}
          errorText={inputErrors.firstName}
          placeholder="First Name"
          color={isDark? themes.dark.textColor : themes.light.textColor }                  
        />      
        <InputField
          value={user.lastName}
          onChangeText={handleLastNameChange}
          error={!!(!user.lastName && inputErrors.lastName)}
          errorText={inputErrors.lastName}
          placeholder="Last Name"
          color={isDark? themes.dark.textColor : themes.light.textColor }                  
        />    
        <InputField
          value={user.email}
          onChangeText={handleEmailChange}
          error={!!(!user.email && inputErrors.email)}
          errorText={inputErrors.email}
          placeholder="Email Address"
          color={isDark? themes.dark.textColor : themes.light.textColor }                  
        />    
        <InputField
          value={user.password}
          onChangeText={handlePasswordChange}
          error={!!(!user.password && inputErrors.password)}
          errorText={inputErrors.password}
          placeholder="Enter Password (Minimum 6 characters)"
          secureTextEntry={true}
          color={isDark? themes.dark.textColor : themes.light.textColor }                  
        />    
         <InputField
          value={user.confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          error={!!(!user.confirmPassword && inputErrors.confirmPassword) || !!(user.confirmPassword && inputErrors.passwordDoNotMatch)}
          errorText={user.confirmPassword && inputErrors.passwordDoNotMatch? inputErrors.passwordDoNotMatch : inputErrors.confirmPassword}
          placeholder="Confirm Password"
          secureTextEntry={true} 
          color={isDark? themes.dark.textColor : themes.light.textColor }                         
        />    
        <Button
          text={'Create Account'}
          icon={'person-outline'}
          width='100%'
          onPress={handleCreateAccount}
          backgroundColor= {themes.light.primaryColor}
          loading={loading}
        />
      </View>
      </ScrollView>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  inputContainer: {
    width: '100%',
    gap:sizes.layout.small
  },
  HeaderText:{
    fontSize :sizes.font.xLarge,
    color:"#000",
    marginBottom:sizes.layout.medium,
    fontWeight:"bold"
  },
  label: {
    fontSize: sizes.font.small,
    color: themes.dark.textColor,
    fontFamily:'monserrat-regular'  
  },
});


export default CreateAccountScreen;
