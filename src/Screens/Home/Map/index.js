import * as React from 'react';
// import MapView from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, useColorScheme } from 'react-native';
import { AppContext } from '../../../../AppContext'

export default function MapScreen() {
    const scheme = useColorScheme();
    const ctx = React.useContext(AppContext)
    return (
        <View style={[styles.container, { backgroundColor: ctx.bgColor }]}>
            <MapView onPress={(res, res_)=>{
                console.log(res)
            }} mapType='hybrid' userInterfaceStyle={scheme} showsCompass style={styles.map} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});