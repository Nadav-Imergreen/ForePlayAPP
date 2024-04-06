import { View, Text, Platform } from "react-native";
import React from "react";
import Icon from 'react-native-vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { EditProfile, HomeScreen, MatchesScreen, AiMatchesScreen } from "../screens";

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
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
        name="Messages"
        component={EditProfile}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Text>Edit profile</Text>
            );
          },
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