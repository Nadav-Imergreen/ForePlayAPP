import { View, Text, TouchableOpacity, Image, StyleSheet, useWindowDimensions, I18nManager, PixelRatio } from 'react-native'
import React from 'react'
import { useEffect } from 'react';
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

    <View style={styles.container}>    
            <View style={styles.content}>
                <View style={styles.logo}>
                    <Image source={require('../assets/white_logo.png')} style={{ width: '90%', resizeMode: 'contain'}} />
                </View>
                    <View>
                        <Text style={{
                            fontSize: vwFontSize(5),
                            color: COLORS.white,
                            marginTop: 50,
                            fontWeight: '200'
                        }}>Connect meaningfully using AI matchmaking.</Text>
                        <Text style={{
                            fontSize: vwFontSize(5),
                            color: COLORS.white,
                            fontWeight: '200'
                        }}>Join us today and<Text style={{fontWeight: '500'}}> let the fun begin!</Text></Text>
                    </View>
            </View>

            <View style={styles.navigationContainer}>
                    <TouchableOpacity style={styles.allowButton} onPress={() => navigation.navigate("Register")}>
                        <Text style={styles.allowButtonText}>JOIN NOW</Text>
                    </TouchableOpacity>

                    <View style={{
                        flexDirection: "row",
                        marginTop: 15,
                        justifyContent: "center",
                    }}>
                        {isRTL ? (
                            <>
                                <TouchableOpacity
                                onPress={() => navigation.navigate("Login")}
                                style={{ flexDirection: 'row', alignItems: 'center', marginRight: 4 }}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Text style={{ fontSize: vwFontSize(4), color: COLORS.white, fontWeight: 'bold', marginLeft: 4, textDecorationLine: 'underline'}}>Login</Text>
                                </TouchableOpacity>   
                            </>
                        )}
                    </View>
                </View>


    </View>
    )
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2647a',
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
    },
    content: {
        flex: 2,
        paddingTop: 200,
        marginHorizontal: 21
    },
    logo: {
        alignItems: 'center',
        paddingTop: 0
    },  
    navigationContainer: {
        flex: 1, 
    },
    allowButton: {
        backgroundColor: '#f2647a',
        borderRadius: 24,
        paddingVertical: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)'
      },
      allowButtonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
      },
  });

export default Welcome