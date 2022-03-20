import { ScrollView, View, TouchableOpacity } from 'react-native'
import { useContext } from 'react'
import { AppContext } from '../../../../AppContext'
import { useNavigation } from '@react-navigation/native'
import IonIcons from 'react-native-vector-icons/Ionicons';
import ProfileCard from './ProfileCard'

export default function RenderProfile(props) {
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const { User, pfps } = props;

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