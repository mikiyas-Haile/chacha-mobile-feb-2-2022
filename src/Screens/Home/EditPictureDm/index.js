import { Image, View, ImageBackground, Text, TouchableOpacity, TextInput, Modal, Dimensions, SafeAreaView } from 'react-native'
import { useContext, useEffect, useState, useRef } from 'react'
import { AppContext } from '../../../../AppContext'
import { MainLookup } from '../../../Lookup'
import ViewShot, { captureRef } from "react-native-view-shot";
import { useNavigation } from '@react-navigation/native'
import Draggable from 'react-native-draggable';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Foundation from 'react-native-vector-icons/Foundation'
import ImageViewer from 'react-native-image-zoom-viewer';
import Swiper from 'react-native-swiper'

const { height, width } = Dimensions.get('window')

const FONTS = [
    {
        name: 'Poppins-ExtraLight',
        bgColor: `#0d0d0d99`,
        textColor: `white`
    },
    {
        name: `Poppins-Bold`,
        bgColor: `yellow`,
        textColor: `black`,
        padding: 15,
        borderRadius: 1,
        doesntNeedBg: true
    },
    {
        name: `Poppins-Black`,
        glowColor: `black`,
        allCaps: true,
    },
    {
        name: 'Poppins-ExtraLight',
        glowColor: `black`
    },
    {
        name: 'Caviar-Italic',
    },
    {
        name: 'Caviar-Italic',
        glowColor: `#fe2c55`
    },
    {
        name: 'Cursive',
        glowColor: `black`,
        allLower: true
    },
    {
        name: 'Cursive',
        glowColor: `#fe2c55`
    },
]

export default function EditPictureForDm(props) {
    const { uri, file } = props?.route?.params;
    const next = props?.route?.params?.next ? props?.route?.params?.next : 'View Picture'
    const ctx = useContext(AppContext);
    const nav = useNavigation();
    const [body, setbody] = useState('')
    const [TextAdded, setTextAdded] = useState(false)
    const [AddingText, setAddingText] = useState(false)
    const ButtonBackgroundStyles = { backgroundColor: '#17171795', padding: 10, borderRadius: 100 }

    const Submit = () => {
        // setTextAdded(!TextAdded)
        setAddingText(!AddingText)
    }
    const Cancel = () => {
        setbody('');
        setTextAdded(false)
        setAddingText(false)
    }
    const [textAlign, setTextAlign] = useState('center')
    const [textColor, setTextColor] = useState('white')
    const [FontStyle, setFontStyle] = useState(FONTS[0])
    const fontSize = 21
    const [InputRef, setInputRef] = useState(null);
    const [selectFont, setSelectFont] = useState(0)
    useEffect(() => {
        return () => {
            // setbody('');
            // setTextAdded(false)
            // setAddingText(false)
        }
    }, [])
    // const InputRef = useRef<TextInput>(null);;
    const StartAddingText = () => {
        console.log(InputRef)
        setTextAdded(!TextAdded)
        setAddingText(!AddingText)
    }

    return (
        <>
            <Modal
                transparent
                visible={AddingText}>
                <View style={{
                    flex: 1,
                    backgroundColor: '#17171795',
                    justifyContent: 'center'
                }}>
                    <View style={{ opacity: selectFont, height: 100, marginBottom: 20, marginTop: `auto` }}>
                        <Swiper activeDotColor='#fe2c55'>
                            {FONTS.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} onPress={() => setFontStyle(item)}>
                                        <Text numberOfLines={1} ellipsizeMode={`tail`} style={{
                                            backgroundColor: item.bgColor ? item.bgColor : `transparent`,
                                            color: item.textColor ? item.textColor : `white`,
                                            fontFamily: item.name,
                                            textAlign: textAlign,
                                            fontSize: fontSize,
                                            textShadowColor: item.glowColor ? item.glowColor : 'rgba(0, 0, 0, 0)',
                                            textShadowOffset: { width: -1, height: 1 },
                                            textShadowRadius: 15,
                                            borderRadius: item.borderRadius ? item.borderRadius : 5,
                                            padding: item.padding ? item.padding : 5,
                                            textTransform: item.allCaps ? `uppercase` : item.allLower ? `lowercase` : `none`
                                        }}>Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </Swiper>
                    </View>
                    <TextInput ref={setInputRef} autoFocus={AddingText} focus={AddingText} multiline onChangeText={setbody} placeholderTextColor={FontStyle.textColor ? FontStyle.textColor : `white`} placeholder='' style={{
                        color: FontStyle.textColor ? FontStyle.textColor : `white`,
                        fontFamily: FontStyle.name,
                        textAlign: textAlign,
                        fontSize: fontSize,
                        borderRadius: FontStyle.borderRadius ? FontStyle.borderRadius : 5,
                        textShadowColor: FontStyle.glowColor ? FontStyle.glowColor : 'rgba(0, 0, 0, 0)',
                        textShadowOffset: { width: -1, height: 1 },
                        textShadowRadius: 15,
                        backgroundColor: !FontStyle.doesntNeedBg ? FontStyle.bgColor : `transparent`,
                        padding: FontStyle.padding ? FontStyle.padding : 5,
                        // marginTop: `auto`
                    }}>
                        <Text style={{
                            // maxWidth: '80%',
                            borderRadius: FontStyle.borderRadius ? FontStyle.borderRadius : 5,
                            backgroundColor: FontStyle.doesntNeedBg ? FontStyle.bgColor : `transparent`,
                            color: FontStyle.textColor ? FontStyle.textColor : `white`,
                            fontFamily: FontStyle.name,
                            textAlign: textAlign,
                            padding: FontStyle.padding ? FontStyle.padding : 5,
                            fontSize: fontSize,
                            textShadowColor: FontStyle.glowColor ? FontStyle.glowColor : 'rgba(0, 0, 0, 0)',
                            textShadowOffset: { width: -1, height: 1 },
                            textShadowRadius: 15
                        }}>
                            {body}
                        </Text>
                    </TextInput>
                    <View style={[ButtonBackgroundStyles, { backgroundColor: 'transparent', alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <TouchableOpacity onPress={Cancel} style={ButtonBackgroundStyles}>
                            <Feather name='x' color={'white'} size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectFont(selectFont === 1 ? 0 : 1)} style={ButtonBackgroundStyles}>
                            <Foundation name='background-color' color={'white'} size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => (setTextAlign('left'))} style={ButtonBackgroundStyles}>
                            <Feather name='align-left' color={'white'} size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => (setTextAlign('center'))} style={ButtonBackgroundStyles}>
                            <Feather name='align-center' color={'white'} size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => (setTextAlign('right'))} style={ButtonBackgroundStyles}>
                            <Feather name='align-right' color={'white'} size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={Submit} style={ButtonBackgroundStyles}>
                            <AntDesign name='check' color={'white'} size={25} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Editor StartAddingText={StartAddingText} fontSize={fontSize} FontStyle={FontStyle} setFontStyle={setFontStyle} textAlign={textAlign} textColor={textColor} setTextAlign={setTextAlign} setTextColor={setTextColor} next={next} setAddingText={setAddingText} AddingText={AddingText} TextAdded={TextAdded} setTextAdded={setTextAdded} setbody={setbody} body={body} uri={uri} file={file} />
        </>
    )
}
function Editor(props) {
    const { StartAddingText, uri, fontSize, FontStyle, body, TextAdded, setAddingText, AddingText, setTextAdded, next, textColor, setTextColor, textAlign, setTextAlign } = props;
    const [capturedUri, setCapturedUri] = useState('')
    const ctx = useContext(AppContext);
    const viewShot = useRef(null);
    const nav = useNavigation();
    const Capture = () => {
        if (body) {
            captureRef(viewShot).then(uri => {
                setCapturedUri(uri)
                nav.push("View Picture", { uri: uri })
            });
        } else {
            nav.push("View Picture", { uri: uri })
            // nav.push("Add Message to your sharing Image", { uri: uri })
        }
    }
    const ButtonBackgroundStyles = { backgroundColor: '#17171795', padding: 10, borderRadius: 100 }
    const NavStyles = {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        padding: 20,
        alignItems: 'center',
    }
    const images = [
        {
            url:
                uri,
        },
    ]
    return (
        <>
            <ViewShot ref={viewShot} options={{ format: "jpg", quality: 0.9 }}>
                <ImageBackground blurRadius={2000} style={{ height: '100%', width: '100%', backgroundColor: 'black' }} source={{ uri: uri }}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={{
                            backgroundColor: '#F5FCFF',
                            flex: 1,
                        }}>
                            <ImageViewer
                                imageUrls={images}
                                renderIndicator={() => null} />
                            {body ?
                                <Draggable onReverse={() => console.log(`reveresed..`)} x={100} y={300}>
                                    <TouchableOpacity onPress={() => setAddingText(true)} style={{
                                        maxWidth: '80%',
                                    }}>
                                        <Text style={{
                                            backgroundColor: !FontStyle.doesntNeedBg ? FontStyle.bgColor : `transparent`,
                                            fontFamily: FontStyle.name ? FontStyle.name : FONTS[0].name,
                                            fontSize: fontSize,
                                            // marginTop: `auto`
                                        }}>
                                            <Text style={{
                                                // maxWidth: '80%',
                                                backgroundColor: FontStyle.doesntNeedBg ? FontStyle.bgColor : `transparent`,
                                                color: FontStyle.textColor ? FontStyle.textColor : `white`,
                                                fontFamily: FontStyle.name ? FontStyle.name : FONTS[0].name,
                                                textAlign: textAlign,
                                                padding: FontStyle.padding ? FontStyle.padding : 5,
                                                fontSize: fontSize,
                                                textShadowColor: FontStyle.glowColor ? FontStyle.glowColor : 'rgba(0, 0, 0, 0)',
                                                textShadowOffset: { width: -1, height: 1 },
                                                textShadowRadius: 15
                                            }}>
                                                {body}
                                            </Text>
                                        </Text>
                                    </TouchableOpacity>
                                </Draggable> : null}
                            {/* </ImageViewer> */}
                        </View>
                    </SafeAreaView>
                </ImageBackground>
            </ViewShot>
            <View style={{
                backgroundColor: `#00000080`,
                height: height / 4,
                top: 0,
                width: `100%`,
                position: `absolute`
            }} />
            <View style={{
                backgroundColor: `#00000080`,
                height: height / 4,
                bottom: 0,
                width: `100%`,
                position: `absolute`
            }} />
            <View style={NavStyles}>
                <TouchableOpacity onPress={() => (nav.pop())} style={ButtonBackgroundStyles}>
                    <AntDesign name='arrowleft' color={'white'} size={25} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    if (body) {
                        setAddingText(true)
                    } else {
                        StartAddingText();
                    }
                }} style={[ButtonBackgroundStyles, { paddingHorizontal: 10 }]}>
                    <Text style={{ color: 'white', fontFamily: 'Poppins-Bold' }}>{body ? 'Edit Text' : 'Add Text'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={Capture} style={ButtonBackgroundStyles}>
                    <AntDesign name='arrowright' color={'white'} size={25} />
                </TouchableOpacity>
            </View>
        </>
    )
}

                    // {/* <ImageBackground resizeMode='contain' style={{ height: '100%', width: '100%' }} source={{ uri: uri }}>
                    //     {body ?
                    //         <Draggable x={100} y={300}>
                    //             <TouchableOpacity onPress={() => setAddingText(true)} style={{
                    //                 maxWidth: '80%',
                    //             }}>
                    //                 <Text style={{
                    //                     color: FontStyle.textColor ? FontStyle.textColor : `white`,
                    //                     fontFamily: FontStyle.name,
                    //                     textAlign: textAlign,
                    //                     fontSize: fontSize,
                    //                     borderRadius: FontStyle.borderRadius ? FontStyle.borderRadius : 5,
                    //                     textShadowColor: FontStyle.glowColor ? FontStyle.glowColor : 'rgba(0, 0, 0, 0)',
                    //                     textShadowOffset: { width: -1, height: 1 },
                    //                     textShadowRadius: 15,
                    //                     backgroundColor: !FontStyle.doesntNeedBg ? FontStyle.bgColor : `transparent`,
                    //                     padding: FontStyle.padding ? FontStyle.padding : 5,
                    //                     // marginTop: `auto`
                    //                 }}>
                    //                     <Text style={{
                    //                         // maxWidth: '80%',
                    //                         backgroundColor: FontStyle.doesntNeedBg ? FontStyle.bgColor : `transparent`,
                    //                         color: FontStyle.textColor ? FontStyle.textColor : `white`,
                    //                         fontFamily: FontStyle.name,
                    //                         textAlign: textAlign,
                    //                         padding: FontStyle.padding ? FontStyle.padding : 5,
                    //                         fontSize: fontSize,
                    //                         textShadowColor: FontStyle.glowColor ? FontStyle.glowColor : 'rgba(0, 0, 0, 0)',
                    //                         textShadowOffset: { width: -1, height: 1 },
                    //                         textShadowRadius: 15
                    //                     }}>
                    //                         {body}
                    //                     </Text>
                    //                 </Text>
                    //             </TouchableOpacity>
                    //         </Draggable> : null}
                    // </ImageBackground> */}