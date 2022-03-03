import React, { useEffect, useState, useContext } from 'react'
import { View, Text, TouchableOpacity, Pressable, FlatList, Image, StyleSheet, Dimensions, ImageBackground, Modal, TouchableWithoutFeedback, TextInput, Animated } from 'react-native'
import { MainLookup } from '../../../Lookup'
import { AppContext } from '../../../../AppContext'
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import ActionBtns, { RenderPostBody } from './ActionBtns'
import Swiper from 'react-native-swiper'
import { PhotoCard } from '../Camera/index'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { host } from '../../../Components/host'
import DateAdded, { SecondaryDateAdded } from '../../../Components/DateAdded'

const { width, height } = Dimensions.get('window')

export default function FeedScreen() {
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const [posts, setPosts] = useState([])
    const [postss, setPostss] = useState([])
    const [refreshing, setrefreshing] = useState(false)
    const [nextUrl, setnext] = useState()
    useEffect(() => {
        if (nextUrl) {
            const cb = (r, c) => {
                if (c === 200) {
                    setnext(r.next)
                    // setPostss([...postss].concat(r.results))
                    // setPostss([[...postss], [r.results]])
                    setPostss([...new Set([...postss ,...r.results])])
                }
            }
            MainLookup(cb, { method: 'GET', endpoint: `/api/post/${nextUrl.split("/").slice(-1)}` })
        }
    }, [nextUrl])
    const LoadPostss = () => {
        setrefreshing(true)
        const cb = (r, c) => {
            setrefreshing(false)
            if (c === 200) {
                setPostss(r)
            }
        }
        MainLookup(cb, { method: 'GET', endpoint: '/api/post/list' })
    }
    // useEffect(() => {
    //     const cb = (r, c) => {
    //         if (c === 200) { setPosts(r) }
    //     }
    //     MainLookup(cb, { method: 'GET', endpoint: '/api/post/feed' })
    // }, [])
    useEffect(() => {
        LoadPostss()
        return () => {
            // setPosts([]);
            // setPostss([]);
        }
    }, [])
    const callback = (type, item) => {
        const posts = postss.filter(obj => obj.id !== item.id)
        try {
            setPostss(posts)
        } catch (e) {
            console.log(e)
            setPostss([posts])
        }
    }
    const renderData = ({ item, index }) => {
        return (
            <PostCard callback={callback} item={item} key={item.id} />
        )
    }
    const [body, setBody] = useState('');
    const Post = () => {
        if (body) {
            setBody('')
            const callback = (r, c) => {
                if (c === 201) {
                    setPostss([r, ...postss])
                }
            }
            ctx.Post(body, callback)
        }
    }
    return (
        <View style={{
            flex: 1,
            backgroundColor: ctx.bgColor,
            // paddingTop: 50
        }}>
            <View style={{
                flexDirection: 'row',
                alignSelf: 'center',
                paddingVertical: 10
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
                    }} multiline onChangeText={setBody} placeholder={ctx.language === 'English' ? 'Make a quick post' : 'ፈጣን ቻቻ ላድርግ'} placeholderTextColor={'grey'} >
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
            <FlatList
                ListFooterComponent={() => (
                    <View style={{
                        height: height / 2,
                        width: width,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <TouchableOpacity onPress={() => nav.push('Home', { screen: 'Create' })} style={{
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: ctx.textColor,
                            borderWidth: 1,
                            borderRadius: 10,
                            width: width / 3,
                            height: height / 4,
                            padding: 10
                        }}>
                            <Ionicons name='add-circle-outline' color={ctx.textColor} size={width / 4} />
                            <Text style={{
                                fontFamily: 'Poppins-Regular',
                                textAlign: 'center',
                                fontSize: 13,
                                color: ctx.textColor,
                            }} >{ctx.language === 'English' ? 'Posts from friends will appear here' : 'የወዳጅ ቻቻዎች እዚህ ይታያሉ'}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                onRefresh={LoadPostss} refreshing={refreshing} keyExtractor={(i, k) => k.toString()} data={postss} renderItem={renderData} />
        </View>
    )
}

export function PostCard(props) {
    const { item, callback } = props;
    const [SecondaryItem, setSecondaryItem] = useState()
    useEffect(() => {
        setSecondaryItem(props.item)
    }, [props.item, SecondaryItem, setSecondaryItem])
    const nav = useNavigation()
    const ctx = useContext(AppContext)
    const DontShowViewButton = props.DontShowViewButton ? props.DontShowViewButton : true
    const isParent = props.isParent ? props.isParent : false
    const ViewProfile = (username) => {
        // nav.push('View Profile', { username: username })
        // window.location.href = `/user/${username}`
        nav.push('View Profile', { user: item.author })
    }
    const ViewPost = (username, id) => {
        // window.location.href = `/${username}/${id}`
        nav.push('View Page', { url: `${host}/${username}/${id}` })
    }
    const hasImageInPost = item.attachements ? item.attachements.length : 0 > 0;
    const [showMore, setshowMore] = useState(false);
    let [backCount, setbackCount] = useState(0)
    const [CSRFToken, setCSRFTOKEN] = useState()
    useEffect(() => {
        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])
    const [heartVisibility, setheartVisibility] = useState(0)
    const [likess, setLikess] = useState()
    const [hasLikedd, sethasLikedd] = useState(item.has_liked)
    const [state, setState] = useState({
        fadeAnimation: new Animated.Value(0),
        // size:
    })

    const fadeIn = () => {
        Animated.timing(state.fadeAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    };
    const fadeOut = () => {
        Animated.timing(state.fadeAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start();
    };
    const ShowHeart = () => {
        // setheartVisibility(1)
        fadeIn()
        setTimeout(() => {
            // setheartVisibility(0)
            fadeOut()
        }, 500)
    }
    const PostAction = (action) => {
        sethasLikedd(true)
        ShowHeart()
        if (!hasLikedd) {
            setLikess(item.likes.length + 1)
        }
        const cb = (r, c) => {
            if (c === 201 || c === 200) {
                setLikess(r.likes.length)
                setSecondaryItem(r)
                // ctx.MyAlert("You have liked Picture")
            } else {
                setLikess(item.likes.length)
                sethasLikedd(false)
                ctx.MyAlert(ctx.language === 'English' ? "There was an error trying to like picture Please try again" : 'ቻቻን መውደድ ኣልተቻለም እባኮን ትንሽ ቆይተው ይሞክሩ')
                console.log(r, c)
            }
        }
        MainLookup(cb, { endpoint: `/api/post/action`, csrf: CSRFToken, method: 'POST', data: { action, id: item.id } })
    }
    const Like = () => {
        PostAction('like')
    }
    if (!item) {
        return <View />
    }

    return (
        <>
            <Pressable style={{
                borderColor: ctx.scheme === 'light' ? 'lightgrey' : '#2c3e50',
                borderRadius: 5,
                backgroundColor: ctx.bgColor,
                color: ctx.textColor,
                position: 'relative',
                borderBottomWidth: 2,
                paddingVertical: 10
            }}>
                <Pressable onPress={() => (ViewProfile(item.author.username))} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10 }}>
                    <Image style={{
                        width: 40,
                        height: 40,
                        borderRadius: 100,
                        marginRight: 6,
                    }} source={{ uri: `${item.author.pfp}` }} />
                    <View>
                        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ fontFamily: "Poppins-Bold", fontSize: 15, color: ctx.textColor }}>
                                {item.author.display_name ? item.author.display_name : item.author.username}
                            </Text>
                            {!hasImageInPost ?
                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15, color: ctx.textColor, opacity: .9 }}>
                                    @{item.author.username}
                                </Text> : null}
                            {item.author.is_verified ? <AntDesign style={{ marginLeft: 5 }} name='checkcircle' size={17} color={'#00a2f9'} /> : null}
                            {hasImageInPost ?
                                <Text style={{ fontFamily: 'Poppins-Light', fontSize: 13, marginRight: 5, marginLeft: 5, color: ctx.textColor, opacity: .9 }}>
                                    • {DateAdded(item.date_added)}
                                </Text>:null}
                        </View>
                    </View>
                    {item.is_me ?
                        <TouchableOpacity onPress={() => setshowMore(!showMore)} style={{
                            marginLeft: 'auto'
                        }}>
                            <Feather name='more-vertical' size={20} color={ctx.textColor} />
                        </TouchableOpacity>:null}
                </Pressable>
                {hasImageInPost ?
                    <View style={{
                        position: 'relative',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Swiper
                            onTouchEnd={() => {
                                setbackCount(backCount++)
                                if (backCount == 2) {
                                    Like()
                                    console.log("Clicked twice.....")
                                } else {
                                    const backTimer = setTimeout(() => {
                                        setbackCount(0)
                                    }, 3000)
                                }
                            }}
                            activeDotColor={ctx.textColor}
                            style={styles.wrapper}>
                            {item.attachements.map((item, index) => {
                                return (
                                    <ImageCard item={item} key={index} />
                                )
                            })}
                        </Swiper>

                        <Animated.View style={{
                            opacity: state.fadeAnimation,
                            position: 'absolute',
                            alignSelf: 'center'
                        }}>
                            <Ionicons name='heart' color={'#fe2c55'} size={100} />
                        </Animated.View>
                    </View>
                :null}
                <View style={{
                    padding: 10
                }}>
                    <Text style={{ fontFamily: 'Poppins-Light', fontSize: 13, color: ctx.textColor }}>
                        <RenderPostBody isParent={isParent} status={item} isComment={false} />
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontFamily: 'Poppins-Light', fontSize: 13, color: ctx.textColor, opacity: .8 }}>
                            {SecondaryDateAdded(item.date_added)}
                        </Text>
                        {!hasImageInPost ?
                            <Text style={{ fontFamily: 'Poppins-Light', fontSize: 13, marginRight: 5, marginLeft: 5, color: ctx.textColor, opacity: .9 }}>
                                • {DateAdded(item.date_added)}
                            </Text>:null}
                    </View>
                    {SecondaryItem ? <ActionBtns setLikess={setLikess} sethasLikedd={sethasLikedd} hasLikedd={hasLikedd} likess={likess} DontShowViewButton={DontShowViewButton} isParent={isParent} item={SecondaryItem} />:null}
                </View>
            </Pressable>
            <MoreModal callback={callback} setshowMore={setshowMore} showMore={showMore} item={item} />
        </>
    )
}
function ImageCard({ item }) {
    item = item.uri

    return (
        <ImageBackground blurRadius={100} style={{ height: '100%', width: '100%' }} source={{ uri: item }}>
            <Image style={{ height: '100%', width: '100%' }} source={{ uri: item }} />
        </ImageBackground>
        // <PhotoCard key={index} DontShowTick={true} callback={callback} width_={width} height_={height / 2} item={item} index={index} />
    )
}
function MoreModal({ item, showMore, setshowMore, callback }) {
    const more = showMore;
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const Delete = () => {
        setshowMore(false)
        const cb = (r, c) => {
            if (c === 200) {
                callback('deleted', item)
                ctx.MyAlert(`Post deleted successfully.`)
            } else {
                ctx.MyAlert(`Couldn't delete post Please try again`)
            }
        }
        MainLookup(cb, { endpoint: `/api/post/${item.id}/delete`, method: 'GET' })
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
                        {item.is_me ?
                            <TouchableOpacity onPress={Delete} style={{ padding: 10, borderColor: '#2c3e50' }}>
                                <Text style={{ color: 'red', fontFamily: 'Poppins-Medium', fontSize: 15 }}>Delete Post</Text>
                            </TouchableOpacity> : null}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        height: height / 2
    }
})