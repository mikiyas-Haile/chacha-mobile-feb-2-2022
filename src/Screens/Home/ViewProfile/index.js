import { ScrollView, Image, View, ImageBackground, Text, TouchableOpacity, TextInput, TouchableWithoutFeedback, StyleSheet, Modal, Dimensions, ActivityIndicator } from 'react-native'
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
import { RenderUserPfpsList } from '../Profile/index'

const { height, width } = Dimensions.get('window')

export default function ViewProfile(props) {
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const { user } = props?.route?.params;
    const [filled, setFilled] = useState(false);
    const [UserNotFound, setUserNotFound] = useState(false)
    const [User, setUser] = useState([]);
    const [pfps, setpfps] = useState([]);

    useEffect(() => {
        if (user["pfps"] === undefined) {
            const cb = (r, c) => {
                if (c === 200) {
                    setpfps(r?.pfps ? r?.pfps : [])
                    setUser(r)
                    setFilled(true)
                } else if (c === 404) {
                    setUserNotFound(true)
                } else {
                    setLoaded(false)
                    ctx.MyAlert("There was an error Please try again later")
                }
            }
            MainLookup(cb, { method: 'GET', endpoint: `/api/user/${user}/no-post` })
        } else {
            setpfps(user?.pfps ? user?.pfps : [])
            setFilled(true)
            setUser(user)
        }
    }, [])

    useEffect(() => {

        return () => {
            setUser([]);
            setFilled(false)
        }
    }, [])

    const profileProps = { User, UserNotFound, pfps }
    if (filled) {
        return (
            <RenderProfile {...profileProps} />
        )
    } else {
        return (
            <View style={{
                flex: 1,
                backgroundColor: ctx.bgColor,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <ActivityIndicator size={'large'} color={ctx.textColor} />
            </View>
        )
    }

}
function RenderProfile(props) {
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const { User, UserNotFound, pfps } = props;
    const [loaded, setLoaded] = useState(true);

    return (
        <>
            {pfps ? <ScrollView style={{
                flex: 1,
                backgroundColor: ctx.bgColor,
            }}>
                <ProfileCard pfps={pfps} profile={User} />
            </ScrollView> : <View />}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                top: 20,
                left: 0,
                padding: 20,
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => (nav.pop())} style={{ backgroundColor: '#17171795', padding: 10, borderRadius: 100 }}>
                    <IonIcons name='arrow-back' color={'white'} size={25} />
                </TouchableOpacity>
            </View>
        </>
    )
}
function ProfileCard({ profile, pfps }) {
    const nav = useNavigation();
    const ctx = useContext(AppContext);
    const [Followers, setFollowers] = useState(profile.followers);
    const [Following, setFollowing] = useState(profile.following);
    const [Posts, setPosts] = useState(profile.posts);


    const [IsFollowing, setIsFollowing] = useState(profile.is_following);
    const [IsFriends, setIsFriends] = useState(profile.friends);
    const [IsBlocked, setIsBlocked] = useState(profile.is_blocked);
    const [IsMyProfile, setIsMyProfile] = useState(profile.is_my_profile);
    const [IsVerified, setIsVerified] = useState(profile.is_verified);
    const [HasBlocked, setHasBlocked] = useState(profile.has_blocked);
    const [BlockedUsers, setBlockedUsers] = useState(profile.blocked_users);
    const [BlockingUsers, setBlockingUsers] = useState(profile.blocking_users);

    useEffect(() => {
        setBlockingUsers(profile.blocking_users)
        setBlockedUsers(profile.blocked_users)
        setFollowers(profile.followers)
        setFollowing(profile.following)
        setPosts(profile.posts)

        setIsFriends(profile.friends)
        setIsBlocked(profile.is_blocked)
        setIsFollowing(profile.is_following)
        setIsMyProfile(profile.is_my_profile)
        setIsVerified(profile.is_verified)
        setHasBlocked(profile.has_blocked)
    }, [profile])
    const [CSRFToken, setCSRFTOKEN] = useState()
    // FETCH CSRFTOKEN
    useEffect(() => {
        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])
    const [showMore, setshowMore] = useState(false)
    const FollowLookup = (action) => {
        const cb = (r, c) => {
            console.log(r, c)
            if (c === 201 || c === 200) {
                setBlockingUsers(r.other.blocking_users)
                setBlockedUsers(r.other.blocked_users)
                setFollowers(r.other.followers)
                setFollowing(r.other.following)
                setPosts(r.other.posts)

                setIsBlocked(r.other.is_blocked)
                setIsFollowing(r.other.is_following)
                setIsMyProfile(r.other.is_my_profile)
                setIsVerified(r.other.is_verified)
                setHasBlocked(r.other.has_blocked)
                setIsFriends(r.other.friends)
            }
        }
        MainLookup(cb, { csrf: CSRFToken, endpoint: `/api/user/action`, method: 'POST', data: { action: action, id: profile.id } })
    }

    const Follow = () => {
        if (!IsMyProfile) {
            if (IsFollowing) {
                FollowLookup('unfollow')
            } else {
                FollowLookup('follow')
            }
        }
    }
    const Block = () => {
        if (!IsMyProfile) {
            if (IsBlocked) {
                FollowLookup('unblock')
            } else {
                FollowLookup('block')
            }
        }
    }
    const ModalCallback = (type, item) => {
        if (type === 'block') {
            Block()
        } else if (type === 'unfollow') {
            Follow()
        }
    }
    const NumberStyles = {
        color: ctx.textColor,
        fontSize: 13,
        fontFamily: "Poppins-Regular"
    }
    return (
        <>
            {pfps.length > 0 && <RenderUserPfpsList pfps={pfps} viewing={true} user={profile} />}
            {IsBlocked ?
                <View>
                    <View style={{
                        borderRadius: 5,
                        fontSize: 17,
                        color: 'white',
                        flexDirection: 'row',
                        padding: 5,
                        width: '50%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: '#2c3e50',
                        borderWidth: 1,
                        marginLeft: 5
                    }}>
                        <IonIcons name='warning' color={'red'} size={18} />
                        <Text style={{ fontFamily: 'Poppins-Regular', color: ctx.textColor }}>Blocked by you</Text></View>
                </View> : null}
            {/* Pfp / Following / Followers etc.. */}

            <ActionBtns pfps={pfps} IsFollowing={IsFollowing} IsMyProfile={IsMyProfile} Follow={Follow} IsFriends={IsFriends} NumberStyles={NumberStyles} Followers={Followers} Following={Following} Posts={Posts} />

            <View style={{
                padding: 10
            }}>
                <Text style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    color: ctx.textColor
                }}><RenderBio str={profile.bio} /></Text>
            </View>
            {!IsMyProfile &&
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    position: 'absolute',
                    top: 20,
                    right: 0,
                    padding: 20,
                    alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={() => (setshowMore(true))} style={{ backgroundColor: '#17171795', padding: 10, borderRadius: 100 }}>
                        <Feather name='more-vertical' size={20} color={'white'} />
                    </TouchableOpacity>
                </View>}
            <MoreModal IsBlocked={IsBlocked} IsMyProfile={IsMyProfile} HasBlocked={HasBlocked} IsFollowing={IsFollowing} callback={ModalCallback} item={profile} showMore={showMore} setshowMore={setshowMore} />
        </>
    )
}
function MoreModal({ item, showMore, setshowMore, callback, IsFollowing, HasBlocked, IsMyProfile, IsBlocked }) {
    const more = showMore;
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const Block = () => {
        setshowMore(false)
        callback('block', item)
    }
    const UnFollow = () => {
        setshowMore(false)
        callback('unfollow', item)
    }
    return (
        <Modal
            animated
            animationType={"fade"}
            statusBarTranslucent
            visible={more}
            transparent
            onDismiss={() => (setshowMore(false))}
            onRequestClose={() => (setshowMore(false))}>
            <TouchableWithoutFeedback onPress={() => (setshowMore(false))}>
                <View style={{ flex: 1, backgroundColor: '#00000070' }}>
                    <View style={{ backgroundColor: ctx.bgColor, marginTop: 'auto', padding: 10, borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                        <View style={{ width: '10%', height: 5, borderRadius: 20, alignSelf: 'center', backgroundColor: "lightgray" }} />
                        {IsMyProfile ?
                            <TouchableOpacity onPress={() => nav.push("My Profile")} style={{ padding: 10, borderColor: '#2c3e50' }}>
                                <Text style={{ color: ctx.textColor, fontFamily: 'Poppins-Medium', fontSize: 15 }}>Settings</Text>
                            </TouchableOpacity> : null}
                        {IsFollowing ?
                            <TouchableOpacity onPress={UnFollow} style={{ padding: 10, borderColor: '#2c3e50' }}>
                                <Text style={{ color: ctx.textColor, fontFamily: 'Poppins-Medium', fontSize: 15 }}>Unfollow @{item.username}</Text>
                            </TouchableOpacity> : null}
                        {!IsMyProfile ?
                            <TouchableOpacity onPress={Block} style={{ padding: 10, borderColor: '#2c3e50' }}>
                                <Text style={{ color: HasBlocked ? '#2c3e50' : 'red', fontFamily: 'Poppins-Medium', fontSize: 15 }}>{IsBlocked ? `Unblock @${item.username}` : `Block @${item.username}`}</Text>
                            </TouchableOpacity> : null}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}
function RenderBio({ str }) {
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    if (str) {
        return (
            <>
                {
                    str.split(/(\s+)/).map((item, index) => {
                        const hasMention = item[0] === ("@");
                        const hasHash = item[0] === ("#");
                        const hasLink = item.includes("http://") || item.includes("https://");
                        const noice = item === '69' || item === '69420'
                        const Press = () => {
                            if (hasMention) {
                                nav.push("View Profile", { user: item.replace("@", '') })
                            }
                            if (hasLink) {
                                nav.push("View Page", { url: item })
                            }
                        }
                        return (
                            <Text onPress={Press} key={index}
                                style={{
                                    fontFamily:
                                        hasMention
                                            || hasHash
                                            || hasLink
                                            || noice
                                            ? 'Poppins-Bold' : 'Poppins-Regular',
                                    color: ctx.textColor
                                }}>{item}</Text>
                        )
                    })
                }
            </>
        )
    }
    else {
        return <View />
    }
}
function ActionBtns({ pfps, IsFollowing, IsMyProfile, Follow, IsFriends, NumberStyles, Followers, Following, Posts }) {
    const nav = useNavigation();
    const ctx = useContext(AppContext);
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around'
        }}>
            <View style={{
                width: '25%'
            }}>
                {pfps.length > 0 && <Image style={{
                    width: 70,
                    height: 70,
                    borderRadius: 100,
                    marginHorizontal: 10
                }} source={{
                    uri: pfps[0].uri
                }} />}
            </View>
            <View style={{
                width: '60%'
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {!IsFollowing && !IsMyProfile && <TouchableOpacity onPress={Follow} style={{
                        padding: 5,
                        width: '50%',
                        borderColor: '#2c3e50',
                        borderWidth: 1,
                        borderRadius: 100,
                        alignItems: 'center',
                        marginHorizontal: 3
                    }}>
                        <Text style={{
                            color: ctx.textColor,
                            fontFamily: 'Poppins-Medium'
                        }}>Follow</Text>
                    </TouchableOpacity>}
                    {IsFollowing || IsFriends && <TouchableOpacity style={{
                        padding: 5,
                        width: '50%',
                        borderColor: '#2c3e50',
                        borderWidth: 1,
                        borderRadius: 100,
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            color: ctx.textColor,
                            fontFamily: 'Poppins-Medium'
                        }}>Message</Text>
                    </TouchableOpacity>}
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <View style={{
                        alignItems: 'center'
                    }}>
                        <Text style={NumberStyles}>{Followers}</Text>
                        <Text style={NumberStyles}>Followers</Text>
                    </View>
                    <View style={{
                        alignItems: 'center'
                    }}>
                        <Text style={NumberStyles}>{Following}</Text>
                        <Text style={NumberStyles}>Following</Text>
                    </View>
                    <View style={{
                        alignItems: 'center'
                    }}>
                        <Text style={NumberStyles}>{Posts}</Text>
                        <Text style={NumberStyles}>Posts</Text>
                    </View>
                </View>
                {IsFriends && IsFollowing ? <View style={{
                    borderRadius: 5,
                    fontSize: 17,
                    color: '#fe2c55',
                    backgroundColor: '#fe2c55',
                    flexDirection: 'row',
                    padding: 5,
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 5
                }}>
                    <Text style={{
                        fontFamily: 'Poppins-Regular',
                        color: 'white'
                    }}>Friends</Text>
                </View> : null}
                {!IsFriends && IsFollowing ? <View style={{
                    borderRadius: 5,
                    fontSize: 17,
                    backgroundColor: '#2c3e50',
                    flexDirection: 'row',
                    padding: 5,
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 5
                }}>
                    <Text style={{
                        fontFamily: 'Poppins-Regular',
                        color: 'white'
                    }}>Following</Text>
                </View> : null}
            </View>
        </View>);
}
