import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../../../AppContext'
import { View, Text, TextInput, TouchableOpacity, Button } from 'react-native'
import { MainLookup } from '../../../Lookup'
import { createStackNavigator } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { host } from '../../../Components/host'
import DateTimePicker from '@react-native-community/datetimepicker';


const Stack = createStackNavigator();

export default function Signup() {
    const [current_step, setCurrent_step] = useState('Add Email')
    const nav = useNavigation();
    useEffect(() => {
        const cb = (e, step) => {
            setCurrent_step(step)
            console.log(e, step)
            if (step === 'Finished' || step === null) {
                // nav.reset({
                //     index: 0,
                //     routes: [{ name: 'Add Email' }],
                // })
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
            <Stack.Screen name='Add Birth Date' component={AddBirthDate} />
        </Stack.Navigator>
    )
}

function AddEmail() {
    const ctx = useContext(AppContext)
    const [Email, setEmail] = useState('')
    const nav = useNavigation();
    const SubmitEmail = () => {
        if (Email) {
            const cb = (r, c) => {
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
            <TextInput autoCapitalize='none' value={Email} onChangeText={val => (setEmail(val))}
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
                    }}>Next</Text></TouchableOpacity> : null}

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
            const cb = (r, c) => {
                if (c === 200) {
                    nav.push('Add Password', { Username, Email })
                    AsyncStorage.setItem("Username", Username)
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

    const [msg, setMsg] = useState('')
    const [SnackBarOpacity, setSnackBarOpacity] = useState(0)
    return (
        <View style={{ flex: 1, backgroundColor: ctx.bgColor, color: ctx.textColor, padding: 30 }}>
            <TextInput autoCapitalize='none' value={Username} onChangeText={val => (setUsername(val))}
                style={{
                    color: ctx.textColor,
                    fontFamily: 'Poppins-Bold',
                    fontSize: 25,
                }} placeholder={'Enter Username here'} placeholderTextColor={ctx.textColor} />
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
                    }}>Next</Text></TouchableOpacity> : null}
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
            const cb = (r, c) => {
                console.log(r, c)
                if (c === 201) {
                    setMsg("Verification Code has been sent to your Email.")
                    setSnackBarOpacity(1)
                    setInterval(() => {
                        setSnackBarOpacity(0)
                        setMsg('')
                    }, 3000)
                    AsyncStorage.setItem('session_token', r.key)
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
    
    const [msg, setMsg] = useState('')
    const [SnackBarOpacity, setSnackBarOpacity] = useState(0)
    return (
        <View style={{ flex: 1, backgroundColor: ctx.bgColor, color: ctx.textColor, padding: 30 }}>
            <TextInput autoCapitalize='none' value={Password} onChangeText={val => (setPassword(val))}
                style={{
                    color: ctx.textColor,
                    fontFamily: 'Poppins-Bold',
                    fontSize: 25,
                }} placeholder={'Enter Password here'} placeholderTextColor={ctx.textColor} secureTextEntry={true} />
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
                    }}>Next</Text></TouchableOpacity> : null}
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor, marginTop: 30 }}>Password must be Combination of Letters & Numbers.</Text>
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor }}>Password must be atleast 8 characters long.</Text>
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
    const [CSRFToken, setCSRFTOKEN] = useState()
    useEffect(() => {
        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])
    const ctx = useContext(AppContext)
    const [Name, setName] = useState('')
    const nav = useNavigation();
    const SubmitName = () => {
        if (Name) {
            const cb = (r, c) => {
                if (c === 200) {
                    nav.push('Add Birth Date')
                    AsyncStorage.setItem("Name", Name)
                    AsyncStorage.setItem("current_step", 'Add Birth Date')
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
            <TextInput autoCapitalize='none' value={Name} onChangeText={val => (setName(val))}
                style={{
                    color: ctx.textColor,
                    fontFamily: 'Poppins-Bold',
                    fontSize: 25,
                }} placeholder={'Add your Name here'} placeholderTextColor={ctx.textColor} />
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
                    }}>Next</Text></TouchableOpacity> : null}
        </View>
    )
}
function AddBirthDate() {
    const ctx = useContext(AppContext);

    const [date, setDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('')
    const [show, setShow] = useState(false);
    const [CSRFToken, setCSRFTOKEN] = useState()
    useEffect(() => {
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
            const cb = (r, c) => {
                console.log(r, c)
                if (c === 200) {
                    AsyncStorage.setItem("current_step", 'Finished')
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
                }}>{formattedDate ? 'Change Birthday' : 'Add Birthday'}</Text></TouchableOpacity>
            {formattedDate ? <TouchableOpacity onPress={() => setShow(true)} style={{
                width: '90%',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: ctx.textColor,
                borderRadius: 5,
                marginTop: 30,
                padding: 10
            }}>
                <Text style={{
                    color: ctx.bgColor,
                    fontFamily: 'Poppins-Regular',
                    fontSize: 20
                }}>{formattedDate}</Text>
            </TouchableOpacity> : null}
            {show && <DateTimePicker
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
                    }}>Finish</Text></TouchableOpacity> : null}
        </View>
    );
}