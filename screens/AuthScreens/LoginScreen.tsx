import {StyleSheet, Text, View, ScrollView } from 'react-native';
import React, {  useState } from 'react'
import { useSettingsContext } from '../../context/SettingsContext';
import { Button, Spacer, TextButton, InputField } from '../../components';
import { themes, sizes } from '../../constants/layout';

const LoginScreen = ({navigation}: any) => {

    const { theme} = useSettingsContext();
    const isDark = theme === "dark";
  
    //State variables
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
      email: '',
      password: '',
    });
    const [inputErrors, setInputErrors] = useState({
      email: '',
      password: '',
    });
    
    const resetState = () => {
      setInputErrors({
        email: '',
        password: '',
      });
      setUser({
        email: '',
        password: '',
      });
    };

  const handleLoginError = (error: any) => {
    console.error('Error retrieving user role:', error);
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      if(user.email && user.password){
        resetState()
        navigation.navigate('Home')
      }else{
        handleInputError()
      }
    }
    catch (error) {
       handleLoginError(error)
    }
    finally{
      setLoading(false)
    }
  };
  
  //Function to navigate to the register screen
  const handleCreateAccount = () => {
    navigation.navigate('Create Account');
  };

  //Function to navigate to the forghot password screen
  const handleForgotPassword = () => {
    navigation.navigate('Forgot Password');
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
  
  const handleInputError = () => {
    setInputErrors({
      email: !user.email ? "Please enter a valid email address" : '',
      password: !user.password ? "Please enter a valid password" : '',
    });
  };


  return (
    <ScrollView
    contentContainerStyle={[styles.container, {backgroundColor:isDark? themes.dark.backgroundColor : themes.light.backgroundColor}]}      
    >
    <Text style={[styles.header, {color:isDark? themes.dark.textColor : themes.light.textColor}]}>Login</Text>
    <Spacer marginBottom={32}/>
      <View style={styles.inputContainer}>
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
          placeholder="Enter Password"
          color={isDark? themes.dark.textColor : themes.light.textColor }                  
        /> 
       <Button
        text={'Login'}
        icon={'enter-outline'}
        width='100%'
        onPress={handleLogin}
        backgroundColor= {themes.light.primaryColor}
       />
      </View>
      <Spacer/>
      <View style={styles.rowContainer}>
        <Text style={[styles.RegisterText, {color:isDark? themes.dark.textColor : themes.light.textColor}]}>Don't have an account?</Text>
        <TextButton
          onPress={handleCreateAccount}
          buttonText={'Create account'}
          color={themes.light.primaryColor}
          margin={0}
        />
      </View>
      <Spacer/>
      <View style={styles.rowContainer}>
      <TextButton
          onPress={handleForgotPassword}
          buttonText={'Forgotten password?'}
          color={themes.light.primaryColor}
          margin={0}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: sizes.layout.medium
  },
  inputContainer: {
    width: '100%',
    backgroundColor:"transparent",
    gap:10
  },
  input: {
    backgroundColor: 'transparent',
    padding: sizes.layout.small,
    borderRadius: sizes.layout.medSmall,
    borderColor:themes.light.borderColor,
    borderWidth:1,
    color: themes.light.textColor,
    fontFamily:'monserrat-regular'  
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  RegisterText: {
    marginRight: sizes.layout.xSmall,
    fontSize: sizes.font.medium,
    color: themes.light.textColor,
    fontFamily:'monserrat-regular',  
  },
  header:{
    fontSize :sizes.font.xLarge,
    color:themes.light.textColor,
    marginBottom:sizes.layout.medium,
    fontFamily:'monserrat-bold'  
  }
});

export default LoginScreen;


