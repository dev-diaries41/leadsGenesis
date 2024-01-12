import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import { Button } from './Buttons';
import { themes, sizes } from '../constants/layout';
import { FooterButtonsProps } from '../constants/types';


const FooterButtons = ({ buttonsConfig, buttonsColor, backgroundColor = themes.light.containerBackground }: FooterButtonsProps) => {
  return (
    <View style={[styles.footer, { backgroundColor }]}>
      <View style={[styles.absoluteContainer, { justifyContent: 'space-evenly'}]}>
        {buttonsConfig.map(
          (buttonConfig, index) =>
            buttonConfig.condition && (
              <Button
                key={index}
                onPress={buttonConfig.onPress}
                width={buttonConfig.width || '30%'}
                icon={buttonConfig.icon}
                backgroundColor={buttonsColor}
                color={buttonConfig.iconColor}
              />
            )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    height:80,
    bottom: 8,
    // bottom: 0,
    // left: sizes.layout.small,
    // right: sizes.layout.small,
    left: 0,
    right: 0,
    justifyContent: 'center',
    backgroundColor: themes.light.containerBackground,
    borderBottomRightRadius: sizes.layout.medium,
    borderBottomLeftRadius: sizes.layout.medium,
    padding: sizes.layout.medium,
  },
  absoluteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export { FooterButtons };
