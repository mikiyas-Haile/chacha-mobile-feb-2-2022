import { View, TouchableOpacity, Text } from 'react-native'
import Swiper from 'react-native-swiper'
import { FONTS } from './Fonts';
import { useFonts } from 'expo-font'


export default function ChooseFont({ setFontStyle, selectFont, fontSize, textAlign }) {
    const [loaded] = useFonts({
        'MaidenOrange-Regular': {
            uri: require('../../../../assets/fonts/MaidenOrange-Regular.ttf'),
        },
        'BebasNeue-Regular': {
            uri: require('../../../../assets/fonts/BebasNeue-Regular.ttf'),
        },
        'BhuTukaExpandedOne-Regular': {
            uri: require('../../../../assets/fonts/BhuTukaExpandedOne-Regular.ttf'),
        },
        'Cinzel-Regular': {
            uri: require('../../../../assets/fonts/Cinzel-Regular.ttf'),
        },
        'Staatliches-Regular': {
            uri: require('../../../../assets/fonts/Staatliches-Regular.ttf'),
        },
        'SyneMono-Regular': {
            uri: require('../../../../assets/fonts/SyneMono-Regular.ttf'),
        },
        'AbyssinicaSIL-Regular': {
            uri: require('../../../../assets/fonts/AbyssinicaSIL-Regular.ttf'),
        },
        'Addis': { 
            uri: require('../../../../assets/fonts/Addis.ttf'),
        },
        'Kiros': { 
            uri: require('../../../../assets/fonts/Kiros.ttf'),
        },
    })
    return (
        <View style={{
            opacity: selectFont,
            height: 100,
            marginBottom: 20,
            marginTop: `auto`
        }}>
            <Swiper activeDotColor='#fe2c55'>
                {FONTS.map((item, index) => {
                    return <TouchableOpacity key={index} onPress={() => setFontStyle(item)}>
                        <Text numberOfLines={1} ellipsizeMode={`tail`} style={{
                            backgroundColor: item.bgColor ? item.bgColor : `transparent`,
                            color: item.textColor ? item.textColor : `white`,
                            fontFamily: item.name,
                            textAlign: textAlign,
                            fontSize: fontSize,
                            textShadowColor: item.glowColor ? item.glowColor : 'rgba(0, 0, 0, 0)',
                            textShadowOffset: {
                                width: -5,
                                height: 5
                            },
                            textShadowRadius: 1,
                            borderRadius: item.borderRadius ? item.borderRadius : 5,
                            padding: item.padding ? item.padding : 5,
                            textTransform: item.allCaps ? `uppercase` : item.allLower ? `lowercase` : `none`
                        }}>{item.name === 'Kiros' || item.name === 'Addis' ? 'አበበ በሶ በላ። ጫላ ጩቤ ጨብጠ።' : '' }The Quick Brown Fox Jumped Over The Lazy Dog.</Text>
                    </TouchableOpacity>;
                })}
            </Swiper>
        </View>
    );
}
