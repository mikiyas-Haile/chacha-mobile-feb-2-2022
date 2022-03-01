import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native'
import { AppContext } from '../../AppContext'
import { createStackNavigator } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
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
import EditPictureForDm from '../Screens/Home/EditPictureDm'
import ViewPicture, { AddMessage, ViewDetailedImage, ViewDetailedImagesList } from '../Screens/Home/ViewPicture'
import * as Notifications from 'expo-notifications';
import ViewProfile from '../Screens/Home/ViewProfile'

const Stack = createStackNavigator();

export default function MainScreen() {
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const notLogged = ctx.token === null
    const [navigationInit, setInnit] = useState('Home')
    const [otherUser, setOtherUser] = useState('')
    const [notice, setnotice] = useState('')
    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
          const url = response.notification.request.content.data;
          if (url.type) {
              const type = url.type;
              console.log(url.type, url.to_user, url.request_user)
              if (type === 'new_chat') {
                setOtherUser(url.request_user)
                setOtherUser("New Chat")
                setInnit("Room")
                nav.navigate("Room",{ otherUser: url.request_user })
              }
          }
        });
        return () => subscription.remove();
      }, []);

    const InitialRouteName = notLogged ? 'Landing' : navigationInit

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
                        <Stack.Screen options={{
                            title: 'chacha',
                            headerTitleStyle: {
                                fontFamily: 'Cursive',
                                color: ctx.textColor,
                                fontSize: 30
                            }, headerLeft: null
                        }} name='Landing' component={LandingPage} />
                        <Stack.Screen options={{ headerLeft: null }} name='Register' component={Signup} />
                        <Stack.Screen options={{ headerLeft: null }} name='Login' component={LoginScreen} />
                    </>}
                <Stack.Screen options={{ headerShown: false }} name='Home' component={HomeScreen} />
                <Stack.Screen options={{ title: 'Make a post' }} name='Publish Pictures' component={PublishPicture} />
                <Stack.Screen options={{ title: 'View Pictures' }} name='View My Pictures' component={ViewAllPicturesFromGallery} />
                <Stack.Screen initialParams={{ otherUser: otherUser }} name='Room' component={ChatRoom} />
                <Stack.Screen name='Contacts List' component={ContactList} />
                <Stack.Screen options={{ headerShown: false }} name='My Profile' component={YourProfile} />
                <Stack.Screen name='Verify Phone Number' component={VerifyPhoneNumber} />
                <Stack.Screen name='Change Phone Number' component={ChangePhoneNumber} />
                <Stack.Screen name='Change Full Name' component={ChangeFullName} />
                <Stack.Screen name='Change Bio' component={ChangeBio} />
                <Stack.Screen name='View Page' component={ViewLink} />
                <Stack.Screen name='Test' component={TestScreen} />
                <Stack.Screen name='TestAgain' component={TestScreenTwo} />
                <Stack.Screen options={{ headerShown: false }} name='Edit Picture' component={EditPictureForDm} />
                <Stack.Screen options={{ headerShown: false }} name='View Picture' component={ViewPicture} />
                <Stack.Screen options={{ headerShown: false }} name='View Pictures' component={ViewDetailedImagesList} />
                <Stack.Screen options={{ headerShown: false }} name='Add Message to your sharing Image' component={AddMessage} />
                <Stack.Screen options={{ headerShown: false }} name='View Detailed Image' component={ViewDetailedImage} />
                <Stack.Screen options={{ headerShown: false }} name='View Profile' component={ViewProfile} />
            </Stack.Group>
        </Stack.Navigator>
    )
}
