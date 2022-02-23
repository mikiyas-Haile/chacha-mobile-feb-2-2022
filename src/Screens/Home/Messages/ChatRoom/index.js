import { useEffect, useContext, useState } from 'react'
import { MainLookup } from '../../../../Lookup'
import { AppContext } from '../../../../../AppContext'
import { useNavigation } from '@react-navigation/native'
import { Text, View, TextInput, TouchableOpacity, FlatList, Dimensions, Pressable } from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { host } from '../../../../Components/host'
import { FlashMode } from 'expo-camera/build/Camera.types'

const { height, width } = Dimensions.get('window')

export default function ChatRoom(props) {
    const { otherUser, notice } = props?.route?.params;

    const ctx = useContext(AppContext);
    const nav = useNavigation();

    const [messages, setMessages] = useState([])
    const [CSRFToken, setCSRFTOKEN] = useState()
    const [body, setBody] = useState('')
    const [currentUser, setCurrentUser] = useState('')

    const [HasSet, setHasSet] = useState(false)

    const [OpenKeyboard, setOpenKeyboard] = useState(true)
    const [Sending, setSending] = useState(false)

    const [msg, setMsg] = useState('')
    const [SnackBarOpacity, setSnackBarOpacity] = useState(0)
    function Fetch () {
        const ucb = (e, r_) => {
            setCurrentUser(r_)
            const cb = (r, c) => {
                if (c === 200)
                    setMessages(r.results)
                setHasSet(true)
            }
            MainLookup(cb, { endpoint: `/api/chat/${r_}-${otherUser}/get`, method: 'GET' })
        }
        AsyncStorage.getItem("current_user_username", ucb)
    }
    useEffect(() => {
        Fetch()
        return () => {
            setMessages([])
        }
    }, [])
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
            title: otherUser
        })
    }, [])
    // FETCH MESSAGES EVERY SECOND
    useEffect(() => {
        const timer = setInterval(() => {
            if (HasSet) {
                const cb = (r, c) => {
                    if (c === 200) {
                        setMessages(r)
                    } else {
                        MyAlert("Response: " + r + ' Status Code: ' + c)
                    }
                }
                MainLookup(cb, { endpoint: `/api/chat/${currentUser}-${otherUser}`, method: 'GET' })
            }
        }, 1000)
        return () => clearInterval(timer);
    })
    const renderRow = ({ item, index }) => {
        return (
            <>
                <RoomMessageCard currentUser={currentUser} item={item} key={`${item.id}`} />
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
    const Post = () => {
        setBody('')
        setSending(true)
        const cb = (r, c) => {
            setSending(false)
            if (c === 201) {
                setMessages([r].concat(messages))
                // Fetch()
            } else {
                setBody(body)
                MyAlert("Message couldn't be delievered.Please try again.")
            }
        }
        MainLookup(cb, {
            csrf: CSRFToken, endpoint: `/api/chat/${currentUser}-${otherUser}`, method: 'POST', data: {
                body: body,
            }
        })
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
                    {Sending ?
                        <View style={{
                            textAlign: 'center',
                            alignSelf: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontFamily: 'Poppins-Bold',
                                fontSize: 14,
                                color: ctx.textColor,
                            }}>Sending..
                            </Text>
                            <EvilIcons name='arrow-up' size={30} color={ctx.textColor} />
                        </View>
                        : null}
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
            <Text style={{
                fontFamily: 'Poppins-Bold',
                fontSize: 13,
                color: ctx.textColor,
                padding: 10,
            }}>{notice ? notice : 'Start a conversation'}</Text>
            <View style={{
                flexDirection: 'row',
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <TextInput
                    autoFocus={OpenKeyboard}
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
    const ctx = useContext(AppContext)
    const Delete = () => {
        console.log("deleting")
        const cb = (r, c) => {
            console.log(r, c)
        }
        MainLookup(cb, { endpoint: `/api/chat/${item.id}/delete`, method: 'GET' })
    }
    const isMe = item.sender.username === currentUser

    return (
        <View style={{
            margin: 1,
            alignSelf: isMe ? "flex-end" : 'flex-start',
        }}>
            <Pressable onLongPress={Delete} style={{
                backgroundColor: isMe ? '#0077ff' : ctx.scheme === 'light' ? 'grey' : '#2b2b2b',
                padding: 8,
                borderRadius: 30,
                paddingHorizontal: 15,
                flexDirection: isMe ? 'row-reverse' : 'row',
                maxWidth: "80%",
                borderColor: '#2c3e50',
                // justifyContent: 'center',
                textAlign: isMe ? 'right' : 'left',
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
                    <Text style={{
                        fontSize: 14,
                        fontFamily: 'Poppins-Regular'
                    }}>

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
                                        color: ctx.scheme === 'light' ? 'white' : '#f5f2f2'
                                    }}>{item_}</Text>
                            )
                        })}
                    </Text>
                }
            </Pressable>
            <Text style={{
                color: ctx.textColor,
                fontSize: 10,
                fontFamily: 'Poppins-Light',
                alignSelf: isMe ? "flex-end" : 'flex-start',
                paddingHorizontal: 10
            }}>
                {DateAdded(item.date_added)}
            </Text>
        </View>
    )
}
export function DateAdded(str) {
    var dateCalender = str.split("T")[0]
    var time = str.split("T")[1].split(".")[0]
    return dateCalender.replace("-", '/').replace("-", '/')
}