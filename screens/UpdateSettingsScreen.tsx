import { SafeAreaView, StyleSheet, View, TextInput, Dimensions } from 'react-native';
import React, {useLayoutEffect, useState } from 'react';
import { sizes, themes } from '../constants/layout';
import { Button } from '../components/Buttons';
import { useSettingsContext } from '../context/SettingsContext';
import { HeaderButton } from '../components/Header';
import createFlashMsg from '../components/FlashMessage';


const {height} = Dimensions.get('screen');

const UpdateSettingsScreen = ({ navigation, route }: any) => {
  const {changingDefaultMessage, changingDefaultSubject} = route?.params || {};
  const updatingEmailConfig = changingDefaultMessage || changingDefaultSubject || false;
  const {defaultMessage, setDefaultMessage, defaultSubject, setDefaultSubject, theme} = useSettingsContext();
  const [newDefaultMessage, setNewDefaultMessage] = useState(defaultMessage);
  const [newDefaultSubject, setNewDefaultSubject] = useState(defaultSubject);
  const [isEditing, setIsEditing] = useState(false);
  const {showMessage, FlashMessage} = createFlashMsg();
  const isDark = theme ==='dark';

  const messagePlaceholder = 'Enter your default message to use for outreach emails.'
  const subjectPlaceholder = 'Enter your default subject to use for outreach emails.'

  useLayoutEffect(()=>{
    navigation.setOptions({
      headerStyle: { backgroundColor: isDark? themes.dark.backgroundColor : themes.light.backgroundColor },
      headerTitleStyle: { color: isDark? themes.dark.textColor : themes.light.textColor},
      headerTintColor: isDark? themes.dark.textColor : themes.light.textColor,
    });
  }, [theme] )



const save = () => {
  if(newDefaultMessage && changingDefaultMessage){
    setDefaultMessage(newDefaultMessage)
    setIsEditing(false);
    showMessage('Outreach email updated', true);
    }
  else if(newDefaultSubject && changingDefaultSubject){
    setDefaultSubject(newDefaultSubject)
    setIsEditing(false);
    showMessage('Default subject updated', true);
  }
}

  return (
    <SafeAreaView style = {[styles.container, {backgroundColor: isDark? themes.dark.backgroundColor: themes.light.backgroundColor}]}>
      <HeaderButton 
        title={changingDefaultMessage? 'Default Message' : 'Default Subject'} 
        icon={'pencil-outline'} 
        textDecorationLine={'none'}
        buttonText={isEditing? 'Editing...':'Edit'}
        onPress={() => setIsEditing(!isEditing)}
        iconColor={isDark? themes.dark.icon: themes.secondaryIcon}
        textColor={isDark? themes.dark.textColor: themes.light.textColor}
      />      
      {updatingEmailConfig && (
        <View style={[styles.defaultMessageContainer, {backgroundColor:isDark? themes.dark.containerBackground: themes.light.containerBackground}]}>
              <TextInput
                style={[styles.input,{color:isDark? themes.dark.textColor:themes.light.textColor}]}
                placeholder={changingDefaultMessage? messagePlaceholder:subjectPlaceholder}
                placeholderTextColor={themes.placeholder}
                value={changingDefaultMessage? newDefaultMessage : newDefaultSubject}
                onChangeText={changingDefaultMessage? text => setNewDefaultMessage(text) : text => setNewDefaultSubject(text)}
                multiline={true}
                scrollEnabled={true}
                editable={isEditing}
                textAlignVertical="top"
              />
          </View>
          )}
      <View style={styles.buttonContainer}>
       <Button
        onPress={save}
        text = 'Save'
        icon = 'save-outline'
        disabled={!newDefaultMessage && !newDefaultSubject}
        backgroundColor={isDark? themes.dark.primaryColor:themes.light.primaryColor}
        color={themes.dark.textColor}/>
       </View>
      <FlashMessage/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    padding:sizes.layout.small,
  },
  defaultMessageContainer: {
    alignSelf:'center',
    backgroundColor:themes.dark.containerBackground,
    borderRadius: sizes.layout.medium,
    width: "100%",
    maxHeight: height * 0.6,
    elevation:5,
    shadowColor:themes.light.textColor,
    shadowOffset:{
      width:5,
      height:10
    },
    shadowOpacity:1,
    shadowRadius:sizes.layout.medium,

  },

  input: {
    borderColor: '#555',
    padding: sizes.layout.medium,
    width: "100%",
    fontFamily:'monserrat-regular',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: sizes.layout.medium,
  },
  
});

export default UpdateSettingsScreen;
