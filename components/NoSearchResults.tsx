import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { themes, sizes } from '../constants/layout'
import { Ionicons } from '@expo/vector-icons'

 const NoSearchResults = () => {
  return (
    <View style={styles.container}>
        <Ionicons name='search' size={120} color={themes.placeholder}/>
        <Text style={styles.heading}>Search Leads</Text>
        <Text style={styles.text}>No Leads were found</Text>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
      },
    heading:{
        fontSize: sizes.font.xxLarge,
        fontFamily:'monserrat-semibold',
        color:themes.placeholder,
    },
    text: {
        fontSize: sizes.font.medium,
        color: themes.placeholder,
        fontFamily:'monserrat-regular'  
      },
})

export default NoSearchResults;