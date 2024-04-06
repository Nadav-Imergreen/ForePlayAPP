import { StyleSheet, Text, Platform } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { UserInfoScreen, EditUserInfoScreene, HomeScreen, MatchesScreen, AiMatchesScreen } from "../screens";

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: true,
  headerShown: false,
  tabBarHideOnKeyboard: true,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 60,
    backgroundColor: 'white',
  },
};



const BottomTabNav = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Text>HOME</Text>
            );
          },
        }}
      />

      <Tab.Screen
        name="UserInfoScreen"
        component={UserInfoScreen}
        options={{
          tabBarIcon: ({ focused }) => <Text>Profile</Text>,
          unmountOnBlur: true, // Unmount UserInfoScreen on blur
        }}
      />

      <Tab.Screen
        name="Create"
        component={MatchesScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Text>Find Match</Text>
            );
          },
        }}
      />

      <Tab.Screen
        name="Profile"
        component={AiMatchesScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Text>AI Match</Text>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};



export default BottomTabNav;