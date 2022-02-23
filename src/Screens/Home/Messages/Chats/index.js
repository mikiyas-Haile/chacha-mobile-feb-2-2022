import React, { useEffect, useState, useContext } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MainLookup } from '../../../../Lookup'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Image, Pressable, ScrollView, Linking } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { AppContext } from '../../../../../AppContext'
import { useNavigation } from '@react-navigation/native'
import * as Contacts from 'expo-contacts';
import { host } from '../../../../Components/host'
import { WebView } from 'react-native-webview';


const { height, width } = Dimensions.get('window')

function Chats() {
    const nav = useNavigation()
    const ctx = useContext(AppContext);
    const [Chats, setChats] = useState([]);

    useEffect(() => {
        const timer = setInterval(() => {
            const cb = (r, c) => {
                if (c === 200 || c === 201) {
                    setChats(r)
                }
            }
            MainLookup(cb, { endpoint: `/api/chats`, method: 'GET' })
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
                    <AntDesign name='adduser' size={30} color={ctx.scheme === 'light' ? '#fe2c55' : ctx.textColor} />
                </TouchableOpacity>
            )
        })
        return ()=>{
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
                            fontFamily: 'Poppins-Regular',
                            textAlign: 'center',
                            fontSize: 13,
                            color: ctx.textColor,
                        }} >Chats will appear here.</Text>
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
    const [myContacts, setmyContacts] = useState([])
    const [CSRFToken, setCSRFTOKEN] = useState()
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
    return (
        <View style={{
            flex: 1,
            backgroundColor: ctx.bgColor
        }}>
            <FlatList data={myContacts} renderItem={({ item, index }) => {
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

                <Text style={{
                    color: ctx.textColor,
                    fontSize: 14,
                    fontFamily: 'Poppins-Bold'
                }}>{room.my_notice ? room.my_notice : 'Tap to send message'}
                </Text>
            </View>
            <View style={{
                marginLeft: 'auto',
            }}>
                <TouchableOpacity onPress={() => nav.push("Room", { otherUser: user.username, notice: room.my_notice })}>
                    <EvilIcons name='envelope' size={50} color={ctx.scheme === 'light' ? "#fe2c55" : ctx.textColor} />
                </TouchableOpacity>
            </View>
        </Pressable>
    )
}

export default Chats;
