import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { themes, sizes } from '../constants/layout';
import { useSettingsContext } from '../context/SettingsContext';
import { useSearchContext } from '../context/SearchContext';
import { leadStatus } from '../constants/leadConstants';
import { LeadCardProps } from '../constants/types';

const { height } = Dimensions.get('screen');
const ITEM_HEIGHT = height / 6 - (sizes.layout.medium);



const LeadCard = ({ lead, handleLeadPress }: LeadCardProps) => {
  const { theme } = useSettingsContext();
  const {
    customerFilter,
    pendingFilter, 
    unansweredFilter, 
    prospectFilter,
  } = useSearchContext();
  const isDark = theme === 'dark';
  const { name, emails, status = leadStatus.prospect } = lead;

  if (!emails[0].email) {
    return null;
  }

  // Filter - only show customers
  if(customerFilter && status !== leadStatus.customer){
    return null;
  }

  // Filter - only show prospects
  if(prospectFilter && status !== leadStatus.prospect){
    return null;
  }

  // Filter - only show pending
  if(pendingFilter && status !== leadStatus.pending){
    return null;
  }

  // Filter - only show unanswered
  if(unansweredFilter && status !== leadStatus.unanswered){
    return null;
  }


  const icon = () => {
    switch(status){
        case 'Prospect':
            return 'person';

        case 'Customer':
            return 'person-add';
        
        case 'Pending':
            return 'hourglass';

        case 'Unanswered':
            return 'chatbubble-ellipses';

        default:
    }
}

const statusColor = () => {
  switch(status){
      case 'Prospect':
          return themes.colors.sapphire;

      case 'Customer':
          return themes.secondaryIcon;
      
      case 'Pending':
          return 'orange';

      case 'Unanswered':
          return themes.placeholder;

      default:
        return themes.dark.icon;
  }
}

  return (
    <>
      <LinearGradient
        colors={isDark ? themes.dark.primaryGradient : themes.light.primaryGradient}
        style={[styles.cardContainer, { borderColor: isDark ? themes.dark.borderColor : themes.light.borderColor,
        }]}
      >
        <TouchableOpacity onPress={() => handleLeadPress(lead)}>
          <View style={styles.cardContent}>
            <View style={[styles.rowContainer, { justifyContent: 'space-between' }]}>
              <Text numberOfLines={2} style={[styles.companyName, { color: isDark ? themes.dark.textColor : themes.light.textColor }]}>
                {name}
              </Text>
              <Ionicons name="chevron-forward-circle" size={24} color={isDark ? themes.dark.icon : themes.light.icon } />
            </View>
            <View style={[styles.rowContainer]}>
              <Ionicons name={"mail"} size={18} color={themes.secondaryIcon} style = {styles.icon} />
              <Text style={[styles.infoText, { color: isDark ? themes.dark.textColor : themes.light.textColor }]} numberOfLines={1}>
              {emails[0].email}
              </Text>
            </View>
            <View style={[styles.rowContainer]}>
            <Ionicons name={icon()} size={18} color={statusColor()} style = {styles.icon} />
              <Text style={[styles.infoText, { color: isDark ? themes.dark.textColor : themes.light.textColor }]} numberOfLines={1}>
              {status}
              </Text>
            </View>
           {/* {favourite && <Ionicons name={"star"} size={18} color={'gold'} style ={{marginLeft:'auto'}} />}  */}
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: sizes.layout.medium,
    marginVertical: sizes.layout.small,
    padding: sizes.layout.medium,
    elevation: 2,
    height: ITEM_HEIGHT,
  },
  cardContent: {
    backgroundColor:'transparent',
    borderRadius: sizes.layout.medium,
    gap: sizes.layout.xSmall,
  },
  companyName: {
    flex: 1,
    fontSize: sizes.font.medium,
    fontFamily: 'monserrat-bold',
    color: themes.dark.textColor,
    overflow: 'hidden',
    marginBottom: sizes.layout.xSmall
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: sizes.font.medium,
    color: themes.dark.textColor,
    fontFamily: 'monserrat-regular',
    overflow: 'hidden',
  },
  icon:{
    marginEnd: sizes.layout.small
  }
});

export { LeadCard };
