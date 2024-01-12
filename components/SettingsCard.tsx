import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import { themes, sizes } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { SettingsCardProps } from '../constants/types';

const SettingsCard = ({
  onPress, 
  dark, 
  settingDescription, 
  settingTitle, 
  isSwitch = false, 
  value
}: SettingsCardProps) => {
    return( 
        <View >
         <TouchableOpacity style = {{flexDirection:"column"}} onPress={onPress}>
         <View style={styles.settingsRow}>
            <Text style={[styles.settingTitle, {color:dark? themes.dark.textColor: themes.light.textColor}]}>{settingTitle}</Text>
            {isSwitch? (
            <Switch
              value={value}
              onValueChange={onPress}
              thumbColor={dark ? 'green' : 'gray'}
            />
            ):(
              <Ionicons name="chevron-forward-circle" style = {{justifyContent:"flex-end"}}  color={dark ? themes.dark.icon : themes.light.icon }  size ={24} />
            )}     
          </View>
         <Text style={[styles.settingValue, {color:dark? themes.dark.textColor: themes.light.textColor}]}>{settingDescription}</Text>
          </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  settingsRow: {
    flexDirection: 'row',
    justifyContent:"space-between",
    alignItems: 'center',
    paddingHorizontal: sizes.layout.medium,
    paddingVertical:sizes.layout.small
  },
  settingTitle:{
    fontSize:sizes.font.medium,
    fontFamily:'monserrat-semibold',
  },
  settingValue:{
    fontSize:sizes.font.small,
    paddingHorizontal:sizes.layout.medium,
    paddingBottom:sizes.layout.medium,
    fontFamily:'monserrat-regular',

  },
});
export {SettingsCard};