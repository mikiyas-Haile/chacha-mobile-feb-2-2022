import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native'
import { AppContext } from '../../AppContext'
import { createStackNavigator } from '@react-navigation/stack'
import LandingPage from '../Screens/Auth/Landing'
import Signup from '../Screens/Auth/Signup'
import HomeScreen from './Home';

const Stack = createStackNavigator();

export default function MainScreen() {
    const ctx = useContext(AppContext);
    const InitialRouteName = ctx.token ? 'Home' : 'Landing'
    const loggedIn = !ctx.token === null
    return (
        <Stack.Navigator>
            <Stack.Group
                initialRouteName={InitialRouteName}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: ctx.bgColor,
                    },
                    headerTitleStyle: {
                        fontFamily: 'Poppins-Bold',
                        color: ctx.textColor
                    },
                    headerTitleAlign: 'center',
                    headerLeft: null,
                }}>
                {loggedIn && 
                <>
                <Stack.Screen options={{ title: 'Chacha' }} name='Landing' component={LandingPage} />
                <Stack.Screen name='Register' component={Signup} />
                </>}
                <Stack.Screen options={{ headerShown: false }} name='Home' component={HomeScreen} />
            </Stack.Group>
        </Stack.Navigator>
    )
}
