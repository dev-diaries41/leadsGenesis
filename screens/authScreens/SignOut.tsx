import { Text, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import { themes, sizes } from '../../constants/layout';
import { useSettingsContext } from '../../context/SettingsContext';
import { Button, Spacer } from '../../components';

const SignOutScreen = ({navigation}: any) => {
  const {theme} = useSettingsContext();
  const dark = theme === "dark";


  const handleSignOut = () => {
    try{

      navigation.navigate('Login');

    }catch(error: any){
      console.error(error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container,{backgroundColor:dark? themes.dark.backgroundColor : themes.light.backgroundColor}]}>
      <Text style={[styles.confimQuestionText, {color:dark? themes.dark.textColor : themes.light.textColor}]} >Are you sure you want to sign out?</Text>
      <Spacer/>
      <Button
        text={'SIgn Out'}
        icon={'exit-outline'}
        width='100%'
        onPress={handleSignOut}
        backgroundColor={themes.light.primaryColor}
       />
    </SafeAreaView>
  );
};

export default SignOutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal:16
  },

  confimQuestionText:{
    color:themes.dark.textColor,
    fontFamily:'monserrat-regular',
    fontSize: sizes.font.medium,
  }
});
