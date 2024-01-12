import { SafeAreaView, StyleSheet, View } from 'react-native'
import React, {useLayoutEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import { themes, sizes } from '../constants/layout';
import { useSettingsContext } from '../context/SettingsContext';
import { Button, InfoCard, IconButton } from '../components';

interface EmptyScreenProps {
  title: string; 
  description: string; 
  metadata: string; 
  icon: any 
  metadataIcon: any
}

const EmptyScreen = ({title, description, metadata, icon, metadataIcon}: EmptyScreenProps) => {
    const navigation = useNavigation();
    const {theme} = useSettingsContext();
    const isDark = theme === 'dark';
    
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
    <SafeAreaView style={styles.container}>
        <InfoCard 
          title={title} 
          description={description} 
          metadata={metadata} 
          icon={icon}
          metadataIcon={metadataIcon}   
          backgroundColor={isDark? themes.dark.containerBackground:themes.light.containerBackground}
          highlighterBackground={isDark? themes.dark.primaryColor:themes.light.secondaryBackgroundColor}
          color={isDark? themes.dark.textColor:themes.light.textColor}
        />
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigation.navigate('Home')}
            text={'Go Home'}
            backgroundColor={isDark? themes.dark.primaryColor:themes.light.primaryColor}
            width="100%"
            icon = {'home-outline'}
          />
        </View>
    </SafeAreaView>
  )
}

export {EmptyScreen}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: sizes.layout.small,
    paddingTop: sizes.layout.medium,
  },
    buttonContainer: {
        marginTop: sizes.layout.medium,
      },
      navRowButtons:{
        flexDirection: 'row', 
        justifyContent:"space-evenly",
        alignItems:'center',
        marginRight: sizes.layout.medium,
        gap:sizes.layout.medium
      },
})