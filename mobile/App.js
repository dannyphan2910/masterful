/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useReducer, useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import AsyncStorage from '@react-native-community/async-storage';

import Home from './components/Home';
import Login from './components/authentication/Login';
import { initialState, reducer, AuthContext } from './context/auth';
import LearnerDashboard from './components/LearnerDashboard';
import CoursePage from './components/course/CoursePage';
import Profile from './components/course/Profile';
import Register from './components/authentication/Register';
import MasterDashboard from './components/MasterDashboard';
import Conference from './components/course/Conference';

const App: () => React$Node = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    var getUser = async () => {
      try {
        var user = await AsyncStorage.getItem('user');
        user = JSON.parse(user)

        if (user) {
          dispatch({
            type: 'LOGIN',
            payload: user
          })
        }
      } catch (e) {
         
        return null
      }
    }

    getUser()
  }, []);

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#FFF'
    },
  };

  enableScreens();
  const Stack = createNativeStackNavigator();

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home" lazy>
          <Stack.Screen name="Home" component={Home} />
          {!state.isLoggedIn &&
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
            </>
          }
          {state.isLoggedIn &&
            <>
              <Stack.Screen name="Learner Dashboard" component={LearnerDashboard} />
              <Stack.Screen name="Master Dashboard" component={MasterDashboard} />
              <Stack.Screen name="Course" component={CoursePage} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Conference" component={Conference} />
            </>
          }
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
export default App;
