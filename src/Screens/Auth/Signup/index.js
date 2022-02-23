import React, { useState, useEffect, useContext, useRef } from 'react'
import { AppContext } from '../../../../AppContext'
import { View, Text, TextInput, TouchableOpacity, Button, ActivityIndicator } from 'react-native'
import { MainLookup } from '../../../Lookup'
import { createStackNavigator } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { host } from '../../../Components/host'
import DateTimePicker from '@react-native-community/datetimepicker';
import PhoneInput from "react-native-phone-number-input";
import { FlashMode } from 'expo-camera/build/Camera.types'

const Stack = createStackNavigator();

export default function Signup() {
    const [current_step, setCurrent_step] = useState('Add Email')
    const nav = useNavigation();
    useEffect(() => {
        const cb = (e, step) => {
            setCurrent_step(step)
            if (step === 'Finished' || step === null) {
            } else {
                nav.reset({
                    index: 0,
                    routes: [{ name: step }],
                })
            }
        }
        AsyncStorage.getItem('current_step', cb)
    }, [])
    return (
        <Stack.Navigator initialRouteName={current_step} screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name='Add Email' component={AddEmail} />
            <Stack.Screen name='Add Username' component={AddUsername} />
            <Stack.Screen name='Add Password' component={AddPassword} />
            <Stack.Screen name='Add Name' component={AddName} />
            <Stack.Screen name='Add Phone Number' component={AddPhone} />
            <Stack.Screen name='Verify Phone Number' component={VerifyPhoneNumber} />
            <Stack.Screen name='Add Birth Date' component={AddBirthDate} />
        </Stack.Navigator>
    )
}
function AddEmail() {
    const ctx = useContext(AppContext)
    const [Email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const nav = useNavigation();
    const SubmitEmail = () => {
        setLoading(true)
        if (Email) {
            const cb = (r, c) => {
            setLoading(false)
            if (c === 200) {
                    nav.push('Add Username', { Email: Email })
                    AsyncStorage.setItem("current_step", 'Add Username')
                    AsyncStorage.setItem("Email", Email)
                } else if (c === 400) {
                    setMsg('The email was Invalid Please try another one.')
                    setSnackBarOpacity(1)
                    setInterval(() => {
                        setSnackBarOpacity(0)
                        setMsg('')
                    }, 3000)
                } else {
                    setMsg('There is a user with this email')
                    setSnackBarOpacity(1)
                    setInterval(() => {
                        setSnackBarOpacity(0)
                        setMsg('')
                    }, 3000)
                }
            }
            MainLookup(cb, { endpoint: `/api/check-email/${Email}`, method: 'GET' })
        }
    }
    const [msg, setMsg] = useState('')
    const [SnackBarOpacity, setSnackBarOpacity] = useState(0)
    return (
        <View style={{ flex: 1, backgroundColor: ctx.bgColor, color: ctx.textColor, padding: 30 }}>
            <Text style={{
                fontSize: 15,
                fontFamily: 'Poppins-Regular',
                color: ctx.textColor,
                marginTop: 50
            }}>Email Address</Text>
            <TextInput autoFocus={true} autoCapitalize='none' value={Email} onChangeText={val => (setEmail(val))}
                style={{
                    color: ctx.textColor,
                    fontFamily: 'Poppins-Bold',
                    fontSize: 25,
                }} placeholder={'Enter Email here'} placeholderTextColor={'grey'} />
            {Email ?
                <TouchableOpacity onPress={SubmitEmail} style={{
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
                    }}>{loading ? <ActivityIndicator size={'small'} color={ctx.bgColor} /> : 'Next'}</Text></TouchableOpacity> : null}

            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor, marginTop: 30 }}>Supported providers are .gmail , .yahoo , .hotmail , .aol , .msn , .ymail.</Text>
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor }}>We will be sending you a verification code to your email.</Text>
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
function AddUsername(props) {
    const [msg, setMsg] = useState('')
    const [SnackBarOpacity, setSnackBarOpacity] = useState(0)
    const [loading, setLoading] = useState(false)
    const [Email, setEmail] = useState();
    useEffect(() => {
        const cb = (e, email) => {
            if (email === null || email === undefined) {
                setEmail(props.Email)
            } else {
                setEmail(email)
            }
        }
        AsyncStorage.getItem('Email', cb)
    }, [])
    const ctx = useContext(AppContext)
    const [Username, setUsername] = useState('')
    const nav = useNavigation();
    const SubmitUsername = () => {
        if (Username) {
            setLoading(true)
            const cb = (r, c) => {
                setLoading(false)
                if (c === 200) {
                    nav.push('Add Password', { Username: Username.toLowerCase(), Email })
                    AsyncStorage.setItem("Username", Username.toLowerCase())
                    AsyncStorage.setItem("current_step", 'Add Password')
                } else if (c === 400) {
                    setMsg("Username is invalid")
                    setSnackBarOpacity(1)
                    setInterval(() => {
                        setSnackBarOpacity(0)
                        setMsg('')
                    }, 3000)
                } else {
                    setMsg("User with this username exists")
                    setSnackBarOpacity(1)
                    setInterval(() => {
                        setSnackBarOpacity(0)
                        setMsg('')
                    }, 3000)
                }
            }
            MainLookup(cb, { endpoint: `/api/check-username/${Username.toLowerCase()}`, method: 'GET' })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: ctx.bgColor, color: ctx.textColor, padding: 30 }}>
            <Text style={{
                fontSize: 15,
                fontFamily: 'Poppins-Regular',
                color: ctx.textColor,
                marginTop: 50
            }}>Unique Username</Text>
            <TextInput autoCapitalize='none' value={Username} onChangeText={val => (setUsername(val))}
                style={{
                    color: ctx.textColor,
                    fontFamily: 'Poppins-Bold',
                    fontSize: 25,
                }} placeholder={'Enter Username here'} placeholderTextColor={ctx.textColor} />
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor, marginTop: 30 }}>Username must not contain special characters like -, !, /</Text>
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor, marginTop: 30 }}>Username must be on lowercase.</Text>
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor, marginTop: 30 }}>This is going to be your unique name and you can not change it later.</Text>

            {Username ?
                <TouchableOpacity onPress={SubmitUsername} style={{
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
function AddPassword(props) {
    const [Email, setEmail] = useState();
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const [SnackBarOpacity, setSnackBarOpacity] = useState(0)
    const [Username, setUsername] = useState();
    useEffect(() => {
        const cb = (e, email) => {
            if (email === null || email === undefined) {
                setEmail(props.Email)
            } else {
                setEmail(email)
            }
        }
        AsyncStorage.getItem('Email', cb)

        const ucb = (e, username) => {
            if (username === null || username === undefined) {
                setUsername(props.Username)
            } else {
                setUsername(username)
            }
        }
        AsyncStorage.getItem('Username', ucb)

    }, [])
    const [CSRFToken, setCSRFTOKEN] = useState()
    useEffect(() => {
        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])
    const ctx = useContext(AppContext)
    const [Password, setPassword] = useState('')
    const nav = useNavigation();
    const SubmitPassword = () => {
        if (Password.length > 8) {
            setLoading(true)
            const cb = (r, c) => {
                setLoading(false)
                if (c === 201) {
                    ctx.setCurrentUser(Username)
                    AsyncStorage.setItem('current_user_email', Email)
                    AsyncStorage.setItem('current_user_username', Username)
                    setMsg("Verification Code has been sent to your Email.")
                    setSnackBarOpacity(1)
                    setInterval(() => {
                        setSnackBarOpacity(0)
                        setMsg('')
                    }, 3000)
                    AsyncStorage.setItem('temp_token', r.key)
                    nav.push('Add Name', { Username, Email, Password, key: r.key })
                    AsyncStorage.setItem("current_step", 'Add Name')
                } else {

                }
            }
            MainLookup(cb, {
                csrf: CSRFToken, endpoint: `/api/rest-auth/registration/`, method: 'POST', data: {
                    email: Email,
                    username: Username,
                    password1: Password,
                    password2: Password,

                }
            })
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: ctx.bgColor, color: ctx.textColor, padding: 30 }}>
            <Text style={{
                fontSize: 15,
                fontFamily: 'Poppins-Regular',
                color: ctx.textColor,
                marginTop: 50
            }}>Security Password</Text>
            <TextInput autoCapitalize='none' value={Password} onChangeText={val => (setPassword(val))}
                style={{
                    color: ctx.textColor,
                    fontFamily: 'Poppins-Bold',
                    fontSize: 25,
                }} placeholder={'Enter Password here'} placeholderTextColor={ctx.textColor} secureTextEntry={true} />
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor, marginTop: 30 }}>Password must be Combination of Letters & Numbers.</Text>
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor }}>Password must be atleast 8 characters long.</Text>
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor }}>Password must not be similar to your Email or Username.</Text>
            {Password ?
                <TouchableOpacity onPress={SubmitPassword} style={{
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
function AddName(props) {
    const [key, setKey] = useState()
    const [CSRFToken, setCSRFTOKEN] = useState()
    useEffect(() => {
        const cb = (e, key) => {
            if (key === null || key === undefined) {
                setKey(props.key)
            } else {
                setKey(key)
            }
        }
        AsyncStorage.getItem('temp_key', cb)

        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])
    const [loading, setLoading] = useState(false)
    const ctx = useContext(AppContext)
    const [Name, setName] = useState('')
    const nav = useNavigation();
    const SubmitName = () => {
        if (Name) {
            setLoading(true)
            const cb = (r, c) => {
                setLoading(false)
                console.log(r, c)
                if (c === 200) {
                    nav.push('Add Phone Number', { key: key })
                    AsyncStorage.setItem("Name", Name)
                    AsyncStorage.setItem("current_step", 'Add Phone Number')
                }
            }
            MainLookup(cb, {
                csrf: CSRFToken, endpoint: `/api/update-profile`, method: 'PUT', data: {
                    display_name: Name,
                }
            })
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: ctx.bgColor, color: ctx.textColor, padding: 30 }}>
            <Text style={{
                fontSize: 15,
                fontFamily: 'Poppins-Regular',
                color: ctx.textColor,
                marginTop: 50
            }}>Full Name</Text>
            <TextInput autoCapitalize='none' value={Name} onChangeText={val => (setName(val))}
                style={{
                    color: ctx.textColor,
                    fontFamily: 'Poppins-Bold',
                    fontSize: 25,
                }} placeholder={'Enter name here'} placeholderTextColor={ctx.textColor} />
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor, marginTop: 30 }}>This is going to be your display name and you can change it later.</Text>
            {Name ?
                <TouchableOpacity onPress={SubmitName} style={{
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
        </View>
    )
}
function AddPhone(props) {
    const [key, setKey] = useState()
    const [CSRFToken, setCSRFTOKEN] = useState()
    const [loading, setLoading] = useState(false)
    const [PhoneNumber, setPhoneNumber] = useState('')
    const [Country, setCountry] = useState({
        cca2: 'ET',
        name: 'Ethiopia',

    })
    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const phoneInput = useRef(null);
    const [msg, setMsg] = useState('')
    const [SnackBarOpacity, setSnackBarOpacity] = useState(0)
    const MyAlert = (msg) => {
        setMsg(msg)
        setSnackBarOpacity(1)
        setTimeout(() => {
            setSnackBarOpacity(0)
            setMsg('')
        }, 5000)
    }
    useEffect(() => {
        const cb = (e, key) => {
            if (key === null || key === undefined) {
                setKey(props.key)
            } else {
                setKey(key)
            }
        }
        AsyncStorage.getItem('temp_key', cb)

        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])
    const ctx = useContext(AppContext)
    const nav = useNavigation();

    const SubmitPhoneNumber = () => {
        if (PhoneNumber) {
            setLoading(true)
            const cb = (r, c) => {
                if (c === 200) {
                    console.log(r, c, 474)
                    const Ccb = (r_, c_) => {
                        setLoading(false)
                        console.log(r_, c_, 468)
                        if (c_ === 200) {
                            setMsg('Code has been sent to your phone number')
                            setSnackBarOpacity(1)
                            setTimeout(() => {
                                setSnackBarOpacity(0)
                                setMsg('')

                                nav.push('Verify Phone Number', { key: key, PhoneNumber: PhoneNumber })
                                AsyncStorage.setItem("phone_number", PhoneNumber)
                                AsyncStorage.setItem("current_step", 'Verify Phone Number')
                            }, 5000)
                        } else {
                            MyAlert('There was an error trying to send. Please try again')
                        }
                    }
                    MainLookup(Ccb, { endpoint: `/api/send-code/${Country.name}/${Country.cca2}/`, method: 'GET' })
                }
            }
            MainLookup(cb, {
                csrf: CSRFToken, endpoint: `/api/update-profile`, method: 'PUT', data: {
                    phone_number: PhoneNumber,
                }
            })
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: ctx.bgColor, color: ctx.textColor, padding: 30 }}>
            <Text style={{
                fontSize: 15,
                fontFamily: 'Poppins-Regular',
                color: ctx.textColor,
                marginTop: 50
            }}>Phone Number</Text>
            <PhoneInput
                ref={phoneInput}
                defaultValue={value}
                defaultCode="ET"
                layout="first"
                onChangeText={(text) => {
                    // console.log(text)
                    setValue(text);
                }}
                onChangeFormattedText={(text) => {
                    console.log("Phone Number: ", text)
                    setFormattedValue(text);
                    setPhoneNumber(text)
                }}
                withDarkTheme={ctx.scheme === 'dark'}
                withShadow
                autoFocus
                onChangeCountry={(country) => {
                    console.log("Country: ", country)
                    setCountry(country)
                }}
            />
            {PhoneNumber ?
                <TouchableOpacity onPress={SubmitPhoneNumber} style={{
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
function VerifyPhoneNumber(props) {
    const [msg, setMsg] = useState('')
    const [SnackBarOpacity, setSnackBarOpacity] = useState(0)
    const [loading, setLoading] = useState(false)
    const [PhoneNumber, setPhoneNumber] = useState();
    useEffect(() => {
        const cb = (e, phoneNumber) => {
            if (phoneNumber === null || phoneNumber === undefined) {
                setPhoneNumber(props.phoneNumber)
            } else {
                setPhoneNumber(phoneNumber)
            }
        }
        AsyncStorage.getItem('phone_number', cb)
    }, [])
    const ctx = useContext(AppContext)
    const [Code, setCode] = useState('')
    const nav = useNavigation();
    const SubmitCode = () => {
        if (Code) {
            setLoading(true)
            const cb = (r, c) => {
                setLoading(false)
                console.log(r, c)
                if (c === 201 || c === 200) {
                    setMsg("Phone Number is Successfully verified.")
                    setSnackBarOpacity(1)
                    setTimeout(() => {
                        setSnackBarOpacity(0)
                        setMsg('')
                    }, 3000)
                    nav.push('Add Birth Date', { PhoneNumber })
                    AsyncStorage.setItem("current_step", 'Add Birth Date')
                } else if (c === 400) {
                    setMsg("Code is invalid try again later")
                    setSnackBarOpacity(1)
                    setTimeout(() => {
                        setSnackBarOpacity(0)
                        setMsg('')
                        nav.push('Add Birth Date', { PhoneNumber })
                        AsyncStorage.setItem("current_step", 'Add Birth Date')
                    }, 3000)
                } else {
                    setMsg("There was an error trying to verify your number")
                    setSnackBarOpacity(1)
                    setTimeout(() => {
                        setSnackBarOpacity(0)
                        setMsg('')
                        nav.push('Add Birth Date', { PhoneNumber })
                        AsyncStorage.setItem("current_step", 'Add Birth Date')
                    }, 3000)
                }
            }
            MainLookup(cb, { endpoint: `/api/verify-number/${Code}`, method: 'GET' })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: ctx.bgColor, color: ctx.textColor, padding: 30 }}>
            <Text style={{
                fontSize: 15,
                fontFamily: 'Poppins-Regular',
                color: ctx.textColor,
                marginTop: 50
            }}>Enter code you received.</Text>
            <TextInput secureTextEntry={true} keyboardType='number-pad' autoCapitalize='none' value={Code} onChangeText={val => (setCode(val))}
                style={{
                    color: ctx.textColor,
                    fontFamily: 'Poppins-Bold',
                    fontSize: 25,
                }} placeholder={'Enter Code here'} placeholderTextColor={ctx.textColor} />
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor, marginTop: 30 }}>Check your sms to get your code.</Text>
            {Code ?
                <TouchableOpacity onPress={SubmitCode} style={{
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
function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
function AddBirthDate(props) {
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const [date, setDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('')
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false);
    const [key, setKey] = useState()
    const [CSRFToken, setCSRFTOKEN] = useState()
    useEffect(() => {
        const cb = (e, key) => {
            if (key === null || key === undefined) {
                setKey(props.key)
            } else {
                setKey(key)
            }
        }
        AsyncStorage.getItem('temp_key', cb)

        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        const dd = String(currentDate).split(' ').slice(0, 4).join(' ')
        setDate(currentDate);
        setFormattedDate(dd);
        setShow(false);
    };
    const SubmitDate = () => {
        if (formattedDate) {
            setLoading(true)
            const cb = (r, c) => {
                setLoading(false)
                console.log(r, c)
                if (c === 200) {
                    AsyncStorage.setItem("current_step", 'Finished')
                    AsyncStorage.setItem("session_key", key)
                    nav.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    })
                }
            }
            MainLookup(cb, {
                csrf: CSRFToken, endpoint: `/api/update-profile`, method: 'PUT', data: {
                    birthday: formattedDate,
                }
            })
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: ctx.bgColor, color: ctx.textColor, padding: 30 }}>
            <TouchableOpacity onPress={() => setShow(true)} style={{
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
                }}>{formattedDate ? 'Change Birthday' : 'Add Birthday'}</Text>
            </TouchableOpacity>
            {formattedDate ?
                <TouchableOpacity onPress={() => setShow(true)} style={{
                    width: '90%',
                    alignSelf: 'center',
                    borderColor: "#2c3e50",
                    borderWidth: 1,
                    borderRadius: 5,
                    marginTop: 30,
                    padding: 10,
                    textAlign: 'left'
                }}>
                    <Text style={{
                        color: ctx.textColor,
                        fontFamily: 'Poppins-Regular',
                        fontSize: 20,
                        marginBottom: 5
                    }}>You are {getAge(date)} years old.</Text>
                    <Text style={{
                        color: ctx.textColor,
                        fontFamily: 'Poppins-Regular',
                        fontSize: 20
                    }}>Selected date is {formattedDate}.</Text>
                </TouchableOpacity> : null}
            {show &&
                <DateTimePicker
                    value={date}
                    mode={'date'}
                    display="calendar"
                    onChange={onChange}
                />}
            {formattedDate ?
                <TouchableOpacity onPress={SubmitDate} style={{
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
                    }}> {loading ? <ActivityIndicator size={'small'} color={ctx.bgColor} /> : 'Finish'}</Text></TouchableOpacity> : null}
        </View>
    );
}