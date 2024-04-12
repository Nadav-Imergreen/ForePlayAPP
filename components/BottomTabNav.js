import { StyleSheet, Text, Image } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserInfoScreen, EditUserInfoScreene, HomeScreen, MatchesScreen, AiMatchesScreen } from "../screens";


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
    height: 50,
    backgroundColor: 'white',
  },
};



const BottomTabNav = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>

      <Tab.Screen
              name="Create"
              component={MatchesScreen}
              options={{
                tabBarIcon: ({ focused }) => {
                  return (
                    <Image source={require('../assets/matchs_icon.png')} style={styles.icon}/>
                  );
                },
              }}
            />
            
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Image source={require('../assets/chat_icon.png')} style={styles.icon}/>
            );
          },
        }}
      />

      <Tab.Screen
        name="UserInfoScreen"
        component={UserInfoScreen}
        options={{
          tabBarIcon: ({ focused }) => <Image source={require('../assets/profile_icon.png')} style={styles.icon}/>,
          unmountOnBlur: true, // Unmount UserInfoScreen on blur
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

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  }
});


export default BottomTabNav;