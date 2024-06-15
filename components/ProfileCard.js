import React, { useEffect, useState, useRef } from "react";
import { View, Image, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, PanResponder, Animated, Alert } from "react-native";
import LinearGradient from 'react-native-linear-gradient';

const ProfileCard = ({ suggestedUsers, 
                        currentIndex, 
                        pan, 
                        showLike, 
                        showDislike, 
                        setLikePressed, 
                        setDislikePressed, 
                        setShowLike, 
                        setShowDislike, 
                        setLikes, 
                        setDislikes,
                        photoIndex,
                        setPhotoIndex }) => {

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gesture) => {
                if (gesture.dx > 20) { // Swipe right
                    setLikePressed(true);
                    setShowLike(true);
                } else if (gesture.dx < -20) { // Swipe left
                    setDislikePressed(true);
                    setShowDislike(true);
                } else { // Reset button states if swipe is not significant
                    setLikePressed(false);
                    setDislikePressed(false);
                    setShowDislike(false);
                    setShowLike(false);
                }
                Animated.event(
                    [
                        null,
                        { dx: pan.x, dy: pan.y }
                    ],
                    { useNativeDriver: false }
                )(e, gesture);
            },
            onPanResponderRelease: (e, gesture) => {
                setLikePressed(false);
                setDislikePressed(false);
                setShowDislike(false);
                setShowLike(false);
                if (gesture.dx > 120) { // Swipe right
                    Animated.timing(pan, {
                        toValue: { x: 500, y: 0 },
                        duration: 300,
                        useNativeDriver: false
                    }).start(() => {
                        setLikes(prevCounter => prevCounter + 1);
                        setTimeout(() => {
                            Animated.timing(pan, {
                                toValue: { x: 0, y: 0 },
                                duration: 0,
                                useNativeDriver: false
                            }).start();
                        }, 500);
                    });
                } else if (gesture.dx < -120) { // Swipe left
                    Animated.timing(pan, {
                        toValue: { x: -500, y: 0 },
                        duration: 300,
                        useNativeDriver: false
                    }).start(() => {
                        setDislikes(prevCounter => prevCounter + 1);
                        setTimeout(() => {
                            Animated.timing(pan, {
                                toValue: { x: 0, y: 0 },
                                duration: 0,
                                useNativeDriver: false
                            }).start();
                        }, 500);
                    });
                } else { // Return card to center
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false
                    }).start();
                }
            }
        })
    ).current;

    const rotate = pan.x.interpolate({
        inputRange: [-500, 0, 500],
        outputRange: ['-30deg', '0deg', '30deg']
    });

    const panStyle = {
        transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate: rotate }]
    };

    const handlePhotoChange = (direction) => {
        const userPhotos = suggestedUsers[currentIndex].images.length;
        if (direction === 'next') {
            setPhotoIndex((prevIndex) => (prevIndex + 1) % userPhotos);
        } else {
            setPhotoIndex((prevIndex) => (prevIndex - 1 + userPhotos) % userPhotos);
        }
    };
    

    return (
        <Animated.View style={[styles.card, panStyle]} {...panResponder.panHandlers}>
            {/* Render profile image */}
            <View style={styles.imageContainer}>
                <Image style={styles.image} resizeMode='contain' source={{ uri: suggestedUsers[currentIndex].images[photoIndex] }} />
                {/* Photo indicators */}
                <View style={styles.photosIndicator}>
                    {suggestedUsers[currentIndex].images.map((_, index) => (
                        <View key={index} style={[styles.indicator, index === photoIndex ? styles.filledIndicator : styles.unfilledIndicator]} />
                    ))}
                </View>
                {/* Like and dislike indicators */}
                {showLike && (
                    <View style={styles.likeContainer}>
                        <Image source={require('../assets/like_logo.png')} style={styles.likeLogo} />
                    </View>
                )}
                {showDislike && (
                    <View style={styles.dislikeContainer}>
                        <Image source={require('../assets/dislike_logo.png')} style={styles.dislikeLogo} />
                    </View>
                )}
                {/* Touchable overlays for navigating photos */}
                <TouchableWithoutFeedback onPress={() => handlePhotoChange('prev')}>
                    <View style={styles.prevOverlay} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => handlePhotoChange('next')}>
                    <View style={styles.nextOverlay} />
                </TouchableWithoutFeedback>
            </View>

            {/* Overlay with user info */}
            <View style={styles.overlayContainer}>
                {/* Gradient overlay */}
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)']} // Gradient colors from white to black
                    style={styles.gradientOverlay}
                />
                {/* User info */}
                <Text style={styles.userName}>{suggestedUsers[currentIndex].firstName}, {suggestedUsers[currentIndex].age}</Text>
                <Text style={styles.distance}>{suggestedUsers[currentIndex].distance} kilometers from you</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        width: '95%',
        height: '98%',
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
        marginTop: 20,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 10,
        paddingBottom: 60,
    },
    photosIndicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '10%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    indicator: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        marginTop: 5,
        marginHorizontal: 5
    },
    filledIndicator: {
        backgroundColor: 'white',
        width: 20,
    },
    unfilledIndicator: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 20,
    },
    prevOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '50%',
    },
    nextOverlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '50%',
    },
    image: {
        flex: 1,
        width: '100%',
        aspectRatio: 1,
    },
    overlayContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        borderRadius: 10,
        justifyContent: 'flex-end',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 10,
    },
    userName: {
        position: 'absolute',
        bottom: 60,
        left: 20,
        color: 'white',
        fontSize: 24,
        fontStyle: 'italic'
    },
    distance: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        color: 'white',
    },
    likeContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    likeLogo: {
        width: 180,
        height: 180,
        resizeMode: 'contain',
        transform: [{ rotate: '-20deg' }]
    },
    dislikeContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    dislikeLogo: {
        width: 180,
        height: 180,
        resizeMode: 'contain',
        transform: [{ rotate: '20deg' }]
    },
});

export default ProfileCard;