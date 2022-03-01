import { useState, useEffect, useContext } from 'react'
import { Camera } from 'expo-camera'
import { useNavigation } from '@react-navigation/native'
import { AppContext } from '../../../../AppContext'
import { Pressable, StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, ScrollView, Button, FlatList, ImageBackground, TextInput, ActivityIndicator } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import * as MediaLibrary from 'expo-media-library';
import { MainLookup } from '../../../Lookup';
import { host } from '../../../Components/host';
import UploadImage from '../../../Components/UploadImage'
import Swiper from 'react-native-swiper'
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("screen")
const screenRatio = height / width;

export default function AddScreen() {
    const nav = useNavigation();
    const ctx = useContext(AppContext);
    const [SelectedPictures, setSelectedPictures] = useState([])
    const [Images, setImages] = useState([])
    const _mediaLibraryAsync = async () => {
        let { status } = await MediaLibrary.requestPermissionsAsync()
        let media = await MediaLibrary.getAssetsAsync({
            // first: 51,
            first: 21,
            sortBy: 'creationTime'
        })
        setImages(media.assets)
    };
    useEffect(() => {
        _mediaLibraryAsync()

        return () => {
            setImages([]);
            setSelectedPictures([])
        }
    }, [])
    const callback = (item, type) => {
        if (type === 'selected') {
            try {
                const NewSelects = SelectedPictures.concat(item)
                setSelectedPictures(NewSelects)
            } catch (e) {
                console.log(e)
            }
        } else {
            try {
                setSelectedPictures(SelectedPictures => SelectedPictures.filter(item_ => item_.id !== item.id));
            } catch (e) {
                console.log(e)
            }
        }
    }
    const Continue = () => {
        if (SelectedPictures.length > 1) {
            nav.push("Publish Pictures", { SelectedPictures: SelectedPictures })
        } else {
            const image = SelectedPictures[0]
            nav.push("Edit Picture", { file: image, uri: image.uri, next: 'Publish Pictures' })
        }
    }
    const PickPhotos = () => {
        nav.push("View My Pictures")
    }

    const [body, setBody] = useState('');
    const Post = () => {
        if (body) {
            setBody('')
            ctx.Post(body)
        }
    }
    return (
        <>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <FlatList ListFooterComponent={() => (
                    <View style={{
                        height: height / 2,
                        width: width,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <TouchableOpacity onPress={PickPhotos} style={{
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: ctx.textColor,
                            borderWidth: 1,
                            borderRadius: 10,
                            width: width / 3,
                            height: height / 4
                        }}>
                            <IonIcons name='ios-image' color={ctx.textColor} size={width / 4} />
                            <Text style={{
                                fontFamily: 'Poppins-Regular',
                                textAlign: 'center',
                                fontSize: 13,
                                color: ctx.textColor,
                            }} >View all pictures from my gallery</Text>
                        </TouchableOpacity>
                    </View>
                )}
                    style={{ flex: 1 }} numColumns={3} key={(item, index) => (item.id)} data={Images}
                    renderItem={({ item, index }) => (
                        <PhotoCard callback={callback} item={item} index={index} />
                    )} />
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                }}>
                    <TextInput
                        maxLength={200}
                        style={{
                            padding: 5,
                            textAlign: 'left',
                            // borderRadius: 30,
                            borderColor: '#2c3e50',
                            fontFamily: 'Poppins-Regular',
                            color: ctx.textColor,
                            width: '80%',
                            marginRight: 5
                        }} multiline onChangeText={setBody} placeholder='Make a quick post' placeholderTextColor={'grey'} >
                        {body.split(/(\s+)/).map((item, index) => {
                            return (
                                <Text key={index}
                                    style={{
                                        fontFamily:
                                            item[0] === ("@")
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
                    <TouchableOpacity onPress={Post} style={{
                        // backgroundColor: '#0077ff',
                        padding: 6,
                        borderRadius: 100,
                    }}>
                        <EvilIcons name='share-apple' size={35} color={ctx.textColor} />
                    </TouchableOpacity>
                </View>
                {SelectedPictures.length > 0 &&
                    <TouchableOpacity onPress={Continue} style={{
                        padding: 5,
                        width: '90%',
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: ctx.textColor,
                        borderRadius: 40,
                        position: 'absolute',
                        bottom: 10
                    }}>
                        <Text style={{
                            color: ctx.bgColor,
                            fontFamily: 'Poppins-Bold',
                            fontSize: 20
                        }}>Continue</Text></TouchableOpacity>}
            </View>
        </>
    )
}

export function ViewAllPicturesFromGallery() {
    const nav = useNavigation();
    const ctx = useContext(AppContext);
    const [SelectedPictures, setSelectedPictures] = useState([])
    const [Images, setImages] = useState([])
    const _mediaLibraryAsync = async () => {
        let { status } = await MediaLibrary.requestPermissionsAsync()
        let media = await MediaLibrary.getAssetsAsync({
            first: 5000,
            sortBy: 'creationTime'
        })
        setImages(media.assets)
    };
    useEffect(() => {
        _mediaLibraryAsync()
    })
    const callback = (item, type) => {
        if (type === 'selected') {
            try {
                const NewSelects = SelectedPictures.concat(item)
                setSelectedPictures(NewSelects)
            } catch (e) {
                console.log(e)
            }
        } else {
            try {
                setSelectedPictures(SelectedPictures => SelectedPictures.filter(item_ => item_.id !== item.id));
            } catch (e) {
                console.log(e)
            }
        }
    }
    const Continue = () => {
        nav.push("Publish Pictures", { SelectedPictures: SelectedPictures })
    }
    return (
        <>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: ctx.bgColor,
                }}>
                {Images.length > 0 ?
                    <>
                        <FlatList
                            style={{ flex: 1 }} numColumns={3} key={(item, index) => (item.id)} data={Images}
                            renderItem={({ item, index }) => (
                                <PhotoCard callback={callback} item={item} index={index} />
                            )} />
                        {SelectedPictures.length > 0 &&
                            <TouchableOpacity onPress={Continue} style={{
                                padding: 5,
                                width: '90%',
                                alignSelf: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: ctx.textColor,
                                borderRadius: 40,
                                position: 'absolute',
                                bottom: 10
                            }}>
                                <Text style={{
                                    color: ctx.bgColor,
                                    fontFamily: 'Poppins-Bold',
                                    fontSize: 20
                                }}>Continue</Text></TouchableOpacity>}
                    </>
                    :
                    <ActivityIndicator size={'large'} color={ctx.textColor} />
                }
            </View>
        </>
    )
}

export function PhotoCard(props) {
    const { item, callback, width_, height_, padding_, } = props;
    const DontShowTick = props.DontShowTick ? props.DontShowTick : false
    const [isSelected, setIsSelected] = useState(false)
    const Select = () => {
        setIsSelected(!isSelected)
        if (isSelected) {
            callback(item, 'unselected')
        } else {
            callback(item, 'selected')
        }
    }
    return (
        <Pressable style={{
            marginBottom: 2,
            marginHorizontal: 1,
            borderRadius: 10
        }} onPress={Select}>
            <ImageBackground blurRadius={200} source={{ uri: item.uri }}
                style={{
                    width: width_ ? width_ : width / 3,
                    height: height_ ? height_ : height / 4,
                    // backgroundColor: 'ligtgrey',
                    alignItems: 'center'
                }}>
                <Image resizeMode='contain'
                    onPress={Select}
                    style={{ height: '100%', width: '100%' }}
                    source={{ uri: item.uri }} />
            </ImageBackground>
            <View style={{
                position: 'absolute',
                top: 10,
                right: 10
            }}>
                {!DontShowTick &&
                    <Pressable onPress={Select} style={{
                        backgroundColor: isSelected ? 'lightgrey' : 'grey',
                        borderRadius: 100,
                        padding: 5
                    }}>
                        <AntDesign name='check' color={isSelected ? '#2c3e50' : 'white'} size={15} />
                    </Pressable>}
            </View>
        </Pressable>
    )
}

export function PublishPicture(props) {
    const nav = useNavigation();
    const [publishing, setPublishing] = useState(0)
    const { SelectedPictures } = props?.route?.params;
    const ctx = useContext(AppContext);
    const [Images, setImages] = useState(SelectedPictures)
    const callback = (item, type) => {
        if (type === 'selected') {
            try {
                const NewSelects = SelectedPictures.concat(item)
                setImages(NewSelects)
            } catch (e) {
                console.log(e)
            }
        } else {
            try {
                setImages(SelectedPictures => SelectedPictures.filter(item_ => item_.id !== item.id));
            } catch (e) {
                console.log(e)
            }
        }
    }
    const [body, setBody] = useState('')
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
        setInterval(() => {
            setSnackBarOpacity(0)
            setMsg('')
        }, 5000)
    }
    let linkss = []

    const HandlePost = (images) => {
        const cb = (r, c) => {
            ctx.setCurrentUser(r.author.username)
            AsyncStorage.setItem('current_user_username', r.author.username)
            AsyncStorage.setItem('current_user_email', r.author.email)
            setBody('')
            ctx.setScreenIsLoading(false)
            if (c === 201) {
                MyAlert('Post was made successfully')
                setBody(body)
                nav.push("Home")
                setPublishing(0)
            } else {
                MyAlert('There was an error trying to make post Please try again')
            }
        }
        MainLookup(cb, {
            endpoint: `/api/post/create`, data: {
                body: body,
                atts: images
            }, method: 'POST', csrf: CSRFToken
        })
    }
    const Post = () => {
        if (body) {
            ctx.setScreenIsLoading(true)
            setPublishing(1)
            for (let i = 0; i < SelectedPictures.length; i++) {
                const PictureUploadedHandlers = (r, c) => {
                    if (c === 201) {
                        linkss = linkss.concat({ type: "img", file: r })
                        i = i + 1
                        if (linkss.length === SelectedPictures.length) {
                            HandlePost(linkss)
                        }
                    }
                }
                UploadImage(`images/${SelectedPictures[i].filename + SelectedPictures[i].creationTime}`, SelectedPictures[i].uri, PictureUploadedHandlers, i + 1)
            }
        }
    }
    return (
        <>
            <View style={{
                flex: 1,
                backgroundColor: ctx.bgColor,
                paddingTop: 50,
                paddingTop: 50,
            }}>

                <Swiper
                    activeDotColor={ctx.textColor}
                    style={styles.wrapper}>
                    {Images.map((item, index) => {
                        return (
                            <PhotoCard key={index} DontShowTick={true} callback={callback} width_={width} height_={height} item={item} index={index} />
                        )
                    })}
                </Swiper>
                <View style={{
                    flexDirection: 'row',
                    padding: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <TextInput
                        maxLength={200}
                        style={{
                            padding: 10,
                            textAlign: 'left',
                            borderRadius: 30,
                            borderWidth: 1,
                            borderColor: '#2c3e50',
                            fontFamily: 'Poppins-Regular',
                            color: ctx.textColor,
                            width: '90%',
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
                    <TouchableOpacity onPress={Post} style={{
                        backgroundColor: 'white',
                        padding: 6,
                        borderRadius: 100,
                    }}>
                        <EvilIcons name='share-apple' size={40} color={'#2c3e50'} />
                    </TouchableOpacity>
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 10,
                    }}><Text style={{
                        color: ctx.textColor,
                        fontFamily: 'Poppins-Regular',
                        fontSize: 10
                    }}>{body.length} / 200</Text></View>
                </View>
            </View>
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
        </>
    )
}
const styles = StyleSheet.create({

})