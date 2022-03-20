import { View, Text } from 'react-native'



export default function ProfileStatus(props) {
    const { HasBlocked, NumberStyles, Followers, Following, Posts, IsBlocked } = props
    return (
        <>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%'
            }}>
                <View style={{
                    alignItems: 'center'
                }}>
                    <Text style={NumberStyles}>{IsBlocked || HasBlocked ? 0 : Followers}</Text>
                    <Text style={NumberStyles}>Followers</Text>
                </View>
                <View style={{
                    alignItems: 'center'
                }}>
                    <Text style={NumberStyles}>{IsBlocked || HasBlocked ? 0 : Following}</Text>
                    <Text style={NumberStyles}>Following</Text>
                </View>
                <View style={{
                    alignItems: 'center'
                }}>
                    <Text style={NumberStyles}>{IsBlocked || HasBlocked ? 0 : Posts}</Text>
                    <Text style={NumberStyles}>Posts</Text>
                </View>
            </View>
        </>
    )
}

