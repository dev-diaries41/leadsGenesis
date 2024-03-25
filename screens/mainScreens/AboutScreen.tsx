import { SafeAreaView, ScrollView, TextInput, View, Text, StyleSheet, Linking, TextInputProps} from 'react-native';
import React, {useLayoutEffect} from 'react';
import * as Clipboard from 'expo-clipboard';
import * as MailComposer from 'expo-mail-composer';
import axios from 'axios';
import { themes, sizes } from '../../constants/layout';
import { useLeadsContext } from '../../context/LeadsContext';
import { useSettingsContext } from '../../context/SettingsContext';
import { FooterButtons, createFlashMsg } from '../../components';

const AboutScreen = ({navigation, route}: any) => {
    const {lead} = route?.params || {};
    const { myLeads, setMyLeads} = useLeadsContext();
    const {theme, defaultMessage, defaultSubject} = useSettingsContext();
    const { website, phone, emails} = lead || {};
    const keysToSkip=['_id', 'plusCode', 'used', 'queryPostcode', '__v'];
    const showValue =(key: string) => !keysToSkip.includes(key);
    const showCopy = (key: string, value:any) => value;
    const {showMessage, FlashMessage} = createFlashMsg();
    const isDark = theme === 'dark';

    useLayoutEffect(()=>{
      navigation.setOptions({
        headerStyle: { backgroundColor: isDark? themes.dark.backgroundColor : themes.light.backgroundColor },
        headerTitleStyle: { color: isDark? themes.dark.textColor : themes.light.textColor},
        headerTintColor: isDark? themes.dark.textColor : themes.light.textColor,
      });
    }, [theme] )

    const formatKey = (key: string) => {
        switch(key){
            case 'emails':
                return 'Email';

            case 'stars':
                return 'Google Rating';

            case 'numReviews':
                return 'Number of Google Reviews';

            default:
                return key.charAt(0).toUpperCase() + key.slice(1);
        }
    }

    const formatValue = (key: string, value: any) => {
        switch(key){
            case 'emails':
                return value[0].email || 'N/A';
            case 'stars':
              if(value === 0 || !value){return 'N/A'}
              return `${value.toString()} ⭐`;

            default:
                if(value === 0 || !value){return 'N/A'}
                return value.toString();
            }
        }

  const openURL = async (url: string) => {
    try{
      if (await Linking.canOpenURL(url)) {
        Linking.openURL(url).catch((error) => {
          console.error('Error opening URL:', error);
        });
      } else {
        console.log('Cannot open URL:', url);
      }

    }catch(error: any){
      console.error("Error in openUrl: ", error.message);
    }
    
  };

   const handleCopyData =  async (value: any) => {
    await Clipboard.setStringAsync(value.toString());
  };

  const handleOpenPhoneApp = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl)
      .then((supported) => {
        if (!supported) {
          console.log("Phone app not available");
        }
      })
      .catch((error) => console.error('Error opening phone app:', error));
  };


  const updateCompaniesStatus = async (recipient: string) => {
    try {
      if (myLeads.companiesInfo) {
        const foundIndex = myLeads.companiesInfo.findIndex((company) => {
          return company.emails.some(emailObj => emailObj.email === recipient );
        
        });
  
        if (foundIndex !== -1) {
          const updatedCompaniesInfo = [...myLeads.companiesInfo];
          updatedCompaniesInfo[foundIndex].used = true;
          setMyLeads((prevMyLeads) => ({ ...prevMyLeads, companiesInfo: updatedCompaniesInfo }));
          const result = await updateDoc(updatedCompaniesInfo[foundIndex], {name: updatedCompaniesInfo[foundIndex].name});
        }else{
          throw new Error('ERROR_NOT_FOUND: The company you emailed was not found');
        }
      }
    } catch (error: any) {
      console.error(`Error updating companies status: ${error.message}`);
    }
  };
  
  const updateDoc = async (updatedDoc: any, identifier: any) => {
    const apiUrl = process.env.UPDATE_URL || '';
    try {
      const headers = {
        headers: {
          authorization: process.env.EWAY_API_KEY,
        },
      };

      const reqBody = { updatedDoc, identifier }; 
      const res = await axios.put(apiUrl, reqBody, headers);
 
      return res.data;
    } catch (error) {
      console.error(`Error updating document: ${error}`);
    }
  };
  
  const sendEmail = async (recipient: string, body = defaultMessage, subject = defaultSubject) => {
    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        console.error('Email is not available on this device');
        return;
      }
      
      // On Android the status value is always assumed to be 'sent'
      // This is a limitation of expo
      const status = await MailComposer.composeAsync({
        recipients: [recipient],
        subject: subject,
        body: body,
      });
      
        await updateCompaniesStatus(recipient);
        showMessage('Email sent successfully ', true);
      
      
    } catch (error: any) {
      console.error('Error sending email:', error.message);
    }
  };

    const footerButtonsConfig = [
      {
        condition: phone,
        onPress: () => handleOpenPhoneApp(phone),
        icon: 'call-outline',
        iconColor:themes.colors.darkWhite
      },
      {
        condition: emails[0].email,
        onPress: async () => await sendEmail(emails[0].email),
        icon: 'mail-outline',
        iconColor:themes.colors.darkWhite
      },
      {
        condition: website,
        onPress: async () => await openURL(website),
        icon: 'earth-outline',
        iconColor:themes.colors.darkWhite
      },
    ];

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: isDark? themes.dark.backgroundColor:themes.light.backgroundColor}]}>
          <ScrollView showsVerticalScrollIndicator={false}> 
            <View style={[styles.inputContainer]}>
              {Object.entries(lead).map(([key, value], index) => showValue(key) && (
                <View key={index}>
                    <View style= {styles.rowContainer}>
                        <Text style={[styles.label, {color:isDark? themes.dark.textColor: themes.light.textColor}]}>{formatKey(key)}:</Text>
                    </View>
                    <TextInput
                      style={[styles.input, {color: isDark? themes.dark.textColor: themes.light.textColor}, 
          
                    ]}
                      value={formatValue(key,value)}
                      underlineColorAndroid="transparent"
                      editable={false}
                      numberOfLines={2}
                      multiline
                      // ellipsizeMode="tail" 
                    />
                 </View>
              ))}
            </View>    
          </ScrollView>
          <FooterButtons 
              buttonsConfig={footerButtonsConfig} 
              buttonsColor={isDark? themes.dark.primaryColor:themes.light.primaryColor}
              backgroundColor={isDark? themes.dark.containerBackground:themes.light.containerBackground}
            />      
          <FlashMessage/>
        </SafeAreaView>
      );
    }      

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.light.backgroundColor,
    padding: sizes.layout.small,
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
    maxHeight: 100,
    padding: sizes.layout.small,
    marginBottom: sizes.layout.medium,
    borderWidth: 1,
    borderRadius:sizes.layout.medSmall,
    borderColor:themes.borderColor,
    color:themes.light.textColor,
    fontFamily:'monserrat-semibold', 
    fontSize: sizes.font.small,
  },
  inputContainer: {
    justifyContent: 'center',
    backgroundColor:'transparent',
    padding:sizes.layout.medium,
    marginBottom:80   //Account for footer button height
  },
  label: {
    fontSize: sizes.font.small,
    color: themes.light.textColor,
    marginBottom:sizes.layout.xSmall,
    fontFamily:'monserrat-regular',  
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon:{
    paddingHorizontal:sizes.layout.small
  },
});

export default AboutScreen

