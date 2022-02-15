import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { MainLookup } from './src/Lookup'
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native'
import { AppProvider } from './AppContext';
import MainScreen from './src/Navigations'


function MainApp() {
  return (
    <NavigationContainer>
      <MainScreen />
    </NavigationContainer>
  )
}

function NotificationHandlerApp() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token)
      const cb = (r, c) => {
        console.log(r, c)
      }
      MainLookup(cb, { method: 'POST', endpoint: `/notification/add/token=${token}` })
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <MainApp />
  );
}


function FontsHandlerApp() {
  const [loaded] = useFonts({
    'Poppins-Bold': {
      uri: require('./assets/fonts/Poppins/Poppins-Bold.ttf'),
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
    'Poppins-Regular': {
      uri: require('./assets/fonts/Poppins/Poppins-Regular.ttf'),
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
export default function App() {

  return (
    <AppProvider>
      <FontsHandlerApp />
    </AppProvider>
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