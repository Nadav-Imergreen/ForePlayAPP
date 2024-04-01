import { View, Text, TouchableOpacity, Image, StyleSheet, useWindowDimensions, I18nManager, PixelRatio } from 'react-native'
import React from 'react'
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import COLORS from '../constants/colors';
import Button from '../components/Button';

const Welcome = () => {

    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();
    const isRTL = I18nManager.isRTL;
    const pixelDensity = PixelRatio.get();
    const vw = width / 100;
    const vh = height / 100;
    const logoSize = 30;

    // Function to calculate consistent position based on container width
    const calculatePosition = (percentage) => {
        return percentage * width;
    };

    // Function to calculate image size based on pixel density
    const getImageSize = (sizeInDP) => {
        return PixelRatio.getPixelSizeForLayoutSize(sizeInDP);
    };

    // Calculate the scaled width and height based on the desired dimensions in dp
    const scaledWidth = pixelDensity * 1.98 * logoSize;
    const scaledHeight = pixelDensity * 1 * logoSize;
    
    // Calculates font size in logical pixels (dp) based on viewport width (vw).
    const vwFontSize = (size) => {
        const scaledFontSize = vw * size;
        return PixelRatio.roundToNearestPixel(scaledFontSize);
    };

    
    return (

    <View style={{ flex: 1, flexDirection: 'row'}}>
        <LinearGradient
          colors={[
            '#FFFFFF', '#FFFFFF', '#FFFFFF',
            '#a4cdbd', '#a4cdbd', '#a4cdbd',  
            '#f06478', '#f06478', '#f06478', 
          ]}
          start={{ x: 0.9, y: 0 }}
          style={{flex: 1}}>

            <View style={styles.logo}>
                <Image source={require('../assets/logo_small.png')} style={{ width: scaledWidth, height: scaledHeight}} />
            </View>

            <View style={{alignItems: 'center'}}>
                <Image
                    source={require("../assets/hero1.jpg")}
                    style={{
                        height: getImageSize(23),
                        width: getImageSize(23),
                        borderRadius: 15,
                        top: '-10%',
                        right: isRTL ? null : calculatePosition(0.4),
                        left: isRTL ? calculatePosition(0.4) : null,
                        transform: [
                            { rotate: "25deg" }
                        ]
                    }}
                />

                <Image
                    source={require("../assets/hero3.jpg")}
                    style={{
                        height: getImageSize(20),
                        width: getImageSize(20),
                        borderRadius: 20,
                        top: '-5%',
                        right: isRTL ? null : calculatePosition(0.1),
                        left: isRTL ? calculatePosition(0.1) : null,
                        transform: [
                            { rotate: "15deg" }
                        ]
                    }}
                />

                <Image
                    source={require("../assets/hero2.jpg")}
                    style={{
                        height: getImageSize(40),
                        width: getImageSize(40),
                        borderRadius: 40,
                        top: '-55%',
                        right: isRTL ? null : calculatePosition(-0.35),
                        left: isRTL ? calculatePosition(-0.35) : null,
                        transform: [
                            { rotate: "-20deg" }
                        ]
                    }}
                />

            </View>
            

            <View style={{
                paddingHorizontal: 20,
                top: '-20%',
                flex: 1
            }}>
                <Text style={{
                    fontSize: vwFontSize(12),
                    fontWeight: 400,
                    color: COLORS.white
                }}>Start Your</Text>
                <Text style={{
                    fontSize: vwFontSize(12),
                    fontWeight: 800,
                    color: COLORS.white
                }}>Adventure</Text>

                <View style={{ marginVertical: 22 }}>
                    <Text style={{
                        fontSize: vwFontSize(4),
                        color: COLORS.white,
                        marginVertical: 4
                    }}>Discover love through games and chats.</Text>
                    <Text style={{
                        fontSize: vwFontSize(4),
                        color: COLORS.white,
                    }}>Our smart matching system makes it easy.</Text>
                    <Text style={{
                        fontSize: vwFontSize(4),
                        color: COLORS.white,
                    }}>Join us today and let the games begin!</Text>
                </View>
            </View>

            <View style={{flex: 1, paddingHorizontal: 20, }}>
                    <Button
                        title="Join Now"
                        onPress={() => navigation.navigate("Register")}
                    />

                    <View style={{
                        flexDirection: "row",
                        marginTop: 12,
                        justifyContent: "center",
                    }}>
                        {isRTL ? (
                            <>
                                <TouchableOpacity
                                onPress={() => navigation.navigate("Login")}
                                style={{ flexDirection: 'row', alignItems: 'center', marginRight: 4 }}>
                                <Text style={{
                                    fontSize: vwFontSize(4),
                                    color: COLORS.white,
                                    fontWeight: "bold",
                                }}>Login</Text>
                                </TouchableOpacity>
                                <Text style={{ fontSize: vwFontSize(4), color: COLORS.white }}>Already have an account?</Text>
                            </>
                        ) : (
                            <>
                                <Text style={{ fontSize: vwFontSize(4), color: COLORS.white }}>Already have an account?</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("Login")}
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                >
                                    
                                    <Text style={{ fontSize: vwFontSize(4), color: COLORS.white, fontWeight: 'bold', marginLeft: 4 }}>Login</Text>
                                </TouchableOpacity>   
                            </>
                        )}
                    </View>
                </View>

        </LinearGradient>
    </View>
    )
    
}

const styles = StyleSheet.create({
    gradient: {
      flex: 1,
    },
    logo: {
      alignItems: 'center',
      paddingTop: 0
    },
  });

export default Welcome