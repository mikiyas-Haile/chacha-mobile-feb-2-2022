import { View, Text } from 'react-native'
import { useContext } from 'react'
import { AppContext } from '../../../../AppContext'
import { useNavigation } from '@react-navigation/native'

export default function RenderBio({ str }) {
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    if (str) {
        return (
            <>
                {
                    str.split(/(\s+)/).map((item, index) => {
                        const hasMention = item[0] === ("@");
                        const hasHash = item[0] === ("#");
                        const hasLink = item.includes("http://") || item.includes("https://");
                        const noice = item === '69' || item === '69420'
                        const Press = () => {
                            if (hasMention) {
                                nav.push("View Profile", { user: item.replace("@", '') })
                            }
                            if (hasLink) {
                                nav.push("View Page", { url: item })
                            }
                        }
                        return (
                            <Text onPress={Press} key={index}
                                style={{
                                    fontFamily:
                                        hasMention
                                            || hasHash
                                            || hasLink
                                            || noice
                                            ? 'Poppins-Bold' : 'Poppins-Regular',
                                    color: ctx.textColor
                                }}>{item}</Text>
                        )
                    })
                }
            </>
        )
    }
    else {
        return <View />
    }
}
