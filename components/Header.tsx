import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { themes, sizes } from '../constants/layout';
import { Ionicons } from '@expo/vector-icons';
import { TextWithIconButton } from './TextWithIconButton';
import { HeaderProps, HeaderButtonProps } from '../constants/types';


const Header = ({ 
  title, 
  icon,
  backgroundColor = themes.dark.containerBackground, 
  fontSize = sizes.font.large, 
  textAlign = 'left', 
  textDecorationLine = 'underline', 
  iconSize = 24, 
  iconColor=themes.dark.icon,
  textColor = themes.dark.textColor,
}: HeaderProps) => {
  return (
    <View style={[styles.header, {backgroundColor}]}>
      <View style={styles.rowContainer}>
        <Text style={[styles.heading, {fontSize, textAlign, textDecorationLine, color:textColor}]}>{title}</Text>
        { icon && <Ionicons name={icon} size ={iconSize} color={iconColor}/>}
      </View>
    </View>
  );
};



const HeaderButton= ({
  buttonText,
  title, 
  icon,
  fontSize = sizes.font.large, 
  textAlign = 'left', 
  textDecorationLine = 'none', 
  iconSize = 24, 
  iconColor=themes.dark.primaryColor,
  textColor = themes.dark.textColor,
  onPress
}: HeaderButtonProps) => {
    const customizableStyles = { fontSize, textAlign, textDecorationLine, color: textColor};
  return (
    <View style={styles.headerWithButton}>
      <View style={styles.rowContainer}>
        <Text style={[styles.headingWithButton, customizableStyles]}>{title}</Text>
        <TextWithIconButton buttonText={buttonText}  icon={icon} onPress={onPress} color={iconColor} iconSize={iconSize}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
      header:{
        justifyContent: 'center',
        borderTopRightRadius:sizes.layout.medium,
        borderTopLeftRadius: sizes.layout.medium,
        padding:sizes.layout.large,
      },
      headerWithButton:{
        justifyContent: 'center',
        borderRadius:sizes.layout.medium,
        paddingHorizontal:sizes.layout.medium,
        marginVertical:sizes.layout.medium,
      },
      heading: {
        color: themes.dark.textColor,
        fontFamily:'monserrat-bold',
        width:'95%'
      },
      headingWithButton: {
        color: themes.dark.textColor,
        fontFamily:'monserrat-bold',
      },
      rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      buttonText:{
        color: themes.dark.primaryColor,
        fontSize: sizes.font.large,
        marginLeft: sizes.layout.small,
        fontFamily:'monserrat-regular',  

      }
})

export {Header, HeaderButton};
