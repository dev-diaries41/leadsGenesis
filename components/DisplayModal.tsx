import React, {useRef, useLayoutEffect} from 'react';
import { View, Text, Modal, PanResponder, Animated, StyleSheet } from 'react-native';
import { themes, sizes } from '../constants/layout';
import { DisplayModalProps } from '../constants/types';


const DisplayModal = ({ 
  visible, 
  onClose, 
  description, 
  title,
  contentBackground = themes.dark.containerBackground,
  summaryBackground = themes.dark.backgroundColor,
  textColor = themes.dark.textColor,
}: DisplayModalProps) => {
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

  const descriptionLines = description.split('\n');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Animated.View
        style={[styles.modalContainer, { transform: [{ translateY: panY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.modalContent, {backgroundColor:contentBackground}]}>
          <Text style={[styles.title, {color:textColor}]} numberOfLines={2}>{title}</Text>
          <View style={styles.pullDownButton}>
            <View style={styles.pullDownNotch} />
          </View>
          <View style={[styles.infoSummary, {backgroundColor:summaryBackground}]}>
            <View style={styles.infoContainer}>
              {/* Map through the descriptionLines and apply different styling to the first word of each line */}
              {title === 'Status Types' ? (
                descriptionLines.map((line, index) => (
                  <Text key={index} style={[styles.input, { color: textColor }]}>
                    <Text style={{ fontFamily: 'monserrat-semibold' }}>
                      ⦁ {line.split(' ')[0]}
                    </Text>
                    {line.substring(line.indexOf(' '))}
                  </Text>
                ))
              ) : (
                <Text style={[styles.input, { color: textColor }]}>
                  {description}
                </Text>
              )}
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
    label: {
      fontSize: sizes.font.small,
      color: themes.placeholder,
      fontFamily: 'monserrat-regular',
    }, 
    buttonContainer: {
      flexDirection: 'row',
      paddingVertical: sizes.layout.medium,
      justifyContent: 'space-evenly',
      marginTop: sizes.layout.medium,
    },
    title: {
      fontSize: sizes.font.large,
      marginBottom: sizes.layout.large,
      color: themes.dark.textColor,
      textAlign: "center",
      fontFamily: 'monserrat-bold',
    },
    infoContainer: {
      flexDirection: 'column',
      alignItems: 'center',
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

export default DisplayModal;
