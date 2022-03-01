import { Image, View, ImageBackground, Text, TouchableOpacity, TextInput, SafeAreaView, StyleSheet, Modal } from 'react-native'
import { useContext, useEffect, useState, useRef } from 'react'
import { AppContext } from '../../../../AppContext'
import { MainLookup } from '../../../Lookup'
import ViewShot, { captureRef } from "react-native-view-shot";
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import Feather from 'react-native-vector-icons/Feather'
import IonIcons from 'react-native-vector-icons/Ionicons';
import UploadImage from '../../../Components/UploadImage'
import ImageViewer from 'react-native-image-zoom-viewer';
import { host } from '../../../Components/host';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper'

export default function ViewPicture(props) {
    const [publishing, setPublishing] = useState(0)
    const { uri } = props?.route?.params;
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const ButtonBackgroundStyles = { backgroundColor: '#17171795', padding: 10, borderRadius: 100 }
    const NavStyles = {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        padding: 20,
        alignItems: 'center',
        // opacity: .9
    }
    const [CSRFToken, setCSRFTOKEN] = useState()
    // FETCH CSRFTOKEN
    useEffect(() => {
        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])

    const Continue = () => {
        const cb = () => {
            nav.push("Home")
        }
        ctx.BackgroundFunction(uri, cb)
    }

    return (
        <>
            <ImageBackground style={{ height: '100%', width: '100%' }} source={{ uri: uri }}>
            </ImageBackground>
            <View style={NavStyles}>
                <TouchableOpacity onPress={() => (nav.pop())} style={ButtonBackgroundStyles}>
                    <Feather name='x' color={'white'} size={25} />
                </TouchableOpacity>
                <TouchableOpacity onPress={Continue} style={ButtonBackgroundStyles}>
                    <AntDesign name='check' color={'white'} size={25} />
                </TouchableOpacity>
            </View>
        </>
    )
}

export function AddMessage(props) {
    const { uri } = props?.route?.params;
    const nav = useNavigation();
    const ctx = useContext(AppContext)
    const [body, setBody] = useState('');
    const ButtonBackgroundStyles = { backgroundColor: '#17171795', padding: 10, borderRadius: 100 }
    const NavStyles = {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        padding: 20,
        alignItems: 'center',
        // opacity: .9
    }
    const Continue = () => {
        // nav.push("Add Message to your sharing Image", { uri: uri })
    }

    return (
        <>
            <ImageBackground style={{ height: '50%', width: '100%' }} source={{ uri: uri }}>
            </ImageBackground>
            <TextInput
                style={{
                    padding: 7,
                    textAlign: 'left',
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: '#2c3e50',
                    fontFamily: 'Poppins-Regular',
                    color: ctx.textColor,
                    width: '70%',
                    marginRight: 5
                }} multiline onChangeText={setBody} placeholder='What are you thinking about?' placeholderTextColor={'grey'} >
                {body.split(/(\s+)/).map((item, index) => {
                    return (
                        <Text key={index}
                            style={{
                                fontFamily:
                                    item.includes(".com")
                                        || item[0] === ("@")
                                        || item[0] === ("#")
                                        || item.includes("http://")
                                        || item.includes("https://")
                                        || item === '69'
                                        || item === '69420'
                                        ? 'Poppins-Bold' : 'Poppins-Regular',
                                color: ctx.textColor
                            }}>{item}</Text>
                    )
                })}
            </TextInput>
        </>
    )
}

export function ViewDetailedImage(props) {
    const { img } = props?.route?.params;
    const nav = useNavigation();
    const images = [
        {
            url:
                img,
        },
    ]
    const ButtonBackgroundStyles = { backgroundColor: '#17171795', padding: 10, borderRadius: 100 }
    const NavStyles = {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        padding: 20,
        alignItems: 'center',
        // opacity: .9
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <ImageViewer
                        imageUrls={images}
                        renderIndicator={() => null}
                    />
                </View>
            </SafeAreaView>
            <View style={NavStyles}>
                <TouchableOpacity onPress={() => (nav.pop())} style={ButtonBackgroundStyles}>
                    <Feather name='x' color={'white'} size={25} />
                </TouchableOpacity>
            </View>
        </>
    )
}
export function ViewDetailedImagesList(props) {
    const { imgs } = props?.route?.params;
    const nav = useNavigation();
    const ctx = useContext(AppContext);
    const ButtonBackgroundStyles = { backgroundColor: '#17171795', padding: 10, borderRadius: 100 }
    const NavStyles = {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        padding: 20,
        alignItems: 'center',
        // opacity: .9
    }

    return (
        <>
            <Swiper
                dotColor={ctx.bgColor}
                activeDotColor={ctx.textColor}
                style={{ backgroundColor: ctx.bgColor }}>
                {imgs.map((item, index) => {
                    return (
                        <Image key={index} resizeMode='contain' style={{ flex: 1, backgroundColor: ctx.bgColor }} source={{ uri: item.uri }} />
                    )
                })}
            </Swiper>
            <View style={NavStyles}>
                <TouchableOpacity onPress={() => (nav.pop())} style={ButtonBackgroundStyles}>
                    <Feather name='x' color={'white'} size={25} />
                </TouchableOpacity>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
    },
});