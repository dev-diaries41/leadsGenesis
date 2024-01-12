import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import * as SystemUI from 'expo-system-ui';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { LeadsProvider } from './context/LeadsContext';
import { SettingsProvider } from './context/SettingsContext';
import { SearchProvider } from './context/SearchContext';
import { sizes, themes } from './constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator} from '@react-navigation/drawer';
import { defaultResultsMetadata, defaultLeadsData, defaultSettings } from './constants/defaultAppConfig';
import HomeScreen from './screens/mainScreens/HomeScreen';
import LeadsScreen from './screens/mainScreens/LeadsScreen';
import SettingsScreen from './screens/SettingsScreen';
import UpdateSettingsScreen from './screens/UpdateSettingsScreen';
import DrawerContent from './components/DrawerContent';
import LeadDetailsScreen from './screens/mainScreens/LeadDetailsScreen';
import CreateAccountScreen from './screens/AuthScreens/CreateAccountScreen';
import ForgotPassword from './screens/AuthScreens/ForgotPassword';
import LoginScreen from './screens/AuthScreens/LoginScreen';
import SignOutScreen from './screens/AuthScreens/SignOut';

const Drawer = createDrawerNavigator();
SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto hiding
SystemUI.setBackgroundColorAsync("transparent")



export default function App() {
  const [fetchedLeads, setFetchedLeads] = useState(defaultLeadsData);
  const [fetchedMetadata, setFetchedMetadata] = useState(defaultResultsMetadata);
  const [appIsReady, setAppIsReady] = useState(false);
  const [userSettings, setUserSettings] = useState(defaultSettings);

//Function to fetch leads from async storage
const fetchLeads = async() => {
  try{
    const storedLeads = await AsyncStorage.getItem('leads');
    if(storedLeads && JSON.parse(storedLeads)?.companiesInfo?.length > 0){
      const leads = JSON.parse(storedLeads);
      setFetchedLeads(leads); 
    }
  }catch(error:any){
    console.error("Error in fetchLeads:", error.message)
  }
}

//Function to fetch results metadata from async storage
const fetchResultsMetadata = async() => {
  try{
    const storedMetadata = await AsyncStorage.getItem('metadata');
    if(storedMetadata){
      const metadata = JSON.parse(storedMetadata);
      setFetchedMetadata(metadata); 
    }else{
      setFetchedMetadata(defaultResultsMetadata);
    }
  }catch(error:any){
    console.error("Error in fetchResultsMetadata:", error.message)
  }
}


//Function to load user settings
const loadSettings = async () => {
  try {
    const storedSettings = await SecureStore.getItemAsync('settings');
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      setUserSettings(parsedSettings);
      
    }
  } catch (error:any) {
    console.error('Error loading settings:', error.message);
  }
};


//useEffect hook to prepare app on start
useEffect(() => {
  async function prepare() {
    try {
      await loadSettings();
      await fetchLeads();
      await fetchResultsMetadata();
        await Font.loadAsync({
          'monserrat-regular': require('./assets/fonts/Montserrat-Regular.otf'),
          'monserrat-semibold': require('./assets/fonts/Montserrat-SemiBold.otf'),
          'monserrat-bold': require('./assets/fonts/Montserrat-Bold.otf'),
        });
    } catch (e) {
      console.warn(e);
    } finally {
      setAppIsReady(true);
    }
  }

  prepare();
}, []);



//Function to set app ready when nav children loaded
const onLayoutRootView = useCallback(async () => {
  if (appIsReady) {
  
    await SplashScreen.hideAsync();
  }
}, [appIsReady]);



if (!appIsReady) {
  return null;
}

const initialConfig = {fetchedLeads, fetchedMetadata};


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme ={DarkTheme} onReady={onLayoutRootView}>
        <SearchProvider>
        <SettingsProvider settings={userSettings!}>
        <LeadsProvider initialConfig={initialConfig}>
          <StatusBar backgroundColor="transparent" barStyle='light-content' translucent />
          <Drawer.Navigator backBehavior={'history'} initialRouteName={'Login'} screenOptions={{headerShown: false, 
          }}
          drawerContent={props => <DrawerContent{...props} />}
          >
          <Drawer.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Create Account" component={CreateAccountScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Forgot Password" component={ForgotPassword} options={{ headerShown: false }} />
          <Drawer.Screen name="Sign Out" component={SignOutScreen} options={{ headerShown: false }} />
          <Drawer.Screen name="Home" component={HomeScreen}      
            options={({ navigation, route }) => ({
                headerTitle: 'Lead Genesis', 
                headerRight: () => (
                  <View style={{ flexDirection: 'row', marginRight: 15 }}>
                  <TouchableOpacity>
                      <Ionicons name="notifications-outline" size={30} color={themes.dark.icon} />
                    </TouchableOpacity>                    
                    <TouchableOpacity  style={{paddingLeft:sizes.layout.medium}}>
                      <Ionicons name="settings-outline" size={30} color={themes.dark.icon} />
                    </TouchableOpacity>
                  </View>
                ),
                headerShown: true, headerTitleStyle: {color: themes.dark.textColor, fontSize: 18,}, headerTintColor: themes.dark.icon,
                headerStyle: {backgroundColor: themes.dark.containerBackground}})}
                /> 
                
            <Drawer.Screen name="Leads" component={LeadsScreen}  options ={{headerShown:true, headerTitle: 'Leads',
              headerTitleStyle: {color: themes.dark.textColor,fontSize:18},headerTintColor: themes.dark.icon,
              headerStyle: {backgroundColor: themes.dark.backgroundColor}}}/> 

            <Drawer.Screen name="Lead Details" component={LeadDetailsScreen} options ={{headerShown:true, headerShadowVisible:false,headerTitle: 'Lead Details',
              headerTitleStyle: {color: themes.dark.textColor,fontSize:18},headerTintColor: themes.dark.icon,
              headerStyle: {backgroundColor: themes.dark.backgroundColor}}}/> 
             
            <Drawer.Screen name="Settings Screen" component={SettingsScreen} options ={{headerShown:true, headerTitle: 'Settings',
              headerTitleStyle: {color: themes.dark.textColor,fontSize:18},headerTintColor: themes.dark.icon,
              headerStyle: {backgroundColor: themes.dark.containerBackground}}}/>
              
            <Drawer.Screen name="Update Settings" component={UpdateSettingsScreen} options ={{headerShown:true,
              headerTitleStyle: {color: themes.dark.textColor,fontSize:18},headerTintColor: themes.dark.icon,
              headerStyle: {backgroundColor: themes.dark.containerBackground}}}/>
          </Drawer.Navigator>
          </LeadsProvider>
          </SettingsProvider>
          </SearchProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
  );
}

