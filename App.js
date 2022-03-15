import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Platform, Text, ToastAndroid } from 'react-native';
import { MainLookup } from './src/Lookup'
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading';
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { AppProvider, AppContext } from './AppContext';
import MainScreen from './src/Navigations'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from "firebase";
import * as Linking from 'expo-linking'

const prefix = Linking.createURL('/', 'https://african-chacha.herokuapp.com')

Notifications.setNotificationCategoryAsync('new_chat', [
  {
    actionId: 'Reply',
    buttonTitle: 'Reply',
    textInput: { submitButtonTitle: 'Reply', placeholder: 'Type Something' },
    isAuthenticationRequired: false,
  },
])

const firebaseConfig = {
  apiKey: "AIzaSyAerzaWKI8hibbhcbM-cGAsDlscudXELCs",
  authDomain: "pyd-storage.firebaseapp.com",
  projectId: "pyd-storage",
  storageBucket: "pyd-storage.appspot.com",
  messagingSenderId: "1098978740625",
  appId: "1:1098978740625:web:feda32b40bfa45c4a63230"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
function MainApp() {

  return (
    <MainScreen />
  )
}

function NotificationHandlerApp() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const ctx = useContext(AppContext);
  const nav = useNavigation()
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const type = response.notification.request.content.categoryIdentifier

      if (type === 'new_chat') {
        const body = response.userText
        const first = response.notification.request.content.data.request_user
        const second = response.notification.request.content.data.to_user
        let room = first + '-' + second
        const cb = (r, c) => {
          console.log(r, c)
          if (!c === 201) {
            ToastAndroid.show("Was unable to send chat.", 20)
          }
        }
        MainLookup(cb, { endpoint: `/api/chat/${room}/quick/${body}`, method: 'GET' })
      }
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token)
      if (ctx.token) {
        const cb = (r, c) => {
          if (c === 500) {
            AsyncStorage.removeItem("session_token")
          }
        }
        MainLookup(cb, { method: 'GET', endpoint: `/api/notification/add/token=${token}` })
      }
    }, [expoPushToken, ctx.token]);

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <>
      <MainApp />
    </>
  );
}


function FontsHandlerApp() {
  const [loaded] = useFonts({
    'Poppins-Bold': {
      uri: require('./assets/fonts/Poppins/Poppins-Bold.ttf'),
    },
    'Poppins-Black': {
      uri: require('./assets/fonts/Poppins/Poppins-Black.ttf'),
    },
    'Bold': {
      uri: require('./assets/fonts/Poppins/Poppins-Bold.ttf'),
    },
    'Poppins-Regular': {
      uri: require('./assets/fonts/Poppins/Poppins-Regular.ttf'),
    },
    'Poppins-Light': {
      uri: require('./assets/fonts/Poppins/Poppins-Light.ttf'),
    },
    'Poppins-ExtraLight': {
      uri: require('./assets/fonts/Poppins/Poppins-ExtraLight.ttf'),
    },
    'Poppins-MediumItalic': {
      uri: require('./assets/fonts/Poppins/Poppins-MediumItalic.ttf'),
    },
    'Poppins-Medium': {
      uri: require('./assets/fonts/Poppins/Poppins-Medium.ttf'),
    },
    'Inter-Regular': {
      uri: require('./assets/fonts/Inter/Inter-Regular.ttf'),
    },
    'Inter-Medium': {
      uri: require('./assets/fonts/Inter/Inter-Medium.ttf'),
    },
    'Inter-Black': {
      uri: require('./assets/fonts/Inter/Inter-Black.ttf'),
    },
    'Inter-Bold': {
      uri: require('./assets/fonts/Inter/Inter-Bold.ttf'),
    },
    'Inter-Light': {
      uri: require('./assets/fonts/Inter/Inter-Light.ttf'),
    },
    'Inter-SemiBold': {
      uri: require('./assets/fonts/Inter/Inter-SemiBold.ttf'),
    },
    'Cursive': {
      uri: require('./assets/fonts/Rochester-Regular.ttf'),
    },
    'Caviar-Bold': {
      uri: require('./assets/fonts/Caviar-Dreams/Caviar_Dreams_Bold.ttf'),
    },
    'Caviar-Bold-Italic': {
      uri: require('./assets/fonts/Caviar-Dreams/CaviarDreams_BoldItalic.ttf'),
    },
    'Caviar-Italic': {
      uri: require('./assets/fonts/Caviar-Dreams/CaviarDreams_Italic.ttf'),
    },
    'Caviar': {
      uri: require('./assets/fonts/Caviar-Dreams/CaviarDreams.ttf'),
    },
    'NotoSerifEthiopic-Black' : {
      uri: require('./assets/fonts/NotoSerifEthiopic/NotoSerifEthiopic-Black.ttf')
    },
    'NotoSerifEthiopic-Medium' : {
      uri: require('./assets/fonts/NotoSerifEthiopic/NotoSerifEthiopic-Medium.ttf')
    },
    'NotoSerifEthiopic-Light' : {
      uri: require('./assets/fonts/NotoSerifEthiopic/NotoSerifEthiopic-Light.ttf')
    },
    'NotoSerifEthiopic-Regular' : {
      uri: require('./assets/fonts/NotoSerifEthiopic/NotoSerifEthiopic-Regular.ttf')
    },
  })
  if (loaded) {
    return (
      <NotificationHandlerApp />
    )
  } else {
    return (
      <AppLoading />
    )
  }
}

function LinkingHandlerApp() {

}
export default function App() {
  const [data, setData] = useState(null);

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Home: 'Home',
        Landing: 'Landing',
        Feed: 'Feed',
        Test: 'test',
        TestAgain: 'test-two',
      }
    }
  }

  function handler(e) {
    let data = Linking.parse(e.url);
    setData(data);
  }

  useEffect(() => {

    async function getInitialUrl() {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) setData(Linking.parse(initialUrl))
    }

    Linking.addEventListener('url', handler)
    if (!data) {
      getInitialUrl();
    }

    return () => {
      Linking.removeEventListener("url")
    }

  }, [])


  return (
    <NavigationContainer linking={linking}>
      <AppProvider>
        {/* <Text style={{
          padding: 20,
          color: 'red',
          backgroundColor: 'green'
        }}>{data ? JSON.stringify(data) : 'App not opened from url'}</Text> */}
        <FontsHandlerApp />
      </AppProvider>
    </NavigationContainer>
  )
}


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}
