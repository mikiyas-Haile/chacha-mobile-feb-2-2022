import React, { useEffect, useState, useContext } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MainLookup, FetchLookup } from '../../../../Lookup'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Image, Pressable, ScrollView, Linking, TextInput } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { AppContext } from '../../../../../AppContext'
import { useNavigation } from '@react-navigation/native'
import * as Contacts from 'expo-contacts';
import { host } from '../../../../Components/host'
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import { DateAdded } from '../ChatRoom'
import { TranslateApi } from '../../../../Components/Translate'


const { height, width } = Dimensions.get('window')

function Chats() {
    const nav = useNavigation()
    const ctx = useContext(AppContext);
    const [Chats, setChats] = useState([]);
    // useEffect(() => {
    //     console.log(ctx.token)
    // },[])
    useEffect(() => {
        const timer = setInterval(() => {
            const cb = (r, c) => {
                if (c === 200 || c === 201) {
                    setChats(r)
                }
            }
            FetchLookup(cb, { endpoint: `/api/chats`, method: 'GET' })
        }, 1000)
        return () => {
            clearInterval(timer);
        };
    })
    useEffect(() => {
        nav.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => nav.push("Contacts List")} style={{
                    paddingRight: 15
                }}>
                    <AntDesign name='adduser' size={30} color={ctx.scheme === 'dark' ? ctx.textColor : '#fe2c55'} />
                </TouchableOpacity>
            )
        })
        return () => {
            setChats([])
        }
    }, [])
    return (
        <>
            {!Chats.length > 0 ? <>
                <View style={{
                    height: height / 2,
                    width: width,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity style={{
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
                            fontFamily: ctx.RegularFont,
                            textAlign: 'center',
                            fontSize: 13,
                            color: ctx.textColor,
                        }} >{ctx.language === 'Amharic' ? `ሁሉም መልእቶ እዚህ ይታያል` : TranslateApi({str: "All of your chats will appear here", id: 13})}</Text>
                    </TouchableOpacity>
                </View>
            </> :
                <FlatList data={Chats} renderItem={({ item, index }) => (
                    <RoomCard item={item} key={index} />
                )} />
            }
        </>
    )
}
export function ContactList() {
    const nav = useNavigation()
    const ctx = useContext(AppContext);
    const [body, setBody] = useState('')
    const [myContacts, setmyContacts] = useState([])
    const [searchedContacts, setSearchedContacts] = useState([])
    const [CSRFToken, setCSRFTOKEN] = useState()
    const [hasSearched, setHasSearched] = useState(false)
    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync();

                if (data.length > 0) {
                    setmyContacts(data)
                    fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
                        .then(data => data.json())
                        .then(data => { setCSRFTOKEN(data.csrf) })
                        .catch(error => console.log(error))
                }
            }
        })();
        return () => {
            setmyContacts([]);
        }
    }, []);
    const Filter = () => {
        setSearchedContacts([])
        setHasSearched(false)
        const filtered = myContacts.filter(obj => obj.name.includes(body))
        setSearchedContacts(filtered)
        setHasSearched(true)
    }
    useEffect(() => {
        var randomContact = Math.floor(Math.random() * myContacts.length);
        nav.setOptions({
            headerTitle: () => (
                <View style={{
                    flexDirection: 'row',
                    width: '80%'
                }}>
                <TextInput
                    onSubmitEditing={Filter}
                    returnKeyType={'search'}
                    maxLength={200}
                    style={{
                        padding: 5,
                        textAlign: 'left',
                        borderColor: '#2c3e50',
                        fontFamily: 'Poppins-Regular',
                        color: ctx.textColor,
                        width: '100%',
                        fontSize: 17
                        // marginRight: 5
                    }} onChangeText={setBody} placeholder={`Search`} placeholderTextColor={'grey'} >
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
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={Filter} style={{
                    backgroundColor: '#0077ff',
                    padding: 6,
                    borderRadius: 100,
                }}>
                    <EvilIcons name='search' size={35} color={'#ffffff'} />
                </TouchableOpacity>
            )
        })
    })

    return (
        <View style={{
            flex: 1,
            backgroundColor: ctx.bgColor
        }}>
            <FlatList data={hasSearched ? searchedContacts : myContacts} renderItem={({ item, index }) => {
                if (item.phoneNumbers) {
                    return (
                        <ContactCard CSRFToken={CSRFToken} item={item} numbers={item.phoneNumbers} number={item.phoneNumbers[0].number} />
                    )
                } else {
                    return <View />
                }
            }} />
        </View>
    )
}
function ContactCard(props) {
    const { item, CSRFToken, numbers, number } = props;
    const nav = useNavigation()
    const ctx = useContext(AppContext);
    const [isUser, setisUser] = useState(null)
    const [user, setUser] = useState([])
    useEffect(() => {
        const cb = (r, c) => {
            if (c === 200) {
                setUser(r)
                setisUser(true)
            } else {
                setisUser(false)
            }
        }
        MainLookup(cb, { endpoint: `/api/check-number/${number.replace(/\s/g, '').replace("PLUS", '')}`, method: 'GET' })
    }, [])
    const Invite = () => {
        Linking.openURL(`sms:${number.replace(/\s/g, '')}?body=Hello There! I am waiting for you on Chacha! Download the app and let's chat there! Find it on Playstore or the Appstore! Cya there! <33`)
    }
    return (
        <Pressable onPress={() => isUser ? nav.push("Room", { otherUser: user.username, notice: "Start chatting" }) : Invite()} style={{
            flexDirection: 'row',
            padding: 7,
            borderColor: '#2c3e50',
            textAlign: 'left'
        }}>
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {user.pfp &&
                        <Image style={{
                            width: 50,
                            height: 50,
                            borderRadius: 100,
                            marginRight: 10
                        }} source={{ uri: user.pfp }} />}
                    <View>
                        <Text style={{
                            color: ctx.textColor,
                            fontSize: 17,
                            fontFamily: 'Poppins-Regular',
                            marginRight: 5
                        }}>{item.name}{user.display_name && ` | ${user.display_name}`}</Text>
                        <Text style={{
                            color: ctx.textColor,
                            fontSize: 14,
                            fontFamily: 'Poppins-Bold'
                        }}>{isUser ? 'Tap to start chat' : 'Invite  to Chacha'}
                        </Text>
                    </View>
                </View>
            </View>
            {isUser &&
                <View style={{
                    marginLeft: 'auto'
                }}>
                    <TouchableOpacity onPress={() => nav.push("Room", { otherUser: user.username, notice: "Start chatting" })}>
                        <EvilIcons name='envelope' size={50} color={ctx.scheme === 'light' ? "#fe2c55" : ctx.textColor} />
                    </TouchableOpacity>
                </View>}
        </Pressable>
    )
}

function RoomCard(props) {
    const { item } = props
    const ctx = useContext(AppContext);
    const nav = useNavigation()
    const myProfile = item.user_one.request_user === item.user_one.username ? 'user_one' : item.user_two.request_user === item.user_two.username ? 'user_two' : 'user_one'

    if (myProfile === 'user_one') {
        return (
            <RenderUserForChat otherUser={'user_two'} room={item} user={item.user_two} />

        )
    } else if (myProfile === 'user_two') {
        return (
            <RenderUserForChat otherUser={"user_one"} room={item} user={item.user_one} />
        )
    }

}
function RenderUserForChat(props) {
    const { user, room, otherUser } = props;
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    // const [image, setImage] = useState([]);
    // my_notice_date_added
    const OpenCamera = async () => {
        const result = ImagePicker.launchCameraAsync()
            .then(res => {
                console.log(res)
                if (!res.cancelled) {
                    nav.push("Room", { otherUser: user.username, notice: room.my_notice, initImage: res })
                }
            })
        // console.log(result)
    }
    return (
        <Pressable onPress={() => nav.push("Room", { otherUser: user.username, notice: room.my_notice })} style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 7,
            borderColor: '#2c3e50'
        }}>
            <Image style={{
                width: 50,
                height: 50,
                borderRadius: 100,
                marginRight: 10
            }} source={{ uri: user.pfp }} />
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{
                        color: ctx.textColor,
                        fontSize: 17,
                        fontFamily: 'Poppins-Regular',
                        marginRight: 5
                    }}>{user.display_name}</Text>
                    {user.is_verified ? <AntDesign name='checkcircle' size={17} color={'#00a2f9'} /> : null}
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={{
                        color: ctx.textColor,
                        fontSize: 13,
                        fontFamily: 'Poppins-Bold'
                    }}>{room.my_notice ? room.my_notice : 'Tap to send message'}
                    </Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontFamily: 'Poppins-Light', fontSize: 13, marginRight: 5, marginLeft: 5, color: ctx.textColor, opacity: .9 }}>
                        • {DateAdded(room.my_notice_date_added)}
                    </Text>
                </View>
            </View>
            <View style={{
                marginLeft: 'auto',
            }}>
                <TouchableOpacity onPress={OpenCamera}>
                    <EvilIcons name='camera' size={50} color={ctx.scheme === 'light' ? "#fe2c55" : ctx.textColor} />
                </TouchableOpacity>
            </View>
        </Pressable>
    )
}

export default Chats;
