import { createContext, useEffect, useState } from "react";
import { useColorScheme } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";


export const AppContext = createContext();

export function AppProvider ({ children })  {
  const [token, setToken ] = useState()
  const rootTheme = useColorScheme()
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
  },[])
  const [scheme, setSchem] = useState(useColorScheme());
  const [language, setLanguage] = useState('English');
  const bgColor = scheme === 'dark' ? '#0d1216' : scheme === 'light' ? '#ededed' : scheme === 'color-blind' ? 'black' : 'white';
  const textColor = scheme === 'light' ? '#2c3e50' : scheme === 'dark' ? '#e6e3e3' : scheme === 'color-blind' ? 'orange' : 'white';
  const setScheme = (theme) => {
    console.log(theme, 31)
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
        token
      }}>
      {children}
    </AppContext.Provider>
  );
};
