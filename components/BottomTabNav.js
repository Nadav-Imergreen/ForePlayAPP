import { StyleSheet, Text, Image, ImageBackground, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserInfoScreen, EditUserInfoScreene, HomeScreen, MatchesScreen, AiMatchesScreen } from "../screens";

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
    backgroundColor: 'white',
  },
};

const CustomHeader = () => (
  <View style={styles.header}>
    <Image source={require('../assets/logo_small.png')} style={styles.logoContainer} resizeMode="contain"/>
  </View>
);

const BottomTabNav = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Create"
        component={MatchesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image source={focused ? require('../assets/matchs_icon_selected.png') : require('../assets/matchs_icon_not_selected.png')} style={styles.icon}/>
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image source={focused ? require('../assets/chat_icon_selected.png') : require('../assets/chat_icon_not_selected.png')} style={styles.icon}/>
          ),
        }}
      />
      <Tab.Screen
        name="UserInfoScreen"
        component={UserInfoScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image source={focused ? require('../assets/profile_icon_selected.png') : require('../assets/profile_icon_not_selected.png')} style={styles.icon}/>
          ),
          unmountOnBlur: true, // Unmount UserInfoScreen on blur
        }}
      />
      <Tab.Screen
        name="Profile"
        component={AiMatchesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image source={focused ? require('../assets/ai_match_icon_selected.png') : require('../assets/ai_match_icon_not_selected.png')} style={styles.icon}/>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 55, // Adjust the height as needed
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 10
  },
  logoContainer: {
    width: 100, // Adjust the width as needed
    height: '100%', // Make sure the logoContainer fills the header vertically
  },
  icon: {
    width: 28,
    height: 28,
  } 
});

export default BottomTabNav;