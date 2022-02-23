import React, { useState, useEffect, useContext, useRef } from 'react'
import { AppContext } from '../../../../../AppContext'
import { View, Text, TextInput, TouchableOpacity, Button, ActivityIndicator } from 'react-native'
import { MainLookup } from '../../../../Lookup'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PhoneInput from "react-native-phone-number-input";
import { host } from '../../../../Components/host'


export default function ChangePhoneNumber(props) {
    const [key, setKey] = useState()
    const [CSRFToken, setCSRFTOKEN] = useState()
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
            const cb = (r, c) => {
                if (c === 200) {
                    console.log(r, c, 474)
                    const Ccb = (r_, c_) => {
                        console.log(r_, c_, 468)
                        if (c_ === 200) {
                            setMsg('Code has been sent to your phone number')
                            setSnackBarOpacity(1)
                            setTimeout(() => {
                                setSnackBarOpacity(0)
                                setMsg('')

                                nav.push('Verify Phone Number', { key: key, phoneNumber: PhoneNumber })
                                AsyncStorage.setItem("phone_number", PhoneNumber)
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