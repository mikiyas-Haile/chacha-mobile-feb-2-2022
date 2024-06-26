import { TouchableOpacity, Dimensions, Text, View, Pressable, StyleSheet, Linking, Alert } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MainLookup } from '../../../Lookup'
import { host } from '../../../Components/host'
import { TranslateApi } from '../../../Components/Translate'

import React, { useContext, useEffect, useState } from 'react'

import { PostCard } from "./index";
import { AppContext } from "../../../../AppContext";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('window')

const ICONSIZE = 23
const FONT_SIZE = 13


export default function ActionBtns(props) {
    const nav = useNavigation();
    const ctx = useContext(AppContext);

    const { item, isParent, DontShowViewButton, likess, hasLikedd, sethasLikedd,setLikess } = props;
    const [likes, setLikes] = useState(item.likes.length > 0 ? item.likes.length : ' ');
    const [comments, setComments] = useState(item.comments > 0 ? item.comments : ' ');
    const [replies, setReplies] = useState(item.replies > 0 ? item.replies : ' ');
    const [disLikes, setDisLikes] = useState(item.dislikes.length > 0 ? item.dislikes.length : ' ');


    const [hasLiked, setHasLiked] = useState(item.has_liked);
    const [hasDisLiked, setHasDisLiked] = useState(item.has_disliked);

    const DisLikeBtn = hasDisLiked ? <AntDesign name='dislike1' size={ICONSIZE} color="#2c3e50" /> : <AntDesign name='dislike2' size={ICONSIZE} color="#2c3e50" />
    const realLike = hasLikedd ? hasLikedd : hasLiked;
    const LikeBtn = realLike ? <AntDesign name='like1' size={ICONSIZE} color="#fe2c55" /> : <AntDesign name='like2' size={ICONSIZE} color="#2c3e50" />
    const [CSRFToken, setCSRFTOKEN] = useState()
    useEffect(() => {
        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])
    const PostAction = (action) => {
        const cb = (r, c) => {
            if (c === 201 || c === 200) {
                setLikes(r.likes.length > 0 ? r.likes.length : ' ')
                setLikess(r.likes.length > 0 ? r.likes.length : ' ')
                setComments(r.comments > 0 ? r.comments : ' ')
                setReplies(r.replies > 0 ? r.replies : ' ')
                setDisLikes(r.dislikes.length > 0 ? r.dislikes.length : '')

                setHasDisLiked(r.has_disliked)
                setHasLiked(r.has_liked)
                sethasLikedd(r.has_liked)
            } else {
                ctx.MyAlert("There was an error. Please try again")
                console.log(r, c)
            }
        }
        MainLookup(cb, { endpoint: `/api/post/action`, csrf: CSRFToken, method: 'POST', data: { action, id: item.id } })
    }
    const Like = () => {
        if (hasLiked) {
            PostAction('unlike')
        } else {
            PostAction('like')
        }
    }
    const DisLike = () => {
        if (hasDisLiked) {
            PostAction('undislike')
        } else {
            PostAction('dislike')
        }
    }
    const Comment = () => {
        // window.location.href = `/${item.author.username}/${item.id}/`
        nav.push('Comment on Post', { username: username, id: id })
    }
    const Reply = () => {
        // window.location.href = `/${item.author.username}/${item.id}/reply`
        nav.push('Reply to Post', { username: username, id: id })
    }
    const FONT_WEIGHT = ctx.LightFont
    return (
        <>
            <View style={{ flexDirection: 'row' }}>
                {likes > 0 || disLikes > 0 || replies > 0 || comments > 0 ?
                    <>
                        <>{likes > 0 ? <Text style={{ fontFamily: FONT_WEIGHT, fontSize: FONT_SIZE, color: ctx.textColor }}> {likess ? likess : likes} { ctx.language === 'Amharic' ? "ወደውታል" : TranslateApi({ str: 'Likes', id : 5 })} <Text style={{ fontSize: 13, marginRight: 5 }}> • </Text></Text> : null}</>
                        <>
                            {disLikes > 0 ? <Text style={{ fontFamily: FONT_WEIGHT, fontSize: FONT_SIZE, color: ctx.textColor }}> {disLikes} { ctx.language === 'Amharic' ? "ኣልወደዱትም" : TranslateApi({ str: 'Dislikes', id : 6 })} <Text style={{ fontSize: 13, marginRight: 5 }}> • </Text></Text> : null}
                        </>
                        <>
                            {comments > 0 ? <Text style={{ fontFamily: FONT_WEIGHT, fontSize: FONT_SIZE, color: ctx.textColor }}> {comments} { ctx.language === 'Amharic' ? "ኣስተያየት ሰጠዋል" : TranslateApi({ str: 'Comments', id : 7 })} <Text style={{ fontSize: 13, marginRight: 5 }}> • </Text></Text> : null}
                        </>
                        <>
                            {replies > 0 ? <Text style={{ fontFamily: FONT_WEIGHT, fontSize: FONT_SIZE, color: ctx.textColor }}> {replies} { ctx.language === 'Amharic' ? "ምላሾች ኣሉት" : TranslateApi({ str: 'Reposts', id : 8 })} </Text> : null}
                        </>
                    </>
                    : null
                }
            </View>
            <View style={{ width: "30%", flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={Like}>
                    {LikeBtn}
                </TouchableOpacity>

                <TouchableOpacity onPress={DisLike}>
                    {DisLikeBtn}
                </TouchableOpacity>

                {/* <TouchableOpacity onPress={Comment}>
                    <EvilIcons name='comment' color="#2c3e50" size={ICONSIZE} />
                </TouchableOpacity>

                <TouchableOpacity onPress={Reply}>
                    <EvilIcons name='share-google' color="#2c3e50" size={ICONSIZE} />
                </TouchableOpacity> */}
            </View>
        </>
    );
}
export function RenderPostBody(props) {
    const { status, isParent, isComment, dontShowPic } = props
    const [body, setBody] = useState(status.body ? status.body : 'post is deleted')
    const [IsTag, setIsTag] = useState(false)
    const [tagss, settags] = useState([])
    let tags = []
    useEffect(() => {
        const val = body.includes("#")
        if (val === true) {
            var array = body.split(' ')
            array.forEach(word => {
                const val = word.includes("#")
                if (val === true) {
                    settags([...tagss].concat(word))
                    tags.push(word)
                    setIsTag(true)
                }
            });
        } else {
            setIsTag(false)
        }
    }, [])
    if (isComment) {
        return (
            <View>
                <BodyRender IsTag={IsTag} status={status} />
            </View>
        )
    } else {
        if (status.parent) {
            return (
                <View>
                    {!status.parent.parent && <PostCard isParent={true} dontShowPic={true} item={status.parent} />}
                    <View>
                        <BodyRender IsTag={IsTag} status={status} />
                    </View>
                </View>
            )
        } else {
            return (
                <View>
                    <BodyRender tagss={tagss} IsTag={IsTag} status={status} />
                </View>
            )
        }
    }
}
export function BodyRender(props) {
    const { status, IsTag, tagss, token, dontShowPic } = props
    const body = status.body.split(" ")
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const [result, setResult] = useState(null);

    const OpenUrl = async (url) => {
        nav.push("View Page", { url })
        // Linking.openURL(url)
    }

    return (
        <View style={{ width: width, alignSelf: 'center' }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '80%' }}>
                <Text style={{ color: 'red' }}>{result && JSON.stringify(result)}</Text>
                {body.map((item, index) => {
                    const val = item[0] === "#"
                    const ping = item[0] === '@'
                    const link = item.toLowerCase().includes('http') || item.toLowerCase().includes('https')
                    if (val || ping || link) {
                        if (val) {
                            return (
                                <TouchableOpacity key={index} onPress={() => (nav.navigate('View Hashtag', { hashtag: item }))} style={{ paddingRight: 1 }}>
                                    <Text style={[styles.colorTextInBodyTagAndMentionStyle, { color: ctx.scheme === 'dark' ? ctx.textColor : '#fe2c55' }]}>{item}</Text>
                                </TouchableOpacity>
                            )
                        } else if (link) {
                            return (
                                <TouchableOpacity key={index} onPress={() => (OpenUrl(item))} style={{ paddingRight: 1 }}>
                                    <Text style={[styles.colorTextInBodyTagAndMentionStyle, { color: ctx.scheme === 'dark' ? ctx.textColor : '#fe2c55' }]}>{item.split('/', 3)[2]}</Text>
                                </TouchableOpacity>
                            )
                        } else {
                            return (
                                <TouchableOpacity key={index} onPress={() => (nav.navigate('View Profile', { user: item.replace("@", '') }))} style={{ paddingRight: 1 }}>
                                    <Text style={[styles.colorTextInBodyTagAndMentionStyle, { color: ctx.scheme === 'dark' ? ctx.textColor : '#fe2c55' }]}>{item}</Text>
                                </TouchableOpacity>
                            )
                        }
                    } else {
                        return (
                            <View key={index} style={{ paddingRight: 1 }}>
                                <Text style={[styles.normalWordInPostBody, { color: ctx.textColor }]}>{item}</Text>
                            </View>
                        )
                    }
                })}
            </View>
        </View>
    )
}

export function ReturnColoredString(props) {
    const ctx = useContext(AppContext);
    const { item, index, status } = props;
    const [Opacity, setOpacity] = useState(0)
    const nav = useNavigation();


    const RealBody = status.body.split(' ');
    const [hasHash, setHasHash] = useState(false);
    const [hasMention, sethasMention] = useState(false);
    const [hasLink, sethasLink] = useState(false);


    useEffect(() => {
        RealBody.forEach(item => {
            setHasHash(item[0] == "#")
            sethasLink(item.includes('http') || item.includes('https'))
            sethasMention(item[0] == '@')
        })
    }, [])

    return (
        <>
            <Text style={{ color: '#8ab4f8' }}>{item}</Text>
        </>
    )
}
function ReturnWordTagOrText(item) {
    if (item.includes('http') || item.includes('https')) {
        item = item.replace("https" ? "https" : 'http', '')
        item = item.split('/', 3)[2]
        return item
    }
    return item
}
const styles = StyleSheet.create({
    normalWordInPostBody: {
        marginHorizontal: 2,
        fontSize: 15,
        fontFamily: 'Poppins-Regular'
    },
    colorTextInBodyTagAndMentionStyle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 15,
        // color: "#fe2c55",
        marginHorizontal: 2,
    },
})