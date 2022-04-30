import React, { useEffect, useState, useContext } from 'react'
import { Modal, TouchableWithoutFeedback, View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions, ScrollView, useColorScheme, ImageBackground } from 'react-native'
import { MainLookup } from '../../../Lookup'
import { AppContext } from '../../../../AppContext'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Swiper from 'react-native-swiper'
import { PhotoCard } from '../Camera/index'
import { useNavigation } from '@react-navigation/native'
import IonIcons from 'react-native-vector-icons/Ionicons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import ToggleSwitch from 'toggle-switch-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { host } from '../../../Components/host'
import * as ImagePicker from 'expo-image-picker';
import { reloadApp } from '../../../Components/ReloadApp'
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { TranslateApi } from '../../../Components/Translate';


const { width, height } = Dimensions.get('window')

export default function YourProfile() {
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const [user, setUser] = useState([])
    useEffect(() => {
        const rcb = (e, r) => {
            setUser(JSON.parse(r))
        }
        AsyncStorage.getItem("request_user", rcb)
    }, [])
    const Logout = () => {
        AsyncStorage.removeItem("current_user_username")
        AsyncStorage.removeItem("session_token")
        AsyncStorage.removeItem("theme")
        AsyncStorage.removeItem("request_user")
        reloadApp()
        const cb = (r, c) => {
            console.log(r, c, 29)
            AsyncStorage.removeItem("current_user_username")
            AsyncStorage.removeItem("session_token")
            AsyncStorage.removeItem("theme")
            AsyncStorage.removeItem("request_user")
            reloadApp()
        }
        MainLookup(cb, {
            endpoint: `/api/rest-auth/logout`, method: 'POST', data: {
                bye: 'bb'
            }
        })
    }
    const ItemProps = {
        color: "#2c3e50",
        fontFamily: `Poppins-Regular`,
        fontSize: 30
    }
    return (
        <>
            {user.username === undefined ?
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: ctx.bgColor
                }}>
                    <TouchableOpacity style={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: ctx.textColor,
                        borderWidth: 1,
                        borderRadius: 10,
                        width: width / 3,
                        height: height / 4,
                    }}>
                        <IonIcons name='ios-settings' color={ctx.textColor} size={width / 4} />
                        <Text style={{
                            fontFamily: 'Poppins-Regular',
                            textAlign: 'center',
                            fontSize: 13,
                            color: ctx.textColor,
                        }}>Settings</Text>
                    </TouchableOpacity>
                </View>
                :
                <ScrollView style={{
                    flex: 1,
                    backgroundColor: ctx.bgColor,
                }}>
                    <RenderUserPfpsList user={user} />
                    <View style={{
                        padding: 10,
                        flex: 1,
                    }}>
                        {!user.has_verified_phone_number &&
                            <View>
                                <TouchableOpacity onPress={() => nav.push('Verify Phone Number', { phoneNumber: user.phone_number })} style={{
                                    borderWidth: 1,
                                    borderColor: '#2c3e50',
                                    padding: 5,
                                    borderRadius: 20,
                                    margin: 5,
                                }}>
                                    <IonIcons name='warning' color={'orange'} size={20} />
                                    <RenderTextWithPlaceholder color={'orange'} string={TranslateApi({ str: "Your Phone Number isn't verified.", id: 37 })} />
                                    <Text style={{
                                        fontFamily: 'Poppins-Black',
                                        color: ctx.textColor,
                                        fontSize: 20,
                                    }}>
                                        {TranslateApi({ str: "Verify", id: 36 })}
                                    </Text>
                                </TouchableOpacity>
                            </View>}
                        <View>
                            <RenderTextWithPlaceholder onPress={() => nav.push("Change Full Name")} placeholder={ctx.language === 'Amharic' ? `ሙሉ ስም` : TranslateApi({ str: "Full Name", id: 16 })} string={user.display_name} />
                            <RenderTextWithPlaceholder onPress={() => alert("Usernames are not changeable.")} placeholder={ctx.language === 'Amharic' ? `የተጠቃሚ ስም` : TranslateApi({ str: "User name", id: 17 })} string={user.username} />
                            <RenderTextWithPlaceholder onPress={() => nav.push("Change Bio")} placeholder={ctx.language === 'Amharic' ? `አጭር ታሪክ` : TranslateApi({ str: "Biography", id: 18 })} string={user.bio ? user.bio : 'Add your Bio'} />
                            <RenderTextWithPlaceholder onPress={() => alert("You can not change your Email at this moment.")} placeholder={ctx.language === 'Amharic' ? `ኢ-ሜል` : TranslateApi({ str: "Email", id: 19 })} string={user.email} />
                            <RenderTextWithPlaceholder onPress={() => nav.push("Change Phone Number")} placeholder={ctx.language === 'Amharic' ? `ስልክ ቁጥር` : TranslateApi({ str: "Phone Number", id: 20 })} string={user.phone_number} />
                            <RenderTextWithPlaceholder onPress={() => alert("You can not update Country at this moment.")} placeholder={ctx.language === 'Amharic' ? `ሀገር` : TranslateApi({ str: "Country", id: 21 })} string={user.country} />
                            {/* <RenderTextWithPlaceholder onPress={() => alert("You can not update Country code at this moment.")} placeholder={'Country Code'} string={user.country_code} /> */}
                            <Notifications />
                            <View>
                                <Text style={{
                                    color: ctx.textColor,
                                    fontFamily: 'Poppins-Bold',
                                    fontSize: 25,
                                    // textAlign: 'center'
                                }}>{ctx.language === 'Amharic' ? `ቋንቋ` : TranslateApi({ str: "Language", id: 15 })}</Text>

                                <Picker
                                    mode={`dropdown`}
                                    dropdownIconColor={ctx.textColor}
                                    itemStyle={{ backgroundColor: 'red', color: 'red' }}
                                    themeVariant={`dark`}
                                    selectedValue={ctx.language}
                                    onValueChange={(itemVal, itemIndex) => ctx.changeLan(itemVal)}
                                    style={{ fontFamily: `Poppins-Regular`, color: ctx.textColor, paddingHorizontal: 10, borderWidth: 1, borderColor: `#2c3e50`, borderRadius: 10 }}>
                                    <Picker.Item {...ItemProps} label={`አማርኛ`} value={`Amharic`} />
                                    <Picker.Item {...ItemProps} label={`Afaan Oromoo`} value={`afan_oromo`} />
                                    <Picker.Item {...ItemProps} fontFamily={`Poppins-Regular`} label={`عربي`} value={`arabic`} />
                                    <Picker.Item {...ItemProps} fontFamily={`Poppins-Regular`} label={`Swahili`} value={`swahili`} />
                                    <Picker.Item {...ItemProps} fontFamily={`Poppins-Regular`} label={`français`} value={`french`} />
                                    <Picker.Item {...ItemProps} fontFamily={`Poppins-Regular`} label={`español`} value={`spanish`} />
                                    <Picker.Item {...ItemProps} fontFamily={`Poppins-Regular`} label={`afrikaans`} value={`africaans`} />
                                    <Picker.Item {...ItemProps} fontFamily={`Poppins-Regular`} label={`English`} value={`english`} />
                                </Picker>
                            </View>
                            <SelectTheme />
                            <TouchableOpacity onPress={Logout}>
                                <Text style={{
                                    padding: 10,
                                    fontFamily: 'Poppins-Light',
                                    color: ctx.textColor
                                }}>
                                    {ctx.language === 'Amharic' ? `ልውጣ` : TranslateApi({ str: "Logout", id: 14 })}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            }
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                top: 20,
                left: 0,
                right: 0,
                padding: 20,
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => (nav.pop())} style={{ backgroundColor: '#17171795', padding: 10, borderRadius: 100 }}>
                    <IonIcons name='arrow-back' color={'white'} size={25} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => (nav.push("View Profile", { user: user }))} style={{ backgroundColor: '#17171795', padding: 10, borderRadius: 100 }}>
                    <Text style={{ color: 'white', fontFamily: 'Poppins-Black' }}>{TranslateApi({ str: "View Profile", id: 29 })}</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}
export function RenderUserPfpsList(props) {
    const { user } = props;
    const pfps = props.pfps ? props.pfps : user.pfps
    const viewing = props.viewing ? props.viewing : false
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const [more, setshowMore] = useState(false);
    const [HasEdited, setHasEdited] = useState(false);
    const [Touched, setTouched] = useState(false);
    const [image, setImage] = useState(user.pfps)
    const [newImage, setnewImage] = useState()

    const Publish = () => {
        if (!viewing) {
            const uri = newImage.uri
            setTouched(false)
            const cb = (id) => {
                console.log(id)
            }
            ctx.AddPfp(uri, cb)
        }
    }

    useEffect(() => {
        setImage(user.pfps);
    }, [user])

    const PickImage = () => {
        if (Touched && !viewing) {
            Publish()
        } else {
            setshowMore(!more)
        }
    }
    const OpenCamera = async () => {
        if (!viewing) {
            setshowMore(!more)
            const result = ImagePicker.launchCameraAsync({
                allowsEditing: true,
            })
                .then(res => {
                    console.log(res)
                    if (!res.cancelled) {
                        setTouched(true)
                        setImage([res, ...image])
                        setnewImage(res)
                    }
                })
        }
    }
    const OpenLibrary = async () => {
        if (!viewing) {
            setshowMore(!more)
            const result = ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
            })
                .then(res => {
                    if (!res.cancelled) {
                        setImage([res, ...image])
                        setTouched(true)
                        setnewImage(res)
                    }
                })
        }
    }
    const ppfss = pfps ? pfps : user.pfps
    const ImageList = image ? image : ppfss
    console.log(ImageList.length)
    return (
        <>
            <View style={{ position: 'relative' }}>

                {ImageList.length > 0 ? <Swiper
                    onTouchEnd={() => {
                        nav.push("View Pictures", { imgs: ImageList })
                    }}
                    dotColor={ctx.bgColor}
                    activeDotColor={ctx.textColor}
                    style={{ height: height / 4 }}>
                    {ImageList.map((item, index) => {
                        return (
                            <ImageBackground key={index} style={{ flex: 1 }} source={{ uri: item.uri }}>
                                <LinearGradient
                                    colors={['#17171700', ctx.bgColor]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }} style={{
                                        flex: 1
                                    }}>
                                </LinearGradient>
                            </ImageBackground>

                        )
                    })}
                </Swiper>
                    :
                    <View style={{ height: height / 4, width: '100%', backgroundColor: 'grey' }} />
                }

                <TouchableOpacity style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    borderRadius: 100,
                    padding: 10
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontFamily: 'Poppins-Bold',
                        color: ctx.textColor,
                        height: 30
                    }}>{user.display_name}

                        {user.is_verified ? <AntDesign style={{ marginLeft: 5 }} name='checkcircle' size={17} color={'#00a2f9'} /> : null}
                    </Text>
                    <Text style={{
                        fontSize: 17,
                        fontFamily: 'Poppins-Regular',
                        color: ctx.textColor
                    }}>@{user.username}</Text>
                </TouchableOpacity>

                {!viewing ? <TouchableOpacity onPress={PickImage} style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    backgroundColor: Touched ? 'green' : '#2c3e50',
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    borderRadius: 100,
                    padding: 10
                }}>
                    <IonIcons name={Touched ? 'checkmark' : 'image'} size={30} color={'white'} />
                </TouchableOpacity> : null}
            </View>
            <Modal
                animated
                animationType={"slide"}
                statusBarTranslucent
                visible={more}
                transparent
                onDismiss={() => (setshowMore(false))}
                onRequestClose={() => (setshowMore(false))}>
                <TouchableWithoutFeedback onPress={() => (setshowMore(false))}>
                    <View style={{ flex: 1, backgroundColor: '#00000000' }}>
                        <View style={{ backgroundColor: ctx.bgColor, marginTop: 'auto', padding: 10, borderTopRightRadius: 20, borderTopLeftRadius: 20, borderColor: '#2c3e50', borderWidth: 1 }}>
                            <View style={{ width: '10%', height: 5, borderRadius: 20, alignSelf: 'center', backgroundColor: "lightgray" }} />
                            <TouchableOpacity onPress={OpenCamera} style={{ padding: 10, borderColor: '#2c3e50', flexDirection: 'row', alignItems: 'center' }}>
                                <EvilIcons size={50} name='camera' color={ctx.textColor} />
                                <Text style={{ color: ctx.textColor, fontFamily: 'Poppins-Medium', fontSize: 15 }}>Open Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={OpenLibrary} style={{ padding: 10, borderColor: '#2c3e50', flexDirection: 'row', alignItems: 'center' }}>
                                <EvilIcons size={50} name='image' color={ctx.textColor} />
                                <Text style={{ color: ctx.textColor, fontFamily: 'Poppins-Medium', fontSize: 15 }}>Choose from Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    )
}
function RenderTextWithPlaceholder(props) {
    const { onPress, string, placeholder } = props;
    const ctx = useContext(AppContext);
    const color = props.color ? props.color : ctx.textColor
    return (
        <View style={{
            margin: 2,
            // borderBottomWidth: 1,
            borderColor: '#2c3e50'
        }}>
            {placeholder && <Text style={{
                fontSize: 13,
                fontFamily: ctx.MediumFont,
                color: color
            }}>
                {placeholder}
            </Text>}
            <TouchableOpacity onPress={onPress}>
                <Text style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Bold',
                    color: color
                }}>
                    {string}
                </Text>
            </TouchableOpacity>
        </View>
    )
}
function Notifications() {
    const ctx = useContext(AppContext);
    const [user, setUser] = useState([])
    const [msg, setMsg] = useState('')
    const [SnackBarOpacity, setSnackBarOpacity] = useState(0)

    useEffect(() => {
        const rcb = (e, r) => {
            setUser(JSON.parse(r))
        }
        AsyncStorage.getItem("request_user", rcb)
    }, [])
    const [CSRFToken, setCSRFTOKEN] = useState()
    useEffect(() => {
        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])
    const callback = (enabled, type) => {
        let data = {}
        data[`${type}`] = enabled
        const cb = (r, c) => {
            console.log(r, c)
            if (c === 200) {
                ctx.MyAlert("Successfully Updated Profile")
            } else {
                ctx.MyAlert("Couldn't Update profile.Please try again later")
            }
        }
        MainLookup(cb, { endpoint: `/api/update-profile`, method: 'PUT', csrf: CSRFToken, data: data })
    }
    return (
        <View style={{
            paddingVertical: 20
        }}>
            <Text style={{
                color: ctx.textColor,
                fontFamily: 'Poppins-Bold',
                fontSize: 25,
                // textAlign: 'center'
            }}>{TranslateApi({ str: "Notifications", id: 27 })}</Text>
            <RenderStringWithSwitch type={'has_allowed_post_like_notifs'} callback={callback} placeholder={ctx.language === 'Amharic' ? `መውደድ መግለጫዎች` : TranslateApi({ str: "Likes", id: 5 })} bool={user.has_allowed_post_like_notifs} />
            <RenderStringWithSwitch type={'has_allowed_reply_notifs'} callback={callback} placeholder={ctx.language === 'Amharic' ? "ምላሾች" : TranslateApi({ str: 'Reposts', id: 8 })} bool={user.has_allowed_reply_notifs} />
            <RenderStringWithSwitch type={'has_allowed_follow_notifs'} callback={callback} placeholder={ctx.language === 'Amharic' ? "ኣዲስ ተከታዮች" : TranslateApi({ str: 'New Followers', id: 22 })} bool={user.has_allowed_follow_notifs} />
            <RenderStringWithSwitch type={'has_allowed_recommendation_notifs'} callback={callback} placeholder={ctx.language === 'Amharic' ? "ምክረ ሐሳቦች" : TranslateApi({ str: 'Recommendations', id: 23 })} bool={user.has_allowed_recommendation_notifs} />
            <RenderStringWithSwitch type={'has_allowed_trending_notifs'} callback={callback} placeholder={ctx.language === 'Amharic' ? "አዝማሚያዎች" : TranslateApi({ str: 'Trends', id: 24 })} bool={user.has_allowed_trending_notifs} />
            <RenderStringWithSwitch type={'has_allowed_new_chat_notifs'} callback={callback} placeholder={ctx.language === 'Amharic' ? "ኣዲስ መልእክቶች" : TranslateApi({ str: 'New Chats', id: 25 })} bool={user.has_allowed_new_chat_notifs} />
            <RenderStringWithSwitch type={'has_allowed_new_post_from_following_notifs'} callback={callback} placeholder={ctx.language === 'Amharic' ? "ኣዲስ ቻቻዎች ከምከተላቸው ሰዎች" : TranslateApi({ str: 'New Posts from following', id: 26 })} bool={user.has_allowed_new_post_from_following_notifs} />
            {msg ?
                <View id="snackbar" style={{
                    opacity: SnackBarOpacity,
                    backgroundColor: '#333',
                    textAlign: 'center',
                    borderRadius: 10,
                    padding: 10,
                    position: 'absolute',
                    bottom: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                }}>
                    <Text style={{ fontSize: 17, color: 'white', fontFamily: 'Poppins-Regular' }}>{msg}</Text></View> : null}
        </View>
    )
}
function RenderStringWithSwitch({ placeholder, bool, color_, callback, type }) {
    const ctx = useContext(AppContext);
    const nav = useNavigation();

    const color = color_ ? color_ : ctx.textColor

    const [isEnabled, setIsEnabled] = useState(bool);

    useEffect(() => {
        setIsEnabled(bool)
    }, [bool])
    const ToggleScheme = () => {
        setIsEnabled(!isEnabled)
        callback(!isEnabled, type)
    }
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 5,
            // borderBottomWidth: 1,
            borderColor: '#2c3e50',
            paddingVertical: 10
        }}>
            <Text style={{
                fontSize: 15,
                fontFamily: ctx.MediumFont,
                color: color,
                width: '80%',
                textAlign: 'left'
            }}>{placeholder}</Text>
            <ToggleSwitch
                isOn={isEnabled}
                onColor="green"
                offColor="grey"
                size="medium"
                onToggle={ToggleScheme}
            />
        </View>
    )
}
function SelectTheme() {
    const ctx = useContext(AppContext);
    const scheme = useColorScheme();

    return (
        <>
            <View style={{
                paddingBottom: 20,
            }}>
                <Text style={{
                    color: ctx.textColor,
                    fontFamily: 'Poppins-Bold',
                    fontSize: 25,
                    // textAlign: 'center'
                }}>{TranslateApi({ str: "Theme", id: 28 })}</Text>
                <View>
                    <Picker
                        dropdownIconColor={ctx.textColor}
                        themeVariant={`dark`}
                        selectedValue={ctx.scheme}
                        itemStyle={{ fontFamily: `Poppins-Regular` }}
                        mode={`dropdown`}
                        onValueChange={(itemVal, itemIndex) => ctx.setScheme(itemVal)}
                        style={{ fontFamily: `Poppins-Regular`, color: ctx.textColor, paddingHorizontal: 10, borderWidth: 1, borderColor: `#2c3e50`, borderRadius: 10 }}>
                        <Picker.Item fontFamily={`Poppins-Regular`} label={TranslateApi({ str: "Light Mode", id: 30 })} value={`light`} />
                        <Picker.Item fontFamily={`Poppins-Regular`} label={TranslateApi({ str: "Noon Mode", id: 38 })} value={`light-two`} />
                        <Picker.Item fontFamily={`Poppins-Regular`} label={TranslateApi({ str: "Dark Mode", id: 31 })} value={`dark`} />
                        <Picker.Item fontFamily={`Poppins-Regular`} label={TranslateApi({ str: "Midnight Mode", id: 32 })} value={`ultra-dark`} />
                        <Picker.Item fontFamily={`Poppins-Regular`} label={TranslateApi({ str: "High Contrast Mode", id: 33 })} value={`color-blind`} />
                    </Picker>
                    {/* <RenderStringWithSwitch type={'dark-mode'} callback={callback} placeholder={ctx.language === 'English' ? "Dark Mode" : `ጨለም ያለ ግጥ`} bool={ctx.scheme === 'dark'} />
                    <RenderStringWithSwitch type={'ultra-dark-mode'} callback={callback} placeholder={ctx.language === 'English' ? "Ultra Dark Mode" : `ለሊት ገጥ`} bool={ctx.scheme === 'ultra-dark-mode'} />
                    <RenderStringWithSwitch type={'High-Contrast'} callback={callback} placeholder={ctx.language === 'English' ? "High Contrast Mode" : `ጠንካራ ቀለሞች`} bool={ctx.scheme === 'color-blind'} /> */}
                </View>
            </View>
        </>
    )
}