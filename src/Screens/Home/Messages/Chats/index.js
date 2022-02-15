import React, { useEffect, useState } from 'react';
// import { AiFillHeart, AiOutlineHeart, AiFillCheckCircle } from "react-icons/ai";
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MainLookup } from '../../../../Lookup'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Pressable } from 'react-native'
import { Msg } from './singleMsg'


function Chats() {
    const [Chats, setChats] = useState([]);
    useEffect(() => {
        const timer = setInterval(() => {
            const cb = (r, c) => {
                if (c === 200 || c === 201) {
                    setChats(r)
                }
            }
            MainLookup(cb, { endpoint: `/api/my-chats`, method: 'GET' })
        }, 1000)
        return () => clearInterval(timer);
    })

    return <FlatList data={Chats} renderItem={({ item, index }) => {
        return <Msg chat={item} key={index} />
    }} />
}


export default Chats;
