import React, { useEffect, useContext, useState } from 'react'
import { MainLookup } from '../../../../Lookup'
import { AppContext } from '../../../../../AppContext'
import { useNavigation } from '@react-navigation/native'
import { Text, View, TextInput, TouchableOpacity, FlatList, Dimensions, Pressable, Image } from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { host } from '../../../../Components/host'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { FlashMode } from 'expo-camera/build/Camera.types'
import * as ImagePicker from 'expo-image-picker';
import UploadImage from '../../../../Components/UploadImage'
import Moment from 'moment';
import { Audio } from 'expo-av';

const { height, width } = Dimensions.get('window')

export default function ChatRoom(props) {
    const { otherUser, notice } = props?.route?.params;
    const initImage = props?.route?.params?.initImage

    const ctx = useContext(AppContext);
    const nav = useNavigation();

    const [messages, setMessages] = useState([])
    const [CSRFToken, setCSRFTOKEN] = useState()
    const [body, setBody] = useState('')
    const [currentUser, setCurrentUser] = useState('')

    const [HasSet, setHasSet] = useState(false)
    const [Change, setChange] = useState(false)

    const [OpenKeyboard, setOpenKeyboard] = useState(true)
    const [Sending, setSending] = useState(false)

    const [msg, setMsg] = useState('')
    const [SnackBarOpacity, setSnackBarOpacity] = useState(0)
    const [image, setImage] = useState([])

    useEffect(() => {
        try {
            if (initImage) {
                setImage(initImage);
            }
        } catch (e) {
            console.log(e)
        }
    }, [initImage])

    async function Fetch(set) {
        if (Change === true) {
            console.log("second Fetch initiated")
            const ucb = (e, r_) => {
                setCurrentUser(r_)
                const cb = (r, c) => {
                    if (c === 200)
                        setMessages(r)
                    // setMessages(r.results)
                    console.log("second Fetch finished")
                    setHasSet(set ? set : false)
                }
                MainLookup(cb, { endpoint: `/api/chat/${r_}-${otherUser}`, method: 'GET' })
            }
            AsyncStorage.getItem("current_user_username", ucb)
        }
    }
    async function FirstFetch() {
        console.log("First Fetch initiated")
        const ucb = (e, r_) => {
            setCurrentUser(r_)
            const cb = (r, c) => {
                if (c === 200)
                    setMessages(r.results)
                setChange(true)
                console.log("First Fetch Successfully ended")
                console.log("Changed")
            }
            MainLookup(cb, { endpoint: `/api/chat/${r_}-${otherUser}/get`, method: 'GET' })
        }
        AsyncStorage.getItem("current_user_username", ucb)
    }
    useEffect(() => {
        console.log("First use Effect")
        FirstFetch()

        return () => {
            setMessages([])
            setHasSet(false)
            setChange(false)
            setImage([])
        }
    }, [])
    useEffect(() => {
        if (Change) {
            console.log("Change detected")
            Fetch(true)
        } else {
            console.log("waiting for change")
        }
    }, [Change])
    const MyAlert = (msg) => {
        setMsg(msg)
        setSnackBarOpacity(1)
        setInterval(() => {
            setSnackBarOpacity(0)
            setMsg('')
        }, 5000)
    }
    // SET HEADER TITLE OPTIONS
    useEffect(() => {
        nav.setOptions({
            headerTitle: () => (
                // <TouchableOpacity onPress={()=>nav.push("View Profile", { user: otherUser })}>
                <Text style={{ fontSize: 20, fontFamily: 'Poppins-Bold', color: ctx.textColor }}>{otherUser}</Text>
                // </TouchableOpacity>
            )
        })
    }, [])
    // CHECKS IF THERE IS NEW MESSAGE
    let [count, setCount] = useState(messages.length)
    useEffect(() => {
        const timer = setInterval(() => {
            if (messages) {
                if (HasSet && Change) {
                    const cb = (r, c) => {
                        if (r.count === messages.length) {
                        } else {
                            console.log("New Message")
                            setCount(count + 1)
                            setMessages(
                                [r.last, ...messages]
                            )
                        }
                    }
                    MainLookup(cb, { endpoint: `/api/chat/${currentUser}-${otherUser}/has-new-chat`, method: 'GET' })
                }
            }
        }, 100)
        return () => clearInterval(timer);
    }, [HasSet])
    const renderRow = ({ item, index }) => {
        return (
            <>
                <RoomMessageCard currentUser={currentUser} item={item} key={`${index}`} />
            </>
        )
    }
    // FETCH CSRFTOKEN
    useEffect(() => {
        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])
    // MAKE A POST
    const handlerPost = (uri, type) => {
        console.log("Starting posting..")
        const cb = (r, c) => {
            console.log(r, c)
            setSending(false)
            ctx.setScreenIsLoading(false)
            setImage([])
            if (c === 201) {
                console.log("Posted")
                // setMessages([r].concat(messages))
            } else {
                setImage(image)
                setBody(body)
                MyAlert("Message couldn't be delievered.Please try again.")
            }
        }
        MainLookup(cb, {
            csrf: CSRFToken, endpoint: `/api/chat/${currentUser}-${otherUser}`, method: 'POST', data: {
                body: body ? body : '',
                img: uri ? type === 'img' ? uri : '' : '',
                voice: uri ? type === 'voice' ? uri : '' : '',
            }
        })
    }

    const Post = () => {
        if (body) {
            ctx.setScreenIsLoading(true)
            setBody('')
            setSending(true)
            if (image.uri) {
                const handler = (r, c, id) => {
                    if (c === 201) {
                        handlerPost(r, 'img')
                    } else if (!c === 200) {
                        alert("There was error while uploading the image.Please try again later")
                    }
                }
                UploadImage(`images/messages/${image.uri.split('/').slice(-1)}`, image.uri, handler, 0)
            } else {
                handlerPost(null, null)
            }
        }

    }
    // const OpenCamera = async () => {
    //     const result = ImagePicker.launchCameraAsync()
    //         .then(res => {
    //             console.log(res)
    //             if (!res.cancelled) {
    //                 setImage(res)
    //                 // nav.push("Edit Picture For Dm", { uri: res.uri, file: res })
    //             }
    //         })
    //     // console.log(result)
    // }
    const PickImage = () => {
        const result = ImagePicker.launchImageLibraryAsync()
            .then(res => {
                console.log(res)
                if (!res.cancelled) {
                    setImage(res)
                    // nav.push("Edit Picture For Dm", { uri: res.uri, file: res })
                }
            })
        console.log(result)
    }
    const [recording, setRecording] = React.useState();

    async function startRecording() {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }
    const handlePostVoice = (uri) => {
        console.log("Starting posting..")
        const cb = (r, c) => {
            ctx.setScreenIsLoading(false)
            if (c === 201) {
                console.log("Posted")
                // setMessages([r].concat(messages))
            } else {
                MyAlert("Message couldn't be delievered.Please try again.")
            }
        }
        MainLookup(cb, {
            csrf: CSRFToken, endpoint: `/api/chat/${currentUser}-${otherUser}`, method: 'POST', data: {
                voice: uri
            }
        })
    }

    async function stopRecording() {
        ctx.setScreenIsLoading(true)
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        const cb = (r, c, id) => {
            console.log(r, c)
            if (c === 201) {
                handlePostVoice(r)
            }
        }
        UploadImage(`messages/voices/${uri.split('/').slice(-1)}`, uri, cb, 1)
    }
    return (
        <View style={{
            flex: 1,
            backgroundColor: ctx.bgColor
        }}>
            {messages.length > 0 ?
                <>
                    <FlatList
                        data={messages}
                        renderItem={renderRow}
                        keyExtractor={(i, k) => k.toString()}
                        inverted
                    />
                </> :
                <>
                    <View style={{
                        flex: 1,
                        backgroundColor: ctx.bgColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity onPress={() => setOpenKeyboard(!true)} style={{
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: ctx.textColor,
                            borderWidth: 1,
                            borderRadius: 10,
                            width: width / 3,
                            height: height / 4,
                        }}>
                            <EvilIcons name='envelope' color={ctx.textColor} size={width / 4} />
                            <Text style={{
                                fontFamily: 'Poppins-Regular',
                                textAlign: 'center',
                                fontSize: 13,
                                color: ctx.textColor,
                            }} >Messages with @{otherUser} will appear here.</Text>
                        </TouchableOpacity>
                    </View>
                </>}
            {image.uri ?
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row'
                }}>
                    <TouchableOpacity onPress={() => (setImage([]))} style={{ backgroundColor: '#17171795', padding: 10, borderRadius: 100, marginLeft: 'auto' }}>
                        <AntDesign name='close' color={'white'} size={25} />
                    </TouchableOpacity>
                    <Image resizeMode='contain' style={{ width: 100, height: 200, backgroundColor: 'transparent', borderRadius: 10, marginLeft: 'auto', marginRight: 20 }} source={{ uri: image.uri }} />
                </View> : null}

            <View style={{
                flexDirection: 'row',
                padding: 10,
                alignItems: 'center',
                borderTopWidth: 1,
                borderColor: '#2c3e50',
                justifyContent: 'center',
            }}>
                <TouchableOpacity onPressIn={startRecording} onPressOut={stopRecording} style={{
                    backgroundColor: ctx.scheme === 'light' ? 'white' : '#2b2b2b',
                    padding: 6,
                    borderRadius: 100,
                    marginRight: 2
                }}>
                    <MaterialIcons name='keyboard-voice' size={27} color={ctx.textColor} />
                </TouchableOpacity>
                <TouchableOpacity onPress={PickImage} style={{
                    backgroundColor: ctx.scheme === 'light' ? 'white' : '#2b2b2b',
                    padding: 6,
                    borderRadius: 100,
                }}>
                    <EvilIcons name='image' size={35} color={ctx.textColor} />
                </TouchableOpacity>
                <TextInput
                    autoFocus={OpenKeyboard}
                    maxLength={200}
                    style={{
                        padding: 5,
                        textAlign: 'left',
                        // borderRadius: 30,
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
                <TouchableOpacity onPress={Post} style={{
                    backgroundColor: '#0077ff',
                    padding: 6,
                    borderRadius: 100,
                }}>
                    <EvilIcons name='share-apple' size={35} color={'#ffffff'} />
                </TouchableOpacity>
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 10,
                }}><Text style={{
                    color: ctx.textColor,
                    fontFamily: 'Poppins-Regular',
                    fontSize: 7
                }}>{body.length} / 200</Text></View>
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
        </View>
    )

}
function RoomMessageCard(props) {
    const { item, currentUser } = props;
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const Delete = () => {
        try {
            const cb = (r, c) => {
                console.log(r, c)
            }
            MainLookup(cb, { endpoint: `/api/chat/${item.id}/delete`, method: 'GET' })
        } catch (e) {
            console.log(e)
            ctx.MyAlert("Couldn't delete chat.")
        }

    }
    const isMe = item.sender.username === currentUser
    const [sound, setSound] = React.useState();
    useEffect(() => {
        if (item.voice) {
            const { ss } = Audio.Sound.createAsync(
                { uri: item.voice }
            );
            setSound(ss);
        }
    }, [])
    async function playSound() {
        console.log('Playing Sound');
        const { sound } = await Audio.Sound.createAsync(
            { uri: item.voice }
        );
        setSound(sound);
        await sound.playAsync();
    }
    const textColor = isMe ? 'white' : ctx.textColor
    return (

        <>
            {/* <Image style={{ position: '', height: 15, width: 15, borderRadius: 100 }} source={{ uri: item.sender.pfp }} /> */}
            <Pressable onLongPress={Delete} style={{
                backgroundColor: isMe ? '#0077ff' : ctx.scheme === 'light' ? 'white' : '#2b2b2b',
                padding: 8,
                borderRadius: 20,
                paddingHorizontal: 10,
                maxWidth: "80%",
                borderColor: '#2c3e50',
                textAlign: 'left',
                alignSelf: isMe ? "flex-end" : 'flex-start',
                marginVertical: 2
            }}>
                <View style={{
                    margin: 1,
                    alignSelf: isMe ? "flex-end" : 'flex-start',
                    flexDirection: isMe ? 'row-reverse' : 'row',
                }}>
                    {item.deleted ?
                        <Text style={{
                            color: 'white',
                            fontSize: 15,
                            fontFamily: 'Poppins-MediumItalic'
                        }}>
                            {item.message}
                        </Text>
                        :
                        <>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Poppins-Regular',
                                textAlign: isMe ? "right" : 'left'
                            }}>
                                {item.message ? <>
                                    {item.message.split(/(\s+)/).map((item_, index) => {
                                        return (
                                            <Text key={index}
                                                style={{
                                                    fontFamily:
                                                        item_.includes(".com")
                                                            || item_[0] === ("@")
                                                            || item_[0] === ("#")
                                                            || item_.includes("http://")
                                                            || item_.includes("https://")
                                                            || item_ === '69'
                                                            || item_ === '69420'
                                                            ? 'Poppins-Bold' : 'Poppins-Regular',
                                                    color: textColor
                                                    // color: ctx.scheme === 'light' ? 'white' : '#f5f2f2'
                                                }}>{item_}</Text>
                                        )
                                    })}
                                </> : null}
                            </Text>

                        </>
                    }
                </View>
                <View style={{
                    alignSelf: isMe ? "flex-end" : 'flex-start',
                }}>
                    {item.img ?
                        <TouchableOpacity onPress={() => (nav.push('View Detailed Image', { img: item.img }))}>
                            <Text style={{ fontFamily: 'Poppins-Bold', color: 'white' }}> View Picture </Text>
                        </TouchableOpacity> : null}
                    {item.voice ?
                        <TouchableOpacity onPress={playSound}>
                            <Text style={{ fontFamily: 'Poppins-Bold', color: 'white' }}> Listen voice </Text>
                        </TouchableOpacity> : null}
                </View>
                <Text style={{
                    color: textColor,
                    fontSize: 10,
                    fontFamily: 'Poppins-Light',
                    alignSelf: isMe ? "flex-end" : 'flex-start',
                    // paddingHorizontal: 10
                }}>
                    {DateAdded(item.date_added)}
                </Text>
            </Pressable>
        </>
    )
}
export function DateAdded(str) {
    try {
        var dateCalender = str.split("T")[0]
        var time = str.split("T")[1].split(".")[0]
        return Moment(str).fromNow()
    } catch (e) {
        return ''
    }
}