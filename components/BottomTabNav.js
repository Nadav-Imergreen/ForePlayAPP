import React, {useState, useEffect, useLayoutEffect} from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { AiMatchesScreen, MatchesScreen, UserInfoScreen } from "../screens";

import ConversationsScreen from "../screens/conversationsScreen";


const Tab = createBottomTabNavigator();

const screenOptions = {
    tabBarShowLabel: false,
    headerShown: true,
    tabBarHideOnKeyboard: true,
    header: () => <CustomHeader />,
    tabBarStyle: {
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: 50,
        backgroundColor: "white",
    },
};

const CustomHeader = () => (
    <View style={styles.header}>
        <Image
            source={require("../assets/logo_small.png")}
            style={styles.logoContainer}
            resizeMode="contain"
        />
    </View>
);

const BottomTabNav = ({navigation}) => {

    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen
                name="MatchesScreen"
                component={MatchesScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={
                                focused
                                    ? require("../assets/matchs_icon_selected.png")
                                    : require("../assets/matchs_icon_not_selected.png")
                            }
                            style={styles.icon}
                        />
                    ),
                    unmountOnBlur: true
                }}
            />
            {<Tab.Screen
                name="Conversations"
                component={ConversationsScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                            source={
                                focused
                                    ? require("../assets/chat_icon_selected.png")
                                    : require("../assets/chat_icon_not_selected.png")
                            }
                            style={styles.icon}
                        />
                    ),
                    unmountOnBlur: true
                   // tabBarStyle: { display: "none" }
                }}
            />}
            <Tab.Screen
                name="UserInfoScreen"
                component={UserInfoScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={
                                focused
                                    ? require("../assets/profile_icon_selected.png")
                                    : require("../assets/profile_icon_not_selected.png")
                            }
                            style={styles.icon}
                        />
                    ),
                    unmountOnBlur: true, // Unmount UserInfoScreen on blur
                }}
            />
            <Tab.Screen
                name="AiMatchesScreen"
                component={AiMatchesScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={
                                focused
                                    ? require("../assets/ai_match_icon_selected.png")
                                    : require("../assets/ai_match_icon_not_selected.png")
                            }
                            style={styles.icon}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    header: {
        width: "100%",
        height: 55, // Adjust the height as needed
        backgroundColor: "white",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingLeft: 10,
    },
    logoContainer: {
        width: 100, // Adjust the width as needed
        height: "100%", // Make sure the logoContainer fills the header vertically
    },
    icon: {
        width: 28,
        height: 28,
    },
});

export default BottomTabNav;
