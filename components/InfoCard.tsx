import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themes, sizes } from '../constants/layout';
import { InfoCardProps } from '../constants/types';


const InfoCard = ({ 
  title, 
  description, 
  metadata, 
  icon, 
  metadataIcon, 
  highlighterBackground,
  color = themes.light.textColor,
  iconColor = themes.light.primaryColor,
  backgroundColor = themes.light.containerBackground
}: InfoCardProps) => {
  return (
    <>
        <View 
          style={[styles.cardContainer, {backgroundColor}]}>
            <View style = {[styles.rowContainer]}>
              <Text numberOfLines={1} style={[styles.title, {color:iconColor}]}>{title}</Text>
              <Ionicons name={icon} size={24} color={iconColor} style={{marginLeft:"auto"}} />
            </View>
            {description && 
              <View style={styles.rowContainer}>
              <Ionicons name={"information-circle"} size={24} color={iconColor} />
              <Text style={[styles.infoText, {color}]}>{description}</Text>
              </View>
            }
             <View style={[styles.rowContainer, styles.highlighter, {backgroundColor: highlighterBackground}]}>
              <Ionicons name={metadataIcon} size={24} color={iconColor} />
              <Text style={[styles.highlighterText, {color:iconColor}]}>{metadata}</Text>
            </View>
        </View>

    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    borderRadius: sizes.layout.medium,
    marginBottom:sizes.layout.medium,
    padding: sizes.layout.medium,
    elevation:5,
    shadowColor:themes.light.textColor,
    shadowOffset:{
      width:5,
      height:10
    },
    shadowOpacity:1,
    shadowRadius:sizes.layout.medium,
  },

  cardContent: {
    borderRadius: sizes.layout.medium,
  },
  title: {
    fontSize: sizes.font.large,
    color: 'white',
    overflow:"hidden",
    paddingEnd:sizes.layout.small,
    fontFamily:'monserrat-bold'
  },
 
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.layout.small
  },
  highlighterText: {
    fontSize: sizes.font.medium,
    color: 'white',
    marginLeft: sizes.layout.small,
    fontFamily:'monserrat-semibold'
  },
  infoText: {
    fontSize: sizes.font.medium,
    marginLeft: sizes.layout.small,
    color: themes.dark.textColor,
    fontFamily:'monserrat-regular'  
  },

  highlighter: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: sizes.layout.small,
    padding:sizes.layout.xSmall,
  },
});

export {InfoCard};
