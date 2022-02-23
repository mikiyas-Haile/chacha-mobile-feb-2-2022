import { createContext, useEffect, useState } from "react";
import { useColorScheme } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import { MainLookup } from "./src/Lookup";
import { useNavigation } from "@react-navigation/native";


export const AppContext = createContext();

export function AppProvider({ children }) {
  const [token, setToken] = useState()
  const [currentUser, setCurrentUser] = useState()
  const rootTheme = useColorScheme()
  const [requestUser, setRequestUser] = useState([])
  const nav = useNavigation()
  useEffect(() => {
    const themeCb = (e, r) => {
      if (!r) {
        AsyncStorage.setItem('theme', rootTheme)
      } else {
        setSchem(r)
      }
    }
    AsyncStorage.getItem('theme', themeCb)

    const cb = (e, r) => {
      setToken(r)
    }
    AsyncStorage.getItem("session_token", cb)
    const ucb = (e, r) => {
      console.log(r)
      setCurrentUser(r)
    }
    AsyncStorage.getItem("current_user_username", ucb)
  }, [])

  useEffect(() => {
    if (token) {
      const cb = (r, c) => {
        if (!c === 200 || !c === 201) {
          AsyncStorage.removeItem("session_token")
        } else {
          AsyncStorage.setItem("request_user", JSON.stringify(r))
          setCurrentUser(r)
        }
      }
      MainLookup(cb, { method: 'GET', endpoint: `/api/me` })
    }
  }, [token]);

  useEffect(() => {
    Notifications.getExpoPushTokenAsync().then(token => {
      const expoToken = (r, c) => {
        if (c === 500) {
          AsyncStorage.removeItem("session_token")
        }
      }
      MainLookup(expoToken, { method: 'GET', endpoint: `/api/notification/add/token=${token.data}` })
    })
  },[])
  const [scheme, setSchem] = useState(useColorScheme());
  const [language, setLanguage] = useState('English');
  const bgColor = scheme === 'dark' ? '#0d1216' : scheme === 'light' ? '#ededed' : scheme === 'color-blind' ? 'black' : 'white';
  const textColor = scheme === 'light' ? '#2c3e50' : scheme === 'dark' ? '#e6e3e3' : scheme === 'color-blind' ? 'orange' : 'white';
  const setScheme = (theme) => {
    setSchem(theme);
    AsyncStorage.setItem('theme', theme)
  }
  return (
    <AppContext.Provider
      value={{
        bgColor,
        textColor,
        setScheme,
        scheme,
        setLanguage,
        language,
        setToken,
        token,
        currentUser,
        setCurrentUser,
        requestUser
      }}>
      {children}
    </AppContext.Provider>
  );
};
