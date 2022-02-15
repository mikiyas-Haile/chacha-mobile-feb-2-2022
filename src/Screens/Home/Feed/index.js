import React, { useEffect, useState, useContext } from 'react'
import { View, Text, TouchableOpacity, Pressable, FlatList, Image } from 'react-native'
import { MainLookup } from '../../../Lookup'
import { AppContext } from '../../../../AppContext'
import AntDesign from 'react-native-vector-icons/AntDesign'
import ActionBtns, { RenderPostBody } from './ActionBtns'

export default function FeedScreen() {
    const ctx = useContext(AppContext)
    const [posts, setPosts] = useState([])
    const [postss, setPostss] = useState([])
    const [refreshing, setrefreshing] = useState(false)
    const LoadPostss = () => {
        setrefreshing(true)
        const cb = (r, c) => {
            setrefreshing(false)
            if (c === 200) { setPostss(r) }
        }
        MainLookup(cb, { method: 'GET', endpoint: '/api/post/list' })
    }
    useEffect(() => {
        const cb = (r, c) => {
            if (c === 200) { setPosts(r) }
        }
        MainLookup(cb, { method: 'GET', endpoint: '/api/post/feed' })
    }, [])
    useEffect(() => {
        LoadPostss()
    }, [])
    const renderData = ({ item, index }) => {
        return (
            <PostCard item={item} key={item.id} />
        )
    }
    return (
        <FlatList onRefresh={LoadPostss} refreshing={refreshing} keyExtractor={(i, k) => k.toString()} data={postss} renderItem={renderData} />
    )
}

export function PostCard(props) {
    const { item } = props
    const ctx = useContext(AppContext)
    const DontShowViewButton = props.DontShowViewButton ? props.DontShowViewButton : true
    const isParent = props.isParent ? props.isParent : false

    const ViewProfile = (username) => {
        nav.push('View Profile', { username: username })
        // window.location.href = `/user/${username}`
    }
    const ViewPost = (username, id) => {
        // window.location.href = `/${username}/${id}`
        nav.push('View Post', { username: username, id: id })
    }
    return (
        <>
            <Pressable onPress={() => (ViewPost(item.author.username, item.id))} style={{
                margin: 3,
                borderWidth: 1,
                borderColor: '#2c3e50',
                borderRadius: 5,
                padding: 10,
                backgroundColor: ctx.bgColor,
                color: ctx.textColor,
                borderRadius: 20,
                position: 'relative'
            }}>
                <Pressable onPress={() => (ViewProfile(item.author.username))} style={{ flexDirection: 'row' }}>
                    <Image style={{
                        width: 50,
                        height: 50,
                        borderRadius: 100,
                        marginRight: 6
                    }} source={{ uri: `${item.author.pfp}` }} />
                    <View>
                        <View style={{ height: 40, alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ fontFamily: "Poppins-Bold", fontSize: 17, color: ctx.textColor }}>
                                {item.author.display_name}
                            </Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 17, color: ctx.textColor }}>
                                @{item.author.username}
                            </Text>
                            {item.author.is_verified ? <AntDesign name='ai-fill=circle' size={17} color={'#00a2f9'} /> : null}
                        </View>
                        <Text style={{ fontFamily: 'Poppins-Light', fontSize: 15, marginRight: 5, color: ctx.textColor }}>{DateAdded(item.date_added)}</Text>
                    </View>
                </Pressable>
                <Text style={{ fontFamily: 'Poppins-Light', fontSize: 15, color: ctx.textColor }}>
                    <RenderPostBody isParent={isParent} status={item} isComment={false} />
                </Text>
                <ActionBtns DontShowViewButton={DontShowViewButton} isParent={isParent} item={item} />
            </Pressable>
        </>
    )
}


export function DateAdded(str) {
    var dateCalender = str.split("T")[0]
    var time = str.split("T")[1].split(".")[0]
    return dateCalender
}