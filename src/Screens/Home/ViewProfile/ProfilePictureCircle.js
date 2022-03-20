import { Image, View } from 'react-native'

export default function ProfilePictureCircle({ pfps, HasBlocked }) {
    const PfpCircleStyle = {
        width: 70,
        height: 70,
        borderRadius: 100,
        marginHorizontal: 10
    }
    return (
        <View style={{
            width: '25%'
        }}>
            {pfps.length > 0 &&
            <>
            
            {!HasBlocked ?
            <Image style={PfpCircleStyle} source={{
                    uri: pfps[0].uri
                }} /> :
                <View style={[PfpCircleStyle, { backgroundColor: 'lightgrey', borderRadius: 100 }]} />}
            </>
                }
        </View>
    )
}