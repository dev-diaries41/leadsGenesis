import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect} from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AboutScreen from './AboutScreen';
import { Ionicons } from '@expo/vector-icons';
import { themes, sizes } from '../../constants/layout';
import { useSettingsContext } from '../../context/SettingsContext';
import { IconButton } from '../../components';
import LeadNotesScreen from './LeadNotesScreen';

const Tab = createMaterialTopTabNavigator();
const ICON_SIZE = 24

const LeadDetailsScreen = ({navigation, route}: any) => {
    const {theme} = useSettingsContext();
    const isDark = theme === 'dark';

    useLayoutEffect(()=>{
      navigation.setOptions({
        headerStyle: { backgroundColor: isDark? themes.dark.containerBackground : themes.light.containerBackground },
        headerTitleStyle: { color: isDark? themes.dark.textColor : themes.light.textColor},
        headerTintColor: isDark? themes.dark.textColor : themes.light.textColor,
      });
    }, [theme] )

    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <View style={styles.navRowButtons}>
                <IconButton icon={"settings-outline"} onPress={() => navigation.navigate('Settings Screen')} color={isDark? themes.dark.icon:themes.light.icon}/>
            </View>
          ),
        });
      }, [navigation, theme]);

    return (
        <Tab.Navigator
          initialRouteName='About Lead'
          screenOptions={({ route, navigation }) => ({
            tabBarIcon: ({ focused, color }) => {
              let iconName: any;
    
              if (route.name === 'About Lead') {
                iconName = focused
                  ? 'information-circle'
                  : 'information-circle-outline';
              } else if (route.name === 'Lead Notes') {
                iconName = focused ? 'ios-list' : 'list-outline';
              }
    
              return <Ionicons name={iconName} size={ICON_SIZE} color={color} />;
            },
            tabBarLabel: ({ focused, color }) => {
              let label;
    
              if (route.name === 'About Lead') {
                label = 'About';
              } else if (route.name === 'Lead Notes') {
                label = 'Notes'; 
              }
    
              return <Text style={{ color, fontFamily:'monserrat-regular' }}>{label}</Text>;
            },
            tabBarStyle:{
              backgroundColor:isDark ? themes.dark.containerBackground : themes.light.containerBackground,
            },
            tabBarActiveTintColor: themes.secondaryIcon,
            tabBarInactiveTintColor: themes.placeholder,
            tabBarIndicatorStyle: {
              backgroundColor: themes.secondaryIcon,
              height: 2,
            },
          })}
        >
          <Tab.Screen name="About Lead" component={AboutScreen} />
          <Tab.Screen name="Lead Notes" component={LeadNotesScreen} />
        </Tab.Navigator>
      );
    }

export default LeadDetailsScreen

const styles = StyleSheet.create({
    navRowButtons:{
        flexDirection: 'row', 
        justifyContent:"space-evenly",
        alignItems:'center',
        marginRight: sizes.layout.medium,
        gap:sizes.layout.medium
      },
})