import { createContext, useEffect, useState } from "react";
import { useColorScheme, View, Dimensions, Text } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import { MainLookup } from "./src/Lookup";
import { useNavigation } from "@react-navigation/native";
import * as Progress from 'react-native-progress';
import UploadImage from "./src/Components/UploadImage";
import { host } from "./src/Components/host";

const { width, height } = Dimensions.get("window")

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
  }, [])
  const [scheme, setSchem] = useState(useColorScheme());
  const [ScreenIsLoading, setScreenIsLoading] = useState(false)
  const [language, setLanguage] = useState('English');
  const bgColor = scheme === 'dark' ? '#0d1216' : scheme === 'light' ? '#ededed' : scheme === 'color-blind' ? 'black' : 'white';
  const textColor = scheme === 'light' ? '#2c3e50' : scheme === 'dark' ? '#e6e3e3' : scheme === 'color-blind' ? 'orange' : 'white';
  const setScheme = (theme) => {
    setSchem(theme);
    AsyncStorage.setItem('theme', theme)
  }
  const [CSRFToken, setCSRFTOKEN] = useState()
  // FETCH CSRFTOKEN
  useEffect(() => {
    fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
      .then(data => data.json())
      .then(data => { setCSRFTOKEN(data.csrf) })
      .catch(error => console.log(error))
  }, [])
  const [msg, setMsg] = useState('')
  const [SnackBarOpacity, setSnackBarOpacity] = useState(0)
  const MyAlert = (msg) => {
    setMsg(msg)
    setSnackBarOpacity(1)
    setTimeout(() => {
      setSnackBarOpacity(0)
      setMsg('')
    }, 3000)
  }
  const BackgroundFunction = (uri, callback) => {
    callback(1)
    console.log(uri)
    MyAlert("Your post will appear shortly.")
    setScreenIsLoading(true)
    const PictureUploadedHandlers = (r_, c_) => {
      if (c_ === 201) {
        const cb = (r, c) => {
          setCurrentUser(r.author.username)
          AsyncStorage.setItem('current_user_username', r.author.username)
          AsyncStorage.setItem('current_user_email', r.author.email)
          setScreenIsLoading(false)
          if (c === 201) {
            // MyAlert('Post was made successfully')
            MyAlert("Post has been made successfully.")
          } else {
            alert('There was an error trying to make post Please try again')
          }
        }
        MainLookup(cb, {
          endpoint: `/api/post/create`, data: {
            body: '',
            atts: [{ type: "img", file: r_ }]
          }, method: 'POST', csrf: CSRFToken
        })
      }
    }
    UploadImage(`images/${uri.split('/').slice(-1)}`, uri, PictureUploadedHandlers, 1)
  }
  const [uploadedPfpImage, setPfp] = useState()
  const PostAddPfp = (img) => {
    const cb = (r, c) => {
      setScreenIsLoading(false)
      if (c === 201) {
        setCurrentUser(r.username)
        AsyncStorage.setItem('current_user_username', r.username)
        AsyncStorage.setItem('current_user_email', r.email)
        // MyAlert('Post was made successfully')
        MyAlert("Profile updated sucessfully")
      } else {
        MyAlert('There was an error trying to update Please try again')
      }
    }
    MainLookup(cb, {
      endpoint: `/api/add-pfp`, data: {
        type: "img",
        file: img
      }, method: 'POST', csrf: CSRFToken
    })
  }
  const AddPfp = (uri, callback) => {
    let image;
    callback(1)
    setScreenIsLoading(true)
    if (image || uploadedPfpImage) {
      PostAddPfp(image ? image : uploadedPfpImage)
    } else {
      const PictureUploadedHandlers = (r_, c_) => {
        if (c_ === 201) {
          setPfp(r_)
          image = r_
          PostAddPfp(r_)
        }
      }
      UploadImage(`pfps/${uri.split('/').slice(-1)}`, uri, PictureUploadedHandlers, 1)
    }
  }
  const Post = (body, callback) => {
    const cb = (r, c) => {
      setCurrentUser(r.author.username)
      AsyncStorage.setItem('current_user_username', r.author.username)
      AsyncStorage.setItem('current_user_email', r.author.email)
      setScreenIsLoading(false)
      if (c === 201) {
        MyAlert("Post has been made successfully.")
      } else {
        alert('There was an error trying to make post Please try again')
      }
    }
    MainLookup(cb, {
      endpoint: `/api/post/create`, data: {
        body: body,
      }, method: 'POST', csrf: CSRFToken
    })
  }
  return (
    <AppContext.Provider
      value={{
        MyAlert,
        Post,
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
        requestUser,
        ScreenIsLoading,
        setScreenIsLoading,
        BackgroundFunction,
        AddPfp
      }}>
      {ScreenIsLoading && <Progress.Bar color={'#fe2c55'} indeterminate={ScreenIsLoading} progress={.5} width={width} />}
      {children}
      {msg ? <View id="snackbar"
        style={{
          opacity: SnackBarOpacity,
          backgroundColor: '#333',
          textAlign: 'center',
          borderRadius: 10,
          padding: 10,
          position: 'absolute',
          bottom: 20,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
      >
        <Text style={{
          fontSize: 15,
          color: 'white',
          fontFamily: 'Poppins-Regular'
        }}>{msg}</Text></View> : null}
    </AppContext.Provider>
  );
};
