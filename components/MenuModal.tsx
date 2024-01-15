import React, {useRef, useLayoutEffect } from 'react';
import { StyleSheet, View,Text, Modal, Animated, PanResponder } from 'react-native';
import { themes, sizes } from '../constants/layout';
import { TextWithIconButton } from './TextWithIconButton';
import { useLeadsContext } from '../context/LeadsContext';
import { useSearchContext } from '../context/SearchContext';

interface MenuModalProps { 
  visible: boolean;
  onClose: () => void;
  contentBackground: string;
  summaryBackground: string;
  textColor: string;
}

const MenuModal = ({ 
  visible, 
  onClose, 
  contentBackground = themes.dark.containerBackground,
  summaryBackground = themes.dark.backgroundColor,
  textColor = themes.dark.textColor,
}: MenuModalProps) => {

  const {myLeads, setMyLeads} = useLeadsContext();
  const {
    customerFilter,
    setCustomerFilter,
    pendingFilter, 
    setPendingFilter,
    unansweredFilter, 
    setUnansweredFilter,
    prospectFilter,
    setProspectFilter
  } = useSearchContext();
  const panY = useRef(new Animated.Value(0)).current; // Start the modal off-screen

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Check if the gesture is moving downward
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          onClose();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 15,
            stiffness: 100, 
            velocity: 5,    
          }).start();
                  }
      },
    })
  ).current;

  useLayoutEffect(() => {
    if (visible) {
      // Animate the modal into place when it becomes visible
      Animated.spring(panY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 15,      
        stiffness: 100,   
        velocity: 5, 
      }).start();
          }
  }, [visible]);


  const sortByCompanyName = () => {
    if (!Array.isArray(myLeads.companiesInfo)) {throw new Error('Input must be an Array')};

    const leadsDataCopy = {...myLeads};

    leadsDataCopy.companiesInfo.sort((a, b) => {

      const lowercasedA = a.name.toLowerCase();
      const lowercasedB = b.name.toLowerCase();

      if (lowercasedA < lowercasedB) {
        return -1;
      } else if (lowercasedA > lowercasedB) {
        return 1;
      } else {
        return 0;
      }
    });

    
    setMyLeads(leadsDataCopy);
  }

  const sortByRating = () => {
    if (!Array.isArray(myLeads.companiesInfo)) {throw new Error('Input must be an Array')};
    const leadsDataCopy = {...myLeads};

    leadsDataCopy.companiesInfo.sort((a, b) => {
      if (a.stars > b.stars) {
        return -1;
      } else if (a.stars < b.stars) {
        return 1;
      } else {
        return 0;
      }
    });

    setMyLeads(leadsDataCopy);

  }

  const sortByReviews = () => {
    if (!Array.isArray(myLeads.companiesInfo)) {throw new Error('Input must be an Array')};
    const leadsDataCopy = {...myLeads};

    leadsDataCopy.companiesInfo.sort((a, b) => {
      if (a.numReviews > b.numReviews) {
        return -1;
      } else if (a.numReviews < b.numReviews) {
        return 1;
      } else {
        return 0;
      }
    });

    setMyLeads(leadsDataCopy);

  }

  const sortByCustomers = () => {
   setCustomerFilter(!customerFilter)
  }

  const sortByPending = () => {
    setPendingFilter(!pendingFilter)
  }

  const sortByUnanswered = () => {
   setUnansweredFilter(!unansweredFilter)
  }

  const sortByProspect = () => {
    setProspectFilter(!prospectFilter)
   }
  


  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Animated.View
        style={[styles.modalContainer, { transform: [{ translateY: panY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.modalContent, {backgroundColor:contentBackground}]}>
        <Text style={[styles.title, {color:textColor}]} numberOfLines={2}>{'Sort Leads'}</Text>
          <View style={styles.pullDownButton}>
            <View style={styles.pullDownNotch} />
          </View>
          <View style={[styles.infoSummary, {backgroundColor:summaryBackground}]}>
            <View style={styles.infoContainer}>
              <TextWithIconButton buttonText='Company name (a - z)' icon={'text'} onPress={sortByCompanyName} justifyContent='flex-start' color={textColor}/>
              <TextWithIconButton buttonText='Rating (⇓)' icon={'star'} onPress={sortByRating} justifyContent='flex-start' color={textColor}/>
              <TextWithIconButton buttonText='Number of reviews (⇓)' icon={'receipt'} onPress={sortByReviews} justifyContent='flex-start' color={textColor}/>
              <TextWithIconButton buttonText='Customers' icon={'person'} onPress={sortByCustomers} justifyContent='flex-start' color={customerFilter? themes.secondaryIcon : textColor}/>
              <TextWithIconButton buttonText='Prospects' icon={'person-add'} onPress={sortByProspect} justifyContent='flex-start' color={prospectFilter? themes.secondaryIcon : textColor}/>
              <TextWithIconButton buttonText='Pending' icon={'hourglass'} onPress={sortByPending} justifyContent='flex-start' color={pendingFilter? themes.secondaryIcon : textColor}/>
              <TextWithIconButton buttonText='Unanswered' icon={'chatbubble-ellipses'} onPress={sortByUnanswered} justifyContent='flex-start' color={unansweredFilter? themes.secondaryIcon : textColor}/>
            </View>
          </View>
        </View>
        </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modalContent: {
      backgroundColor: themes.dark.secondaryBackgroundColor,
      borderTopLeftRadius: sizes.layout.xLarge,
      borderTopRightRadius: sizes.layout.xLarge,
      padding: sizes.layout.medium,
      width: '100%',
    },
    infoSummary:{
      borderRadius: sizes.layout.medium,
      backgroundColor: themes.dark.backgroundColor,
      marginBottom:sizes.layout.medium,
      paddingHorizontal:sizes.layout.small,
      elevation:5,
      shadowColor:themes.light.textColor,
      shadowOffset:{
        width:5,
        height:10
      },
      shadowOpacity:1,
      shadowRadius:sizes.layout.medium,
    },
    title: {
      fontSize: sizes.font.large,
      marginBottom: sizes.layout.large,
      color: themes.dark.textColor,
      textAlign: "center",
      fontFamily: 'monserrat-bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingVertical: sizes.layout.medium,
      justifyContent: 'space-evenly',
      marginTop: sizes.layout.medium,
    },
 
    infoContainer: {
      flexDirection: 'column',
      // alignItems: 'center',
      paddingVertical:sizes.layout.small,
    },
    icon:{
      marginRight: sizes.layout.xSmall,
    },
    pullDownButton: {
      position: 'absolute',
      top: 0, 
      alignSelf: 'center',
      zIndex: 2, // Ensure it's above other elements
    },
    pullDownNotch: {
      width: 60,
      height: sizes.layout.small,
      backgroundColor: themes.placeholder,
      borderColor:themes.dark.backgroundColor,
      borderWidth:2,
      borderBottomRightRadius: sizes.layout.small,
      borderBottomLeftRadius: sizes.layout.small,
    },
    input: {
      width: '100%',
      maxHeight: 300,
      borderRadius: sizes.layout.small,
      paddingHorizontal: sizes.layout.medium,
      marginBottom: sizes.layout.small,
      color:themes.light.textColor,
      fontSize:sizes.font.medium
    },   
});

export {MenuModal};
