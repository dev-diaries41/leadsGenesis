import React, { useState, useEffect, useLayoutEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, SafeAreaView, StyleSheet, Text, Alert, StatusBar} from 'react-native';
import {useLeadsContext} from '../../context/LeadsContext';
import {useSettingsContext } from '../../context/SettingsContext';
import {themes, sizes } from '../../constants/layout';
import {getLeads} from '../../utils/leadUtils/getLeads';
import {getLeadDescription} from '../../constants/messages';
import {InfoCard, RedDot, IconButton, createFlashMsg, Button, InputField } from '../../components';


const HomeScreen = ({navigation}: any) => {
  const {myLeads, setMyLeads,resultsMetadata, setResultsMetadata} = useLeadsContext();
  const {theme} = useSettingsContext();
  const [queryPostcode, setQueryPostcode] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isPostcodeValid, setIsPostcodeValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newNotification, setNewNotification] = useState('');
  const {showMessage, FlashMessage} = createFlashMsg();
  const isDark = theme === 'dark';


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.navRowButtons}>
         <IconButton icon={"notifications-outline"} onPress={handleNotificationPress} color={isDark? themes.dark.icon:themes.light.icon}/>
          {newNotification && <RedDot />}
          <IconButton icon={"settings-outline"} onPress={() => navigation.navigate('Settings Screen')} color={isDark? themes.dark.icon:themes.light.icon}/>
        </View>
      ),
    });
  }, [navigation, newNotification, theme]);

  useLayoutEffect(()=>{
    navigation.setOptions({
      headerStyle: { backgroundColor: isDark? themes.dark.containerBackground : themes.light.containerBackground },
      headerTitleStyle: { color: isDark? themes.dark.textColor : themes.light.textColor},
      headerTintColor: isDark? themes.dark.textColor : themes.light.textColor,
    });
  }, [theme] )

  //Update the store leads whenever myLeads changes
  useEffect(() => {
    const updateStoredleads = async () => {
      try{
        await AsyncStorage.setItem('leads', JSON.stringify(myLeads));
        await AsyncStorage.setItem('metadata', JSON.stringify(resultsMetadata));
      }catch(error: any){
        console.error("Error in updateStoredleads: ", error.message)
      }
    }
    if(myLeads){
      updateStoredleads();
    }

  }, [myLeads]);

  const handleNotificationPress = () => {
    if(newNotification){
      Alert.alert("Results", newNotification);
      setNewNotification('');
    }
    else{
      Alert.alert("No Notifications", "You have not got any new notififcations.");
    }
  };
  
  const isValidUKPostcode = (postcode: string) => {
    const ukPostcodePattern = /^[A-Z]{1,2}\d{1,2}|[A-Z]{1,2}\d[A-Z]?\d[A-Z]{2}$/i;
    return ukPostcodePattern.test(postcode);
  };

  const handleKeywordsChange = (text: string) => {
    const formattedText = text;
    setKeywords(formattedText);
  };

  const handleQueryPostcodeChange = (text: string) => {
    const cleanedText = text.replace(/\s+/g, ' ');
    setQueryPostcode(cleanedText);
    if (!isPostcodeValid && isValidUKPostcode(text)) {
      setIsPostcodeValid(true);
    }
  };

  const handleFetchLeads = async() => {
    if (isValidUKPostcode(queryPostcode)) {
      if (!isPostcodeValid) {setIsPostcodeValid(true)}
      await fetchLeads();
    }else{
      setIsPostcodeValid(false);
    }
  };
      
  const calcRemainingPages = (totalResults: number, page: number, perPage: number) =>
  Math.max(0, Math.ceil((totalResults - page * perPage) / perPage));

  const fetchLeads = async() => {
    try{
      setLoading(true)
      const {success, data, totalResults, page, perPage} = await getLeads(queryPostcode, keywords);
      if(success && data){
        Alert.alert("Search complete", data.resultsMessage);
        setResultsMetadata({totalResults, page, perPage, queryPostcode, keywords, remainingPages: calcRemainingPages(totalResults, page, perPage)});
        setMyLeads(data);
      }else{
        Alert.alert("No results", 'No results found for your search');
      }
    }catch(error:any){
      console.error("Error in handleGetLeads: ", error.message);
      showMessage('Search failed', false)
    }finally{
      setLoading(false)
    }
  };

  return (

    <SafeAreaView style = {[styles.container, {backgroundColor: isDark? themes.dark.backgroundColor: themes.light.backgroundColor}]}>
      <StatusBar backgroundColor="transparent" barStyle={isDark? 'light-content':'dark-content'} translucent />
      <InfoCard 
        title={"Find Leads"} 
        description={getLeadDescription} 
        metadata={`${myLeads.companiesInfo.length} Stored Leads`} 
        icon={'search'} 
        metadataIcon={'briefcase-outline'}
        backgroundColor={isDark? themes.dark.containerBackground:themes.light.containerBackground}
        highlighterBackground={isDark? themes.dark.primaryColor:themes.light.secondaryBackgroundColor}
        color={isDark? themes.dark.textColor:themes.light.textColor}
        iconColor={isDark? themes.dark.icon:themes.secondaryIcon}


      />
      <View style={[styles.inputContainer,{ backgroundColor: isDark? themes.dark.containerBackground:themes.light.containerBackground}]}>
          <Text style ={[styles.label,{color:isDark? themes.dark.textColor:themes.light.textColor,}]}>Postcode:</Text>
          <InputField
            value={queryPostcode}
            onChangeText={handleQueryPostcodeChange}
            error={!isPostcodeValid && queryPostcode !== ''}
            errorText={'Invalid postcode. Correct format is SE11'}
            placeholder="Enter postcode e.g SE11"
            color={isDark? themes.dark.textColor : themes.light.textColor }                         
          />    
          <Text style ={[styles.label, {color:isDark? themes.dark.textColor:themes.light.textColor,}]}>Keywords (optional):</Text>
          <InputField
            value={keywords}
            onChangeText={handleKeywordsChange}
            placeholder="Software"
            color={isDark? themes.dark.textColor : themes.light.textColor }                         
          />    
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleFetchLeads}
          text={'Find Companies'}
          backgroundColor={isDark? themes.dark.primaryColor:themes.light.primaryColor}
          icon = {'search'}
          disabled={!queryPostcode}
          loading={loading}
          color={themes.dark.textColor}
        />
      </View>
    <FlashMessage/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.dark.backgroundColor,
    padding: sizes.layout.small,
    paddingTop: sizes.layout.medium,
  },
  navRowButtons:{
    flexDirection: 'row', 
    justifyContent:"space-evenly",
    alignItems:'center',
    marginRight: sizes.layout.medium,
    gap:sizes.layout.medium
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: sizes.layout.medium,
    marginBottom: sizes.layout.medium,
    borderWidth: 1,
    borderColor: themes.borderColor,
    fontFamily:'monserrat-regular'  
  },
  inputContainer: {
    justifyContent: 'center',
    backgroundColor:themes.dark.containerBackground,
    borderRadius:sizes.layout.medium,
    padding:sizes.layout.medium,
    elevation:5,
    shadowColor:themes.light.textColor,
    shadowOffset:{
      width:5,
      height:10
    },
    shadowOpacity:1,
    shadowRadius:sizes.layout.medium,
    gap:sizes.layout.small
  },

  label: {
    fontSize: sizes.font.small,
    color: themes.dark.textColor,
    marginBottom:sizes.layout.xSmall,
    fontFamily:'monserrat-regular'  
  },
   inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: sizes.font.small,
    fontFamily:'monserrat-regular',  
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: sizes.layout.medium,
    width:'100%'
  },
});
export default HomeScreen;
