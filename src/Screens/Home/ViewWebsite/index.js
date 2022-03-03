import * as React from 'react';
import { WebView } from 'react-native-webview';
import { MainLookup } from '../../../Lookup'
import { AppContext } from '../../../../AppContext'
import { Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function ViewLink(props) {
    const { url } = props?.route?.params;
    const ctx = React.useContext(AppContext);
    const nav = useNavigation();
    React.useEffect(() => {
        nav.setOptions({
            title: url
        })
    },[])

    return (
        <WebView
            style={{
                backgroundColor: ctx.bgColor,
                flex: 1,
            }}
            source={{ uri: url }}
        />
    );
}

