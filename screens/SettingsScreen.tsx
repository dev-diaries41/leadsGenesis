import {StyleSheet,View, SafeAreaView,ScrollView} from 'react-native';
import React, { useEffect, useLayoutEffect } from 'react'
import * as SystemUI from 'expo-system-ui';;
import { themes, sizes } from '../constants/layout';
import { useSettingsContext } from '../context/SettingsContext';
import * as SecureStore from 'expo-secure-store';
import SettingsCard from '../components/SettingsCard';


const SettingsScreen = ({navigation}: any) => {
  const { theme, setTheme, defaultMessage, defaultSubject } = useSettingsContext();
  
  //Screen constants
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';
  const dark = theme === DARK_THEME;

    // useLayoutEffect hook to set the header background color and tint color when the component mounts
    useLayoutEffect(()=>{
      navigation.setOptions({
        headerStyle: { backgroundColor: theme ==='dark'? themes.dark.containerBackground : themes.light.containerBackground },
        headerTitleStyle: { color: theme ==='dark'? themes.dark.textColor : themes.light.textColor},
        headerTintColor: theme ==='dark'? themes.dark.textColor : themes.light.textColor,
      });
    }, [theme] )

  // Function to change to toggle between light and dark theme
  const chooseTheme = (theme: string) => {
    try {
      setTheme(theme);
      SystemUI.setBackgroundColorAsync(dark? themes.dark.backgroundColor : themes.light.backgroundColor )

    } 
    catch(error: any){
      console.log("Choosing theme:", error.message)
    }
  }

  //useEffect hook to save settings any time they change
  useEffect(() => {
  // Save settings whenever they change
  saveSettings();
}, [theme, defaultMessage, defaultSubject]);


//Function to save settings
const saveSettings = async () => {
  try {
    const settings = {
      theme,
      defaultMessage,
      defaultSubject
    }
    await SecureStore.setItemAsync('settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

  //Function to navigate to the update settings screen and change theme
  const toggleTheme = () => {
    if(dark){
      chooseTheme(LIGHT_THEME)
    }else{
      chooseTheme(DARK_THEME)
    }
  }

  const handleDefaultMessage = () => {
    navigation.navigate('Update Settings', { changingDefaultMessage: true});
  } 

  const handleDefaultSubject = () => {
    navigation.navigate('Update Settings', { changingDefaultSubject: true});
  } 

  
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: dark? themes.dark.backgroundColor : themes.light.backgroundColor}]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View
          style={[styles.settingsContainer, {backgroundColor: dark? themes.dark.containerBackground : themes.light.containerBackground}]}
          >          
          <SettingsCard
            onPress={handleDefaultMessage}
            dark={dark}
            settingDescription={'Set your default message to use for outreach emails to leads.'}
            settingTitle={'Default Message'}
          />
          <View style={[styles.divider]} />
          <SettingsCard
            onPress={handleDefaultSubject}
            dark={dark}
            settingDescription={'Set your default subject to use for outreach emails to leads.'}
            settingTitle={'Default Subject'}
          />
          <View style={[styles.divider]} />
          <SettingsCard
            onPress={toggleTheme}
            dark={dark}
            settingDescription={'Toggle between light and dark theme. The default is dark.'}
            settingTitle={'Dark Theme'}
            value={dark}
            isSwitch={true}
          />   
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    paddingVertical: sizes.layout.medium,
    paddingHorizontal:sizes.layout.small,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsContainer: {
    backgroundColor:themes.dark.containerBackground,
    borderRadius:sizes.layout.medium,
    width:"100%",
    marginTop:sizes.layout.medium,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: themes.borderColor,
    marginHorizontal: sizes.layout.small,
  },
});

export default SettingsScreen;

