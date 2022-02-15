import React, { useContext, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { AppContext } from '../../AppContext'
import { useNavigation } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import FeedScreen from '../Screens/Home/Feed/index'
import Chats from '../Screens/Home/Messages/Chats/index'
import { Text, View, TouchableOpacity, Pressable } from 'react-native'

const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default function HomeScreen() {
  const ctx = useContext(AppContext);
  return (
    <Drawer.Navigator drawerContent={()=>{
      return <Chats />
    }} screenOptions={{
      headerStyle: {
        backgroundColor: ctx.bgColor,
      },
      headerTitleStyle: {
        fontFamily: 'Poppins-Bold',
        color: ctx.textColor
      },
      headerTitleAlign: 'center',
      headerLeft: null,
      tabBarStyle: { backgroundColor: ctx.bgColor },
    }}>
      <Drawer.Screen name='Home Screens' component={Screens} />
    </Drawer.Navigator>
  )
}

function Screens() {
  const nav = useNavigation()
  const ctx = useContext(AppContext);
  const homeName = 'Feed'
  const exploreName = 'Explore'
  const profileName = 'Profile'
  useEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <View style={{ paddingRight: 10, flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
          <TouchableOpacity onPress={()=>nav.openDrawer()}>
            <FontAwesome name='envelope' color={ctx.textColor} size={25} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>nav.navigate("Home", { screen: "Home Screens", params: { screen: exploreName } })}>
            <FontAwesome name='search' color={ctx.textColor} size={25} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>nav.push("Settings")}>
            <SimpleLineIcons name='settings' color={ctx.textColor} size={25} />
          </TouchableOpacity>
        </View>
      )
    })
  }, [])
  return (
    <BottomTab.Navigator sceneContainerStyle={{
      backgroundColor: ctx.bgColor,
      color: ctx.textColor
    }} screenOptions={({ route }) => ({
      tabBarActiveTintColor: '#fe2c55',
      tabBarInactiveTintColor: '#2c3e50',
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let rn = route.name
        if (rn === homeName) {
          iconName = 'home'
          return <Ionicons name={iconName} size={30} color={color} />
        }
        else if (rn === exploreName) {
          iconName = 'search'
          return <Ionicons name={iconName} size={30} color={color} />
        }
        else if (rn === profileName) {
          iconName = 'person'
          return <Ionicons name={iconName} size={30} color={color} />
        }
      },
      tabBarShowLabel: false,
      headerShown: false,
    })}>
      <BottomTab.Group screenOptions={{
        headerStyle: {
          backgroundColor: ctx.bgColor,
        },
        headerTitleStyle: {
          fontFamily: 'Poppins-Bold',
          color: ctx.textColor
        },
        headerTitleAlign: 'center',
        headerLeft: null,
        tabBarStyle: { backgroundColor: ctx.bgColor },
      }}>
        <BottomTab.Screen options={{ title: 'Chacha' }} name={homeName} component={FeedScreen} />
        <BottomTab.Screen name={exploreName} children={() => (null)} />
        <BottomTab.Screen name={profileName} children={() => (null)} />
      </BottomTab.Group>
    </BottomTab.Navigator>
  )
}
