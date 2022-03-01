import { host } from '../Components/host'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid, Platform } from 'react-native'

export function MainLookup(callback, props) {
    const { method, endpoint, data, csrf } = props
    const tokenCallback = (e, token) => {
        let jsonData;
        if (data) {
            jsonData = JSON.stringify(data)
        }
        const xhr = new XMLHttpRequest()
        const url = `${host}${endpoint}`
        xhr.responseType = "json"
        xhr.open(method, url)
        xhr.setRequestHeader("Content-Type", "application/json")
        if (!token === null || !token === undefined) {
            xhr.setRequestHeader('Authorization', `Token ${token}`)
        }
        xhr.setRequestHeader("Referer", host)
        if (csrf) {
            xhr.setRequestHeader("X-CSRFToken", csrf)
        }
        xhr.onload = function () {
            var response = xhr.response
            var statusCode = xhr.status
            callback(response, statusCode)
        }
        xhr.send(jsonData)

    }
    AsyncStorage.getItem('session_token', tokenCallback)
}