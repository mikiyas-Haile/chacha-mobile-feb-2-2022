import * as React from 'react';
import { WebView } from 'react-native-webview';
import { MainLookup } from '../../../Lookup'
import { AppContext } from '../../../../AppContext'

export default function ViewLink(props) {
    const { url } = props?.route?.params;
    const ctx = React.useContext(AppContext);

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

