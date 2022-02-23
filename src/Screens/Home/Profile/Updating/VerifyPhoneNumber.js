import React, { useState, useEffect, useContext, useRef } from 'react'
import { AppContext } from '../../../../../AppContext'
import { View, Text, TextInput, TouchableOpacity, Button, ActivityIndicator } from 'react-native'
import { MainLookup } from '../../../../Lookup'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function VerifyPhoneNumber(props) {
    const [msg, setMsg] = useState('')
    const [SnackBarOpacity, setSnackBarOpacity] = useState(0)
    const [PhoneNumber, setPhoneNumber] = useState();

    const [loading, setLoading] = useState(false)
    const [Tried, setTried] = useState(false)

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
        setLoading(true)
        setTried(false)
        if (Code) {
            const cb = (r, c) => {
                setLoading(false)
                console.log(r, c)
                if (c === 201 || c === 200) {
                    setMsg("Phone is Successfully verified.")
                    setSnackBarOpacity(1)
                    setTimeout(() => {
                        setSnackBarOpacity(0)
                        setMsg('')
                        nav.push('Home')
                    }, 3000)

                } else {
                    setTried(true)
                    if (c === 400) {
                        setMsg("Code is invalid or has expired.")
                        setSnackBarOpacity(1)
                        setTimeout(() => {
                            setSnackBarOpacity(0)
                            setMsg('')
                        }, 3000)
                    } else {
                        setMsg("There was an error trying to verify your number. Please try again.")
                        setSnackBarOpacity(1)
                        setTimeout(() => {
                            setSnackBarOpacity(0)
                            setMsg('')
                        }, 3000)
                    }
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
            {Tried ?
                <TouchableOpacity onPress={()=>nav.push("Change Phone Number")}>
                    <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: '#00a2f9', marginTop: 30, textDecorationLine: 'underline' }}>Change Phone number?</Text>
                </TouchableOpacity>
                :
                <Text style={{ fontSize: 15, fontFamily: 'Poppins-Light', color: ctx.textColor, marginTop: 30 }}>Check your sms to find your code.</Text>
            }
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