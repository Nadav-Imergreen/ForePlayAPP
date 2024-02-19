// import React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {Login, Register, Welcome} from './screens';
//
// const Stack = createNativeStackNavigator();
//
// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Welcome">
//         <Stack.Screen
//           name="Welcome"
//           component={Welcome}
//           options={{
//             headerShown: false,
//           }}
//         />
//         <Stack.Screen
//           name="Login"
//           component={Login}
//           options={{
//             headerShown: false,
//           }}
//         />
//         <Stack.Screen
//           name="Register"
//           component={Register}
//           options={{
//             headerShown: false,
//           }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './screens/loginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
// import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {app} from './services/config';

export default function App() {
  const Stack = createNativeStackNavigator();
  // const auth = getAuth(app);
  // const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
  // const onAuthStateChangedHandler = user => {
  //   setUser(user);
  //   if (initializing) {
  //     setInitializing(false);
  //   }
  // };

  // useEffect(() => {
  //   return onAuthStateChanged(auth, onAuthStateChangedHandler);
  // }, []);

  // if (initializing) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
