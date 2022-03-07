import React, { useContext, useEffect, useState } from 'react';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { AppContext } from '../../AppContext'
import { useNavigation } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import FeedScreen from '../Screens/Home/Feed/index'
import Chats from '../Screens/Home/Messages/Chats/index'
import { Text, View, TouchableOpacity, Pressable, Image } from 'react-native'
import { MainLookup } from '../Lookup'
import AddScreen from '../Screens/Home/Camera'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapScreen from '../Screens/Home/Map'
import { TranslateApi } from '../Components/Translate'


const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default function HomeScreen() {
  const ctx = useContext(AppContext);
  return (
    <Screens />
  )
}

function Screens() {
  const nav = useNavigation()
  const ctx = useContext(AppContext);
  const homeName = 'Feed'
  const createName = 'Create'
  const profileName = 'Chat'
  const globalName = 'Global'
  const [user, setUser] = useState([])
  const fetchUser = () => {
    const cb = (r, c) => {
      if (!c === 200 || !c === 201) {
        AsyncStorage.removeItem("session_token")
      } else {
        setUser(r)
        AsyncStorage.setItem("current_user_username", r.username)
        AsyncStorage.setItem("request_user", JSON.stringify(r))
      }
    }
    MainLookup(cb, { method: 'GET', endpoint: `/api/me` })
  }
  useEffect(() => {
    if (ctx.token) {

      const Rcb = (e__, r__) => {
        let user = JSON.parse(r__);
        if (!user === null | !user === undefined) {
          setUser(r__)
        } else {
          fetchUser();
        }
      }
      AsyncStorage.getItem('request_user', Rcb)
    }
  }, [ctx.token]);

  return (
    <BottomTab.Navigator initialRouteName={createName} sceneContainerStyle={{
      backgroundColor: ctx.bgColor,
      color: ctx.textColor
    }} screenOptions={({ route }) => ({
      tabBarActiveTintColor: ctx.scheme === 'dark' ? 'lightgrey' : '#fe2c55',
      tabBarInactiveTintColor: '#2c3e50',
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let rn = route.name
        if (rn === homeName) {
          iconName = !focused ? 'ios-home-outline' : 'home'
          return <Ionicons name={iconName} size={30} color={color} />
        }
        else if (rn === createName) {
          iconName = !focused ? 'ios-camera-outline' : 'camera'
          return <Ionicons name={iconName} size={30} color={color} />
        }
        else if (rn === profileName) {
          iconName = 'envelope'
          return focused ? <FontAwesome name={iconName} size={25} color={color} /> : <EvilIcons name={iconName} size={35} color={color} />
        }
        else if (rn === globalName) {
          iconName = 'location'
          return focused ? <Ionicons name={iconName} size={25} color={color} /> : <Ionicons name={iconName} size={35} color={color} />
        }
      },
      tabBarShowLabel: false,
    })}>
      <BottomTab.Group screenOptions={{
        headerStyle: {
          backgroundColor: ctx.bgColor,
          borderBottomWidth: 5,
          borderColor: "#2c3e50"
        },
        headerTitleStyle: {
          fontFamily: 'Poppins-Bold',
          color: ctx.textColor
        },
        headerTitleAlign: 'center',
        tabBarStyle: { backgroundColor: ctx.bgColor },
        headerLeft: () => (
          <>
            <TouchableOpacity style={{
              paddingHorizontal: 20
            }} onPress={() => nav.push('My Profile')}>
              <Image style={{ height: 30, width: 30, borderRadius: 100 }} source={{ uri: user.pfp ? user.pfp : ctx.requestUser.pfp }} />
            </TouchableOpacity>
          </>
        )
      }}>
        <BottomTab.Screen options={{
          title: 'chat',
          headerTitleStyle: {
            fontFamily: 'Cursive',
            color: ctx.textColor,
            fontSize: 30
          },
        }} name={profileName} component={Chats} />
        {/* <BottomTab.Screen name={globalName} component={MapScreen} /> */}
        <BottomTab.Screen options={{ headerShown: false }} name={createName} component={AddScreen} />
        <BottomTab.Screen options={{
          title: 'chacha',
          headerTitleStyle: {
            fontFamily: 'Cursive',
            color: ctx.textColor,
            fontSize: 30
          },
        }} name={homeName} component={FeedScreen} />
      </BottomTab.Group>
    </BottomTab.Navigator>
  )
}
