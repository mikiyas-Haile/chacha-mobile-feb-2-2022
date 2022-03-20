import { useEffect, useState, useContext } from 'react';
import { Text, TouchableOpacity, View, TextInput, ActivityIndicator } from 'react-native'
import { MainLookup } from '../../../Lookup'
import { AppContext } from '../../../../AppContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { host } from '../../../Components/host'

const Stack = createStackNavigator();

export default function LoginScreen() {
    return (
        <Stack.Navigator initialRouteName='Login Email' screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name='Login Email' component={AddLoginEmail} />
            <Stack.Screen name='Login Password' component={AddLoginPassword} />
        </Stack.Navigator>
    )
}

function AddLoginEmail() {
    const ctx = useContext(AppContext);
    const [Email, setEmail] = useState()
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')
    const [SnackBarOpacity, setSnackBarOpacity] = useState(0)
    const nav = useNavigation();

    const CheckEmail = () => {
        if (Email) {
            setLoading(true)
            const cb = (r, c) => {
                console.log(r, c)
                setLoading(false)
                if (r.Taken) {
                    AsyncStorage.setItem("user_email", Email)
                    nav.push("Login Password", { Email: Email })
                } else if (r.approved) {
                    ctx.MyAlert("There is no user found with this Email.")
                    
                } else if (r.validation_error) {
                    ctx.MyAlert("Email is not valid. Please try again")
                    
                } else {
                    ctx.MyAlert("There was an error Please try again later.")
                    
                }
            }
            MainLookup(cb, { endpoint: `/api/check-email/${Email}`, method: 'GET' })
        }
    }
    return (
        <View style={{
            flex: 1,
            backgroundColor: ctx.bgColor,
            padding: 20,
            paddingTop: 50
        }}>
            <TextInput autoCapitalize='none' value={Email} onChangeText={val => (setEmail(val))}
                style={{
                    color: ctx.textColor,
                    fontFamily: 'Poppins-Regular',
                    fontSize: 25,
                }} placeholder={'Enter Email here'} placeholderTextColor={ctx.textColor} />
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor, marginTop: 30 }}>Enter the email address you registered using.</Text>
            {Email ?
                <TouchableOpacity onPress={CheckEmail} style={{
                    marginTop: 'auto',
                    padding: 5,
                    width: '90%',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: ctx.textColor,
                    borderRadius: 40
                }}>
                    <Text style={{
                        color: ctx.bgColor,
                        fontFamily: 'Poppins-Bold',
                        fontSize: 30
                    }}> {loading ? <ActivityIndicator size={'small'} color={ctx.bgColor} /> : 'Next'}</Text></TouchableOpacity> : null}

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
            ><Text style={{
                fontSize: 17,
                color: 'white',
                fontFamily: 'Poppins-Regular'
            }}>{msg}</Text></View> : null}
        </View>
    )
}


function AddLoginPassword(props) {
    const { Email } = props?.route?.params;
    const ctx = useContext(AppContext);
    const [Password, setPassword] = useState()
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')
    const [SnackBarOpacity, setSnackBarOpacity] = useState(0)
    const nav = useNavigation();
    const [CSRFToken, setCSRFTOKEN] = useState()
    useEffect(() => {
        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])
    const CheckPassword = () => {
        if (Password) {
            setLoading(true)
            const cb = (r, c) => {
                console.log(r, c)
                if (c === 200) {
                    if (r.key) {
                        const cbu = (r_, c_) => {
                            setLoading(false)
                            if (!c_ === 200 || !c_ === 201) {
                                AsyncStorage.removeItem("session_token")
                            } else {
                                // ctx.setCurrentUser(Email)
                                AsyncStorage.setItem('current_user_email', Email)
                                AsyncStorage.setItem('session_token', r.key)
                                
                                AsyncStorage.setItem("current_user_username", r.username)
                                AsyncStorage.setItem("request_user", JSON.stringify(r))
                                nav.reset({
                                    index: 0,
                                    routes: [{ name: 'Home' }],
                                })
                            }
                        }
                        MainLookup(cbu, { method: 'GET', endpoint: `/api/me` })
                    }
                } else if (c === 400) {
                    ctx.MyAlert("Password was incorrect.")
                    
                } else {
                    ctx.MyAlert("There was a problem. Please try again.")
                    
                }
            }
            MainLookup(cb, {
                endpoint: `/api/rest-auth/login/`,
                csrf: CSRFToken,
                method: 'POST',
                data: {
                    username: Email,
                    password: Password,
                    email: Email
                }
            })
        }
    }
    return (
        <View style={{
            flex: 1,
            backgroundColor: ctx.bgColor,
            padding: 20,
            paddingTop: 50
        }}>
            <TextInput autoCapitalize='none' value={Password} onChangeText={val => (setPassword(val))}
                style={{
                    color: ctx.textColor,
                    fontFamily: 'Poppins-Regular',
                    fontSize: 25,
                }} placeholder={'Enter Password here'} placeholderTextColor={ctx.textColor} secureTextEntry={true} />
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor, marginTop: 30 }}>Enter the Password address you registered using.</Text>
            {Password ?
                <TouchableOpacity onPress={CheckPassword} style={{
                    marginTop: 'auto',
                    padding: 5,
                    width: '90%',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: ctx.textColor,
                    borderRadius: 40
                }}>
                    <Text style={{
                        color: ctx.bgColor,
                        fontFamily: 'Poppins-Bold',
                        fontSize: 30
                    }}> {loading ? <ActivityIndicator size={'small'} color={ctx.bgColor} /> : 'Next'}</Text></TouchableOpacity> : null}

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
            ><Text style={{
                fontSize: 17,
                color: 'white',
                fontFamily: 'Poppins-Regular'
            }}>{msg}</Text></View> : null}
        </View>
    )
}