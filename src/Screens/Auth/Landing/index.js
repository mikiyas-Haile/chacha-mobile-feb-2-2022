import React from 'react'
import { StyleSheet, TextInput, Dimensions, Pressable, Text, View, Image, ToastAndroid, ActivityIndicatorComponent, TouchableOpacity } from 'react-native'
const { width, height } = Dimensions.get("screen")

export default function LandingPage(props) {
    const register = () => {
        props.navigation.navigate("Register")
    }
    const login = () => {
        props.navigation.navigate("auth", { screen: "login" })
    }
    return (
        <View style={styles.page}>
            <View style={{ padding: 20, alignItems: 'center', marginTop: "auto" }}>
                <Image style={{ width: 100, height:210, tintColor:"white" }}  source={require('../../../../assets/logo/11.png')} />
            </View>
            <View>
                <Text style={[styles.btnText, { fontSize: 40, fontFamily: "Poppins-Bold", color: "lightgray" }]}>Welcome to Chacha!{"\n"}Please authenticate yourself.</Text>
            </View>
            <View style={styles.bottom}>
                <TouchableOpacity onPress={login} style={[styles.loginBtn, { backgroundColor: "#f32c55" }]}>
                    <Text style={styles.btnText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={register} style={styles.loginBtn}>
                    <Text style={styles.btnText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    btnText: {
        fontFamily: "Poppins-Regular",
        fontSize: 17,
        color: 'white'
    },
    loginBtn: {
        backgroundColor: 'black',
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: "#fe2c55"
    },
    bottom: {
        marginTop: "auto",
        margin: 10,
    },
    page: {
        flex: 1,
        backgroundColor: 'black',
    }
})