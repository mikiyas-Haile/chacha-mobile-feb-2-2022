import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Modal } from 'react-native'
import { useContext } from 'react'
import { AppContext } from '../../../../AppContext'
import { useNavigation } from '@react-navigation/native'

export default function MoreModal({ item, showMore, setshowMore, callback, IsFollowing, HasBlocked, IsMyProfile, IsBlocked }) {
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
