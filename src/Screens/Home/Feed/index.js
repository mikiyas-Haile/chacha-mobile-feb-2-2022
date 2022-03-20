import React, { useEffect, useState, useContext } from 'react'
import { RefreshControl, Platform, Animated as Am, View, Text, TouchableOpacity, Pressable, FlatList, Image, StyleSheet, Dimensions, ImageBackground, Modal, TouchableWithoutFeedback, TextInput } from 'react-native'
import { MainLookup, FetchLookup } from '../../../Lookup'
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
import { TranslateApi } from '../../../Components/Translate'
import Animated, { FadeIn, Layout, ZoomIn, ZoomOut, SlideInUp, SlideOutUp } from 'react-native-reanimated'
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window')


const HEADER_HEIGHT = 44 + Constants.statusBarHeight;
const BOX_SIZE = Dimensions.get('window').width / 2 - 12;

const wait = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};

const scrollAnim = new Am.Value(0);
const clampedScrollY = scrollAnim.interpolate({
    inputRange: [HEADER_HEIGHT, HEADER_HEIGHT + 1],
    outputRange: [0, 1],
    extrapolateLeft: 'clamp',
});
const minusScrollY = Am.multiply(clampedScrollY, -1);
const translateY = Am.diffClamp(minusScrollY, -HEADER_HEIGHT, 0);
const scale = scrollAnim.interpolate({
    inputRange: [0, 2 * HEADER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
});

export default function FeedScreen() {
    // export default function FeedScreen() {
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const [posts, setPosts] = useState([])
    const [postss, setPostss] = useState([])
    const [refreshing, setRefreshing] = React.useState(false);
    const [nextUrl, setnext] = useState()
    useEffect(() => {
        if (nextUrl) {
            const cb = (r, c) => {
                if (c === 200) {
                    setnext(r.next)
                    // setPostss([...postss].concat(r.results))
                    // setPostss([[...postss], [r.results]])
                    setPostss([...new Set([...postss, ...r.results])])
                }
            }
            FetchLookup(cb, { method: 'GET', endpoint: `/api/post/${nextUrl.split("/").slice(-1)}` })
        }
    }, [nextUrl])
    const LoadPostss = () => {
        setRefreshing(true)
        const cb = (r, c) => {
            setRefreshing(false)
            if (c === 200) {
                setPostss(r)
            }
        }
        FetchLookup(cb, { method: 'GET', endpoint: '/api/post/list' })
    }
    useEffect(() => {
        LoadPostss()
    },[])
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
    const [offset, setoffset] = useState(0)
    const [showInput, setShowInput] = useState(true)


    const scrollRef = React.useRef();

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => {
            setRefreshing(false);
        });
    }, []);
    return (
        <View style={styles.container}>
            <Am.ScrollView
            data={postss}
            renderItem={renderData}
                ref={scrollRef}
                contentContainerStyle={styles.gallery}
                style={{
                    zIndex: 0,
                    height: '100%',
                    elevation: -1,
                    paddingTop: 50
                }}
                scrollEventThrottle={1}
                bounces={true}
                showsVerticalScrollIndicator={false}
                onScroll={Am.event(
                    [{ nativeEvent: { contentOffset: { y: scrollAnim } } }],
                    { useNativeDriver: true }
                )}
                overScrollMode="never"
                contentInset={{ top: HEADER_HEIGHT }}
                contentOffset={{ y: -HEADER_HEIGHT }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                {postss.map(item => {
                    return (
                        <PostCard callback={callback} item={item} key={item.id} />
                    )
                })}
            </Am.ScrollView>
            <Am.View style={[styles.header, { transform: [{ translateY }] }]}>
                <MakeAQuickPostRenderer setBody={setBody} TranslateApi={TranslateApi} Post={Post} body={body} />
            </Am.View>
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
        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${ctx.token}`, }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])
    const [likess, setLikess] = useState()
    const [hasLikedd, sethasLikedd] = useState(item.has_liked)
    const [showHeart, setShowHeart] = useState(false)

    const fadeIn = () => {
        setShowHeart(true)
    };
    const fadeOut = () => {
        setShowHeart(false)
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
                // ctx.MyAlert(ctx.language === 'Amharic' ? 'መውደዶን ገልትዋል' : TranslateApi({str: "You Have Liked Picture", id: 1}))
            } else {
                setLikess(item.likes.length)
                sethasLikedd(false)
                ctx.MyAlert("There was an error trying to like picture Please try again")
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
                borderBottomWidth: 1,
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
                                </Text> : null}
                        </View>
                    </View>
                    {item.is_me ?
                        <TouchableOpacity onPress={() => setshowMore(!showMore)} style={{
                            marginLeft: 'auto'
                        }}>
                            <Feather name='more-vertical' size={20} color={ctx.textColor} />
                        </TouchableOpacity> : null}
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

                        {showHeart ?
                            <Animated.View exiting={ZoomOut} entering={ZoomIn} style={{
                                position: 'absolute',
                                alignSelf: 'center'
                            }}>
                                <Ionicons name='heart' color={'#fe2c55'} size={100} />
                            </Animated.View>
                            : null}
                    </View>
                    : null}
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
                            </Text> : null}
                    </View>
                    {SecondaryItem ? <ActionBtns setLikess={setLikess} sethasLikedd={sethasLikedd} hasLikedd={hasLikedd} likess={likess} DontShowViewButton={DontShowViewButton} isParent={isParent} item={SecondaryItem} /> : null}
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
                                <Text style={{ color: 'red', fontFamily: 'Poppins-Medium', fontSize: 15 }}>{ctx.language === 'Amharic' ? 'ቻቻዬን ኣጥፋ' : TranslateApi({ str: "Delete Post", id: 9 })}</Text>
                            </TouchableOpacity> : null}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}
function MakeAQuickPostRenderer({ setBody, TranslateApi, index, Post, body }) {
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    return (
        <Animated.View exiting={SlideOutUp} entering={SlideInUp} style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#2c3e50',
            paddingVertical: 10,
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: ctx.bgColor
        }}>
            <TextInput maxLength={200} style={{
                padding: 5,
                textAlign: 'left',
                // borderRadius: 30,
                fontFamily: ctx.RegularFont,
                color: ctx.textColor,
                width: '80%',
            }} multiline onChangeText={setBody} placeholder={ctx.language === 'Amharic' ? 'ፈጣን ቻቻ ላድርግ' : TranslateApi({ str: "Make a quick Post", id: 2 })} placeholderTextColor={'grey'}>
                {body.split(/(\s+)/).map((item, index) => {
                    return <Text key={index} style={{
                        fontFamily: item[0] === "@" || item[0] === "#" || item.includes("http://") || item.includes("https://") || item === '69' || item === '69420' ? 'Poppins-Bold' : 'Poppins-Regular',
                        color: ctx.textColor
                    }}>{item}</Text>;
                })}
            </TextInput>
            <TouchableOpacity onPress={Post} style={{
                // backgroundColor: '#0077ff',
                padding: 6,
                borderRadius: 100
            }}>
                <EvilIcons name='share-apple' size={35} color={ctx.textColor} />
            </TouchableOpacity>
        </Animated.View>);
}
function BottomButton({ scrollRef }) {
    const upButtonHandler = () => {
        scrollRef.current && scrollRef.current.scrollTo({ y: -HEADER_HEIGHT });
    };
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={upButtonHandler}
            style={styles.upButtonStyle}>
            <AntDesign name="upcircleo" size={48} color="green" />
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    gallery: {
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        paddingBottom: 50,
    },
    box: {
        height: BOX_SIZE,
        width: BOX_SIZE,
        margin: 4,
    },
    header: {
        // flex: 1,
        height: HEADER_HEIGHT,
        // paddingTop: Constants.statusBarHeight,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    title: {
        fontSize: 16,
    },
    upButtonStyle: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 70,
    },
    scrollTopButton: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    wrapper: {
        height: height / 2
    }
})