import React, { useLayoutEffect, useState } from 'react';
import {View, SafeAreaView, StyleSheet, TextInput, Text, StatusBar} from 'react-native';
import {useLeadsContext} from '../../context/LeadsContext';
import { useSettingsContext } from '../../context/SettingsContext';
import { themes, sizes } from '../../constants/layout';
import { DisplayModal, CustomPicker, IconButton, createFlashMsg, Spacer, Button } from '../../components';
import { leadStatus } from '../../constants/leadConstants';
import { useIsFocused } from '@react-navigation/native';

const statusHelpInfo = `Prospect - potential business opportunity. Gathering initial information
Customer - successfully converted lead. Ongoing customer relationship.
Pending - waiting for confirmation from Lead.
Unanswered - attempted contact with no response.`

const additionalNotesInfo = `Use this section to provide specific details or updates about the Lead. Include any noteworthy information such as meeting outcomes, key discussions, or important events related to the Lead. `

const LeadNotesScreen = ({navigation}: any) => {
  const {myLeads, setMyLeads, selectedLead} = useLeadsContext();
  const {theme} = useSettingsContext();
  const [status, setStatus] = useState('');
  const [topic, setTopic] = useState('');
  const [helpInfo, setHelpInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {showMessage, FlashMessage} = createFlashMsg();
  const isDark = theme === 'dark';

  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    // Set initial values based on selectedLead when the screen comes into focus
    if (selectedLead?.status) {
      setStatus(selectedLead.status);
    } else {
      setStatus(""); // Resetting status when there is no selectedLead
    }
    if (selectedLead?.notes) {
      setNotes(selectedLead.notes);
    } else {
      setNotes(""); // Resetting notes when there is no selectedLead
    }
  }, [selectedLead, isFocused]);

  const handleNotesChange = (text: string) => {
    const formattedText = text;
    setNotes(formattedText);
  };

  const handleInfoPress = (topic: string) => {
      setTopic(topic)
      setHelpInfo(topic === 'Status'? statusHelpInfo:additionalNotesInfo)
      setModalVisible(!isModalVisible);
  };

  const handleStatusChange = (selectedValue: string) => {
    setStatus(selectedValue);
};


const handleOnClose = () => {
  setModalVisible(false)
  setTopic('')
}

const handleSave = () => {
  const updatedData = {...myLeads};
  const updatedLeads = updatedData.companiesInfo.map(lead => 
    lead.name === selectedLead?.name? {...lead, notes: notes, status: status } : lead
  )
  updatedData.companiesInfo = updatedLeads;
  setMyLeads(updatedData);
  showMessage('Notes successfully saved', true);
}


  return (
    <SafeAreaView style = {[styles.container, {backgroundColor: isDark? themes.dark.backgroundColor: themes.light.backgroundColor}]}>
      <StatusBar backgroundColor="transparent" barStyle={isDark? 'light-content':'dark-content'} translucent />
      <View style={styles.rowContainer}>
        <Text style ={[styles.label,{color:isDark? themes.dark.textColor:themes.light.textColor,}]}>Status</Text>
        <IconButton 
          icon={'information-circle'} 
          size={24} 
          color={isDark? themes.dark.icon: themes.secondaryIcon}
          onPress={()=>handleInfoPress('Status')}
        />
      </View>
      <CustomPicker
        label={'Select Status'}
        dropdownIconColor={isDark? themes.dark.icon:themes.secondaryIcon}
        dropdownIconRippleColor={isDark? themes.dark.primaryColor:themes.light.primaryColor}
        textColor={isDark? themes.dark.textColor:themes.light.textColor}
        options={Object.values(leadStatus)}
        selectedValue={status}
        onValueChange={handleStatusChange}
      />
      <Spacer/>
      <View style={styles.rowContainer}>
        <Text style ={[styles.label,{color:isDark? themes.dark.textColor:themes.light.textColor}]}>Additional Notes</Text>
        <IconButton 
          icon={'information-circle'} 
          size={24} 
          color={isDark? themes.dark.icon : themes.secondaryIcon}
          onPress={()=>handleInfoPress('Additional Notes')}
        />
      </View>      
      <View style={[styles.inputContainer,{ backgroundColor: isDark? themes.dark.containerBackground:themes.light.containerBackground}]}>
          <TextInput
            style={[styles.input,
              {color:isDark? themes.dark.textColor:themes.light.textColor,
                borderColor:isDark? themes.dark.primaryColor:themes.light.borderColor,
              }]
            }
            placeholder="This company is interested in partnership and is considering a meeting"
            placeholderTextColor={themes.placeholder}            
            value={notes}
            onChangeText={handleNotesChange}
            underlineColorAndroid="transparent"
            onEndEditing={()=>notes.trim()}
            multiline
            textAlignVertical='top'
            scrollEnabled
          />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          text={'Save'}
          backgroundColor={isDark? themes.dark.primaryColor:themes.light.primaryColor}
          icon = {'save-outline'}
          loading={loading}
          fontSize={sizes.font.large}
          color={themes.dark.textColor}
          onPress={handleSave}
        />
      </View>
      <DisplayModal
        visible={isModalVisible}
        description={helpInfo}
        onClose={handleOnClose}
        title={topic === 'Status'? 'Status Types':'Additional Notes'}
        contentBackground={isDark? themes.dark.secondaryBackgroundColor:themes.light.secondaryBackgroundColor}
        summaryBackground={isDark? themes.dark.backgroundColor:themes.light.backgroundColor}
        textColor={isDark? themes.dark.textColor:themes.light.textColor}     
      />
    <FlashMessage/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.light.backgroundColor,
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
    maxHeight: 300,
    borderRadius: sizes.layout.small,
    paddingBottom: sizes.layout.medium,
    marginBottom: sizes.layout.medium,
    borderColor: themes.dark.primaryColor,
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
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.layout.small,
    gap:sizes.layout.xSmall,
  },
});
export default LeadNotesScreen;
