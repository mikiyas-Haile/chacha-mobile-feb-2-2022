import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native'
import { AppContext } from '../../AppContext'
import { createStackNavigator } from '@react-navigation/stack'
import LandingPage from '../Screens/Auth/Landing'
import Signup from '../Screens/Auth/Signup'
import LoginScreen from '../Screens/Auth/Login'
import HomeScreen from './Home';
import ChatRoom from '../Screens/Home/Messages/ChatRoom'
import { MainLookup } from '../Lookup';
import { PublishPicture, ViewAllPicturesFromGallery } from '../Screens/Home/Camera'
import YourProfile from '../Screens/Home/Profile'
import VerifyPhoneNumber from '../Screens/Home/Profile/Updating/VerifyPhoneNumber'
import ChangePhoneNumber from '../Screens/Home/Profile/Updating/ChangePhoneNumber'
import { ChangeFullName, ChangeBio } from '../Screens/Home/Profile/Updating/Main'
import { ContactList } from '../Screens/Home/Messages/Chats'
import ViewLink from '../Screens/Home/ViewWebsite'
import TestScreen, { TestScreenTwo } from '../../testScreen'

const Stack = createStackNavigator();

export default function MainScreen() {
    const ctx = useContext(AppContext);
    const notLogged = ctx.token === null
    const InitialRouteName = notLogged ? 'Landing' : 'Home'
    
    return (
        <Stack.Navigator
        initialRouteName={InitialRouteName}
        >
            <Stack.Group
                screenOptions={{
                    headerStyle: {
                        backgroundColor: ctx.bgColor,
                    },
                    headerTitleStyle: {
                        fontFamily: 'Poppins-Bold',
                        color: ctx.textColor
                    },
                    headerTitleAlign: 'center',
                    headerTintColor: ctx.textColor
                }}>
                {notLogged && 
                <>
                <Stack.Screen options={{ title: 'Chacha', headerLeft: null }} name='Landing' component={LandingPage} />
                <Stack.Screen options={{ headerLeft: null }} name='Register' component={Signup} />
                <Stack.Screen options={{ headerLeft: null }} name='Login' component={LoginScreen} />
                </>}
                <Stack.Screen options={{ headerShown: false }} name='Home' component={HomeScreen} />
                <Stack.Screen options={{ title: 'Make a post' }} name='Publish Pictures' component={PublishPicture} />
                <Stack.Screen options={{ title: 'View Pictures' }} name='View My Pictures' component={ViewAllPicturesFromGallery} />
                <Stack.Screen name='Room' component={ChatRoom} />
                <Stack.Screen name='Contacts List' component={ContactList} />
                <Stack.Screen name='My Profile' component={YourProfile} />
                <Stack.Screen name='Verify Phone Number' component={VerifyPhoneNumber} />
                <Stack.Screen name='Change Phone Number' component={ChangePhoneNumber} />
                <Stack.Screen name='Change Full Name' component={ChangeFullName} />
                <Stack.Screen name='Change Bio' component={ChangeBio} />
                <Stack.Screen name='View Page' component={ViewLink} />
                <Stack.Screen name='Test' component={TestScreen} />
                <Stack.Screen name='TestAgain' component={TestScreenTwo} />
            </Stack.Group>
        </Stack.Navigator>
    )
}
