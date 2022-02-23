import React from 'react'
import { MainLookup } from '../Lookup'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firebase from "firebase";

const UploadImage = async (endpoint, url, callBack, id) => {
    // callBack('asklfajslfjasklfjalsfjlk', 201, id);
    const response = await fetch(url);
    const path = `/b/chacha/${endpoint}`
    const blob = await response.blob();
    const task = firebase
        .storage()
        .ref()
        .child(path)
        .put(blob);
    const taskProgress = snapshot => {
        callBack(`transferred: ${snapshot.bytesTransferred}`, 200, id)
    }
    const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot) => {
            callBack(snapshot, 201, id)
        })
    }
    const taskError = snapshot => {
        callBack(snapshot, 500, id);
    }
    task.on("state_changed", taskProgress, taskError, taskCompleted);
}
export default UploadImage;