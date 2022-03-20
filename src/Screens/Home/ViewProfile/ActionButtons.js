import { View, Text, TouchableOpacity } from 'react-native'
import { useContext } from 'react'
import { AppContext } from '../../../../AppContext'
import ProfileStatus from './ProfileStatus'
import ProfilePictureCircle from './ProfilePictureCircle'
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'


export default function ActionBtns(props) {
    const { HasBlocked, profile, pfps, IsFollowing, Follow, IsBlocked, NumberStyles, Followers, Following, Posts, IsMyProfile } = props
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const ActionButtonStyle = {
        padding: 5,
        width: '40%',
        borderColor: '#2c3e50',
        borderWidth: 1,
        borderRadius: 100,
        alignItems: 'center',
        marginHorizontal: 3
    }
    const ActionButtonTextStyle = {
        color: ctx.textColor,
        fontFamily: 'Poppins-Medium',
        textAlign: 'center'
    }
    const NotificationStyle = {
        borderRadius: 100,
        fontSize: 17,
        color: '#fe2c55',
        backgroundColor: '#fe2c55',
        flexDirection: 'row',
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    }
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around'
        }}>
            <ProfilePictureCircle {...props} />
            <View style={{
                width: '60%'
            }}>
                {IsBlocked || HasBlocked ?
                    <TouchableOpacity style={[ActionButtonStyle,  { width: '100%' }]}>
                        <IonIcons name='warning' color={'orange'} size={18} />
                        <Text style={[ActionButtonTextStyle,{ fontFamily: 'Poppins-Bold' }]}>
                            {HasBlocked ? 'An error has occured, Please try again later' : `You have Blocked @${profile.username}` }
                        </Text>
                    </TouchableOpacity> : null}

                <ProfileStatus {...props} />
                
                {!IsMyProfile && !IsBlocked && !HasBlocked &&
                    <>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 }}>

                            {!profile.friends && IsFollowing ?
                                <View style={NotificationStyle}>
                                    <Text style={ActionButtonTextStyle}>Following</Text>
                                </View> : null}
                            {!IsFollowing &&
                                <TouchableOpacity onPress={Follow} style={ActionButtonStyle}>
                                    <Text style={ActionButtonTextStyle}>Follow</Text>
                                </TouchableOpacity>}
                            {IsFollowing || profile.friends ?
                                <TouchableOpacity onPress={() => nav.push("Room", { otherUser: profile.username, notice: `Chat with @${profile.username}` })} style={ActionButtonStyle}>
                                    <Text style={ActionButtonTextStyle}>Chat</Text>
                                </TouchableOpacity> : null}
                            {profile.friends && IsFollowing ?
                                <View style={NotificationStyle}>
                                    <Text style={ActionButtonTextStyle}>Friends</Text>
                                </View> : null}
                        </View>
                    </>
                    }
            </View>
        </View>);
}
