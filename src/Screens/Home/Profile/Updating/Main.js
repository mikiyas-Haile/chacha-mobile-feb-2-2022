import React, { useState, useEffect, useContext, useRef } from 'react'
import { AppContext } from '../../../../../AppContext'
import { View, Text, TextInput, TouchableOpacity, Button, ActivityIndicator } from 'react-native'
import { MainLookup } from '../../../../Lookup'
import { createStackNavigator } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { host } from '../../../../Components/host'
import DateTimePicker from '@react-native-community/datetimepicker';
import PhoneInput from "react-native-phone-number-input";


export function ChangeFullName(props) {
    const [msg, setMsg] = useState('')
    const [SnackBarOpacity, setSnackBarOpacity] = useState(0)
    const ctx = useContext(AppContext)
    const [FullName, setFullName] = useState('')
    const nav = useNavigation();
    const [CSRFToken, setCSRFTOKEN] = useState()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])
    const SubmitFullName = () => {
        setLoading(true)
        if (FullName) {
            const cb = (r, c) => {
                console.log(r, c)
                setLoading(false)
                if (c === 200) {
                    setMsg("Sucessfully Updated Name")
                    setSnackBarOpacity(1)
                    setTimeout(() => {
                        setSnackBarOpacity(0)
                        setMsg('')
                        nav.push('Home')
                    }, 3000)
                } else {
                    setMsg("There was an error trying to update your name.")
                    setSnackBarOpacity(1)
                    setTimeout(() => {
                        setSnackBarOpacity(0)
                        setMsg('')
                    }, 3000)
                }
            }
            MainLookup(cb, {
                csrf: CSRFToken, endpoint: `/api/update-profile`, method: 'PUT', data: {
                    display_name: FullName
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
            }}>Full name</Text>
            <TextInput autoCapitalize='none' value={FullName} onChangeText={val => (setFullName(val))}
                style={{
                    color: ctx.textColor,
                    fontFamily: 'Poppins-Bold',
                    fontSize: 25,
                }} placeholder={'Enter Name here'} placeholderTextColor={ctx.textColor} />
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor, marginTop: 30 }}>This will be your display name</Text>
            {FullName ?
                <TouchableOpacity onPress={SubmitFullName} style={{
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
                    }}>{loading ? <ActivityIndicator size={'large'} color={ctx.bgColor} /> : 'Next'}</Text></TouchableOpacity> : null}
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

export function ChangeBio(props) {
    const [msg, setMsg] = useState('')
    const [SnackBarOpacity, setSnackBarOpacity] = useState(0)
    const ctx = useContext(AppContext)
    const [Bio, setBio] = useState('')
    const nav = useNavigation();
    const [CSRFToken, setCSRFTOKEN] = useState()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])
    const SubmitBio = () => {
        setLoading(true)
        if (Bio) {
            const cb = (r, c) => {
                console.log(r, c)
                setLoading(false)
                if (c === 200) {
                    setMsg("Sucessfully Updated Bio")
                    setSnackBarOpacity(1)
                    setTimeout(() => {
                        setSnackBarOpacity(0)
                        setMsg('')
                        nav.push('Home')
                    }, 3000)
                } else {
                    setMsg("There was an error trying to update your Bio.")
                    setSnackBarOpacity(1)
                    setTimeout(() => {
                        setSnackBarOpacity(0)
                        setMsg('')
                    }, 3000)
                }
            }
            MainLookup(cb, {
                csrf: CSRFToken, endpoint: `/api/update-profile`, method: 'PUT', data: {
                    bio: Bio
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
            }}>Add your Bio</Text>
            <TextInput multiline autoCapitalize='none' value={Bio} onChangeText={val => (setBio(val))}
                style={{
                    color: ctx.textColor,
                    fontFamily: 'Poppins-Bold',
                    fontSize: 25,
                }} placeholder={'Enter Bio here'} placeholderTextColor={ctx.textColor} />
            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor, marginTop: 30 }}>This will be your display name</Text>
            {Bio ?
                <TouchableOpacity onPress={SubmitBio} style={{
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
                    }}>{loading ? <ActivityIndicator size={'large'} color={ctx.bgColor} /> : 'Next'}</Text></TouchableOpacity> : null}
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