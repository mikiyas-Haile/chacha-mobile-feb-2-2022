import React, { useState, useEffect } from 'react'
import { Text, View, FlatList, ToastAndroid, StyleSheet, Image, Pressable, Dimensions, TouchableOpacity, Animated, Modal, TouchableWithoutFeedback } from 'react-native'
import * as Clipboard from 'expo-clipboard';
import AwesomeAlert from 'react-native-awesome-alerts';
import { MainLookup } from '../../../../Lookup';
import { host } from '../../../../Components/host'


import React, { useEffect, useState, useContext } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MainLookup } from '../../../../Lookup'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Image, Pressable, ScrollView } from 'react-native'
import IonIcons from 'react-native-vector-icons/Ionicons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { AppContext } from '../../../../../AppContext'
import { useNavigation } from '@react-navigation/native'
import * as Contacts from 'expo-contacts';
import { host } from '../../../../Components/host'

const { height, width } = Dimensions.get('window')

function Chats() {
    const nav = useNavigation()
    const ctx = useContext(AppContext);
    const [Chats, setChats] = useState([]);
    const [myContacts, setmyContacts] = useState([])
    const [CSRFToken, setCSRFTOKEN] = useState()

    // Fetching Csrf
    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync();

                if (data.length > 0) {
                    data.forEach(item => {
                        if (item.phoneNumbers) {
                            var number = item.phoneNumbers[0].number.replace(/\s/g,'')
                            console.log(number)
                            fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
                                .then(data => data.json())
                                .then(data => {
                                    setCSRFTOKEN(data.csrf)
                                    const cb = (r, c) => {
                                        if (c === 200 || c === 201) {
                                            console.log(r, c, number)
                                            // setisUser(true)
                                            setmyContacts(myContacts.concat(r))
                                        } else {
                                            // setisUser(false)
                                        }
                                    }
                                    MainLookup(cb, {
                                        csrf: data.csrf, endpoint: `/api/check-number`, method: 'POST', data: {
                                            number: number
                                        }
                                    })
                                })
                                .catch(error => console.log(error))
                        }
                    })
                }
            }
        })();
    }, []);
    useEffect(() => {
        const timer = setInterval(() => {
            const cb = (r, c) => {
                if (c === 200 || c === 201) {
                    setChats(r)
                }
            }
            MainLookup(cb, { endpoint: `/api/chats`, method: 'GET' })
        }, 5000)
        return () => clearInterval(timer);
    })
    useEffect(() => {
        nav.setOptions({
            headerLeft: () => (
                <>
                    {ctx.requestUser &&
                        <TouchableOpacity style={{
                            paddingHorizontal: 20
                        }} onPress={() => nav.push('My Profile')}>
                            <Image style={{ height: 40, width: 40, borderRadius: 100 }} source={{ uri: ctx.requestUser.pfp }} />
                        </TouchableOpacity>}
                </>
            )
        })
    }, [])

    return (
        <>
            {!Chats.length > 0 && !myContacts.length > 0 ? <>
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
                        }} >Messages will appear here.</Text>
                    </TouchableOpacity>
                </View>
            </> :
                <ScrollView>
                    <FlatList data={Chats} renderItem={({ item, index }) => (
                        <RoomCard item={item} key={index} />
                    )} />
                    <FlatList ListHeaderComponent={() => (
                        <Text style={{
                            color: ctx.textColor,
                            fontSize: 20,
                            fontFamily: 'Poppins-Bold',
                        }}>Start Chat</Text>
                    )} data={myContacts} renderItem={({ item, index }) => {
                        // console.log("Start ",item ," end")
                        if (item.phoneNumbers) {
                            return (
                                <ContactCard item={item} numbers={item.phoneNumbers} number={item.phoneNumbers[0].number} />
                            )
                        } else {
                            return <View />
                        }
                    }} />
                </ScrollView>
            }
        </>
    )
}
function ContactCard(props) {
    const { item, numbers, number } = props;
    const nav = useNavigation()
    const ctx = useContext(AppContext);
    const [isUser, setisUser] = useState(false)

    return (
        <Pressable onPress={() => isUser && nav.push("Room", { otherUser: user.username, notice: room.my_notice })} style={{
            // flexDirection: 'row',
            // alignItems: 'center',
            // margin: 4,
            padding: 7,
            // borderBottomWidth: .3,
            // borderTopWidth: .3,
            borderColor: '#2c3e50',
            textAlign: 'left'
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{
                    color: ctx.textColor,
                    fontSize: 17,
                    fontFamily: 'Poppins-Regular',
                    marginRight: 5
                }}>{item.name} - {number}</Text>
            </View>
            <Text style={{
                color: ctx.textColor,
                fontSize: 14,
                fontFamily: 'Poppins-Bold'
            }}>{isUser ? 'Tap to send message' : 'Invite'}
            </Text>
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
            // margin: 4,
            padding: 7,
            borderBottomWidth: .3,
            borderTopWidth: .3,
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
        </Pressable>
    )
}

export default Chats;

const { width, height } = Dimensions.get("screen")
function ParsedDate(props) {
    var { date } = props
    var d = new Date(date)
    var ddate = d.getFullYear()
    var mmonth = d.getMonth()
    return <Text>{mmonth}/{ddate} </Text>
}
export function Msg(props) {
    const { chat } = props
    const isme = chat.is_me ? chat.is_me : false
    const [more, setMore] = useState(false)
    const [showAlert, setshowAlert] = useState(false)
    const [csrfToken, setcsrfToken] = useState()
    const copyToClipboard = () => {
        Clipboard.setString(`@${chat.sender.username} | ${chat.body}`);
        ToastAndroid.show(`Copied to Clipboard`, 30)
        setMore(false)
    };
    useEffect(() => {
        fetch(`${host}/csrf`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(data => data.json()).then(
                data => {
                    // console.log(data)
                    setcsrfToken(data.csrf)
                })
            .catch(error => console.error())
    }, [])
    const Delete = () => {
        setshowAlert(false)
        setMore(false)
        const cb = (response, code) => {
            if (code === 200) {
                ToastAndroid.show("You have deleted chat", 100)
            } else {
                ToastAndroid.show("Couldn't delete chat. Please try again", 100)
            }
        }
        MainLookup(cb, {
            endpoint: `/api/delete-chat`, csrf: csrfToken, method: "POST", data: {
                id: chat.id
            }
        })
    }
    const body = chat.body ? chat.body : 'message has been deleted'
    return <>
        <TouchableOpacity onLongPress={() => (setMore(true))}>
            {isme ?
                <>
                    <View style={styles.chatMe}>
                        <View>
                            <View>
                                {!body.includes("deleted") ? <Text style={styles.body}>{body}</Text> :
                                    <Text style={styles.deletedBody}>You have deleted chat</Text>
                                }
                            </View>
                            <View>
                                <Text style={styles.date}>
                                    <ParsedDate date={chat.date_added} />
                                </Text>
                            </View>
                        </View>
                    </View></>
                :
                <View style={styles.chat}>
                    <View>
                        <View>
                            {!body.includes("deleted") ? <Text style={styles.body}>{body}</Text> :
                                <Text style={styles.deletedBody}>{chat.sender.username} has deleted chat</Text>
                            }
                        </View>
                        {!body.includes("deleted") ? <View>
                            <Text style={styles.date}>
                                <ParsedDate date={chat.date_added} />
                            </Text>
                        </View> : null}
                    </View>
                </View>}
        </TouchableOpacity>
        <Modal
            animated
            animationType={"fade"}
            visible={more}
            transparent
            onDismiss={() => (setMore(false))}
            onRequestClose={() => (setMore(false))}
        >
            <TouchableWithoutFeedback onPress={() => (setMore(false))}>
                <View style={styles.overlay}>
                    <View style={styles.overlay}>
                        <Animated.View style={[styles.container]}>
                            <View style={{ width: '10%', height: 5, borderRadius: 20, alignSelf: 'center', backgroundColor: "lightgray" }} />
                            <TouchableOpacity onPress={copyToClipboard} style={styles.dropDownaction}>
                                <Text style={styles.boldStyle}>Copy</Text>
                            </TouchableOpacity>
                            {chat.is_me ?
                                <TouchableOpacity onPress={() => (setshowAlert(true))} style={styles.dropDownaction}>
                                    <Text style={styles.boldStyle}>Delete Chat</Text>
                                </TouchableOpacity> : null}
                            <TouchableOpacity onPress={() => (setMore(false))} style={styles.dropDownaction}>
                                <Text style={styles.boldStyle}>Close tab</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
        <AwesomeAlert
            show={showAlert}
            showProgress={false}
            // title="AwesomeAlert"
            messageStyle={styles.boldStyle}
            confirmButtonTextStyle={styles.lightStyle}
            cancelButtonTextStyle={styles.lightStyle}
            message="Are you sure you want to delete?"
            // closeOnTouchOutside={false}
            // closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="cancel"
            confirmText="delete"
            confirmButtonColor="#fe2c55"
            cancelButtonColor="#2c3e50"
            onCancelPressed={() => {
                setshowAlert(false);
            }}
            onConfirmPressed={Delete}
        />
    </>
}
const styles = StyleSheet.create({
    PostsFollowersFollowing: {
        width: width / 1.3,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    connectionsstyle: {
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        width: width,
        backgroundColor: "red",
    },
    connectionsTextstyle: {
        alignSelf: 'center',
        fontFamily: 'Poppins-Bold',
        color: 'white',
    },
    Editbutton: {
        paddingLeft: 10,
        paddingRight: 10,
        padding: 5,
        alignItems: 'center',
        width: width,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#fe2c55",
        shadowColor: "#fe2c55",
    },
    followBtn: {
        width: width / 1.1,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#fe2c55",
        shadowColor: "#fe2c55",
        justifyContent: "center",
        alignItems: 'center'
    },
    Profileaddbutton: {
        width: width / 2.3,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#fe2c55",
        shadowColor: "#fe2c55",
        justifyContent: "center",
        alignItems: 'center',
    },
    Profile: {
        flexDirection: "column",
        borderColor: '#fe2c55',
        width: width,
        backgroundColor: 'white',
        alignItems: 'center',
        borderBottomWidth:1,
        marginBottom:5,
        paddingBottom:5,
    },
    //  comments
    comment: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#2c3e50',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        margin: 5,
        backgroundColor: 'white',
        borderRadius:10,
    },
    deletedBody: {
        fontFamily: "Poppins-ExtraLightItalic",
        fontSize: 17,
        color: 'white',
        padding: 7
    },
    boldStyle: {
        color: 'black',
        fontSize: 15,
        fontFamily: "Poppins-Bold",
    },
    dropDown: {
        width: width / 2,
        position: 'absolute',
        top: 0,
        right: 50,
        borderWidth: 1,
    },
    dropDownaction: {
        backgroundColor: "white",
        padding: 5,
        paddingLeft: 10,
    },
    middleDateDotContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    middleDateDotStyle: {
        fontSize: 5,
        color: 'white',
    },
    date: {
        fontFamily: "Poppins-Light",
        color: 'white',
        width: '100%',
        fontSize: 10,
        padding: 10
    },
    flexdirection: {
        flexDirection: "row"
    },
    chatMeDate: {
        fontSize: 10,
        position: 'absolute',
        bottom: 0,
        right: 0,
        fontFamily: "Poppins-Regular",
        color: 'white'
    },
    body: {
        fontSize: 17,
        color: 'white',
        fontFamily: "Poppins-Regular",
        padding: 7
    },
    chatMe: {
        backgroundColor: "#6087af",
        borderRadius: 20,
        margin: 5,
        flexDirection: 'row-reverse',
        alignSelf: "flex-end",
        maxWidth: width / 1.2,
    },
    chat: {
        backgroundColor: "#2c3e50",
        borderRadius: 20,
        margin: 5,
        flexDirection: 'row',
        alignSelf: "flex-start",
        maxWidth: width / 1.2,
    },
    container: {
        backgroundColor: 'white',
        paddingTop: 12,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        flex: 1,
        justifyContent: 'flex-end',
    },
    // from components/mainComponent
    backgroundNull: {
        position: 'absolute',
        height: height,
        width: width,
        backgroundColor: 'grey',
        opacity: 0.2
    },
    input: {
        borderRadius: 10,
        borderBottomWidth: 1,
        fontFamily: "Poppins-Light",
        width: width / 1.2,
        padding: 10,
        margin: 10,
    },
    closeBtn: {
        position: 'absolute',
        right: 10,
        top: 30,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 9,
        paddingBottom: 9,
        borderRadius: 100,
        backgroundColor: '#2c3e50',
    },
    floatngBtn: {
        position: 'absolute',
        right: 5,
        bottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatigBtns: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        paddingBottom: 5,
        borderRadius: 100,
        backgroundColor: '#2c3e50',
        marginTop: 10,
    },
    addbutton: {
        position: 'absolute',
        right: 5,
        bottom: 60,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        // paddingBottom: 10,
        borderRadius: 100,
        backgroundColor: '#2c3e50',
        elevation: 4,
        shadowColor: '#fe2c55'
    },
    addtext: {
        fontSize: 50,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
    },


    normalWordInPostBody: {
        marginHorizontal: 2,
        fontSize: 17,
        fontFamily: 'Poppins-Regular'
    },
    colorTextInBodyTagAndMentionStyle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 17,
        color: "#fe2c55",
        marginHorizontal: 2,
    },
    widthByOne: {
        width: width / 1
    },
    middleDateDotContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    middleDateDotStyle: {
        fontSize: 5,
        color: 'grey',
    },
    // from list.js
    searhcAndExploreMoreFromChacha: {
        padding: 20,
        fontSize: 50,
        fontFamily: "Poppins-Bold",
        alignSelf: "center",
        color: '#2c3e50'
    },
    // from singleStatus.js
    dropDown: {
        width: width / 2,
        position: 'absolute',
        top: 0,
        right: 50,
        borderWidth: 1,
    },
    dropDownaction: {
        backgroundColor: "white",
        padding: 5,
        paddingLeft: 10,
    },
    dateAdded: {
        marginLeft: 5,
        fontFamily: "Poppins-ExtraLight",
        fontSize: 12
    },
    actionBtns: {
        alignSelf: 'center',
        color: '#2c3e50',
        position: 'absolute',
        top: 20,
        right: 20,
    },
    authorStyle: {
        fontFamily: "Poppins-ExtraLight",
        fontSize: 15,
    },
    bodyStyle: {
        fontSize: 15,
        fontFamily: "Poppins-Regular",
    },
    lightStyle: {
        fontSize: 15,
        fontFamily: "Poppins-Regular",
    },
    boldStyle: {
        color: 'black',
        fontSize: 15,
        fontFamily: "Poppins-Bold",
    },
    topPart: {
        width: '100%',
        flexDirection: "row",
        backgroundColor: 'black'
    },
    lastPart: {
        justifyContent: 'space-between',
        flexDirection: "row",
    },
    rightPart: {
        width: '90%',
    },
    middlePart: {
        width: width,
        padding: 5
    },
    topPart: {
        paddingRight: 5
    },
    status: {
        flexDirection: "row",
        borderColor: '#2c3e50',
        borderWidth: 1,
        margin: 5,
        borderRadius: 20,
        padding: 5,
        backgroundColor: 'white',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
})