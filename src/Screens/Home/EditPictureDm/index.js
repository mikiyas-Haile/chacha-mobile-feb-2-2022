import { Image, View, ImageBackground, Text, TouchableOpacity, TextInput, Modal, Dimensions } from 'react-native'
import { useContext, useEffect, useState, useRef } from 'react'
import { AppContext } from '../../../../AppContext'
import { MainLookup } from '../../../Lookup'
import ViewShot, { captureRef } from "react-native-view-shot";
import { useNavigation } from '@react-navigation/native'
import Draggable from 'react-native-draggable';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Foundation from 'react-native-vector-icons/Foundation'

const { height, width } = Dimensions.get('window')

const FONTS = [
    {
        'id': 1,
        name: 'Poppins-Regular'

    },
    {
        'id': 2,
        name: 'Poppins-Light'

    },
    {
        'id': 3,
        name: 'Caviar-Italic'

    },
    {
        'id': 4,
        name: 'Cursive'

    },
    {
        'id': 5,
        name: 'Caviar'

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
    const NavStyles = {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        padding: 20,
        alignItems: 'center',
        // opacity: .9
    }
    const Submit = () => {
        setAddingText(false)
    }
    const Cancel = () => {
        setbody('');
        setTextAdded(false)
        setAddingText(false)
    }
    const [textAlign, setTextAlign] = useState('center')
    const [textColor, setTextColor] = useState('white')
    const [FontStyle, setFontStyle] = useState(FONTS[0].name)
    const fontSize = FontStyle === FONTS[0].name ? 17 : 21
    
    const ChooseFont = () => {
        let randomNum = Math.floor(Math.random() * FONTS.length)
        let font = FONTS[randomNum];
        if (font.name === FontStyle) {
            randomNum = Math.floor(Math.random() * FONTS.length)
            font = FONTS[randomNum]
        }
        setFontStyle(font.name)
        // const currentFont = FONTS.filter(item => item.name === FontStyle)[0].id
        // console.log(FONTS.length, currentFont)
        // console.log(FONTS.length === currentFont)
        // if (FONTS.length === currentFont) {
        //     setFontStyle(FONTS[0].name)
        // } else {
        //     setFontStyle(FONTS[currentFont].name)
        // }
    }
    return (
        <>
            <Editor fontSize={fontSize} FontStyle={FontStyle} setFontStyle={setFontStyle} textAlign={textAlign} textColor={textColor} setTextAlign={setTextAlign} setTextColor={setTextColor} next={next} setAddingText={setAddingText} AddingText={AddingText} TextAdded={TextAdded} setTextAdded={setTextAdded} setbody={setbody} body={body} uri={uri} file={file} />
            <Modal
                transparent
                visible={AddingText}>
                <View style={{
                    flex: 1,
                    backgroundColor: '#17171795',
                    justifyContent: 'center'
                }}>
                    <TextInput autoFocus multiline onChangeText={setbody} placeholderTextColor={'white'} placeholder='What are you thinking about?' style={{
                        color: textColor,
                        fontFamily: FontStyle,
                        textAlign: textAlign,
                        fontSize: fontSize,
                        // maxWidth: '90%',
                        borderRadius: 5,
                        alignSelf: 'center',
                        backgroundColor: textColor === 'white' ? '#0d0d0d99' : 'white',
                        padding: 5
                    }} value={body} />
                    <TouchableOpacity style={[ButtonBackgroundStyles, { backgroundColor: 'transparent', alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <TouchableOpacity onPress={Cancel} style={ButtonBackgroundStyles}>
                            <Feather name='x' color={'white'} size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ChooseFont} style={ButtonBackgroundStyles}>
                            <Foundation name='bold' color={'white'} size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => (setTextColor(textColor === 'white' ? '#0d0d0d99' : 'white'))} style={ButtonBackgroundStyles}>
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
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    )
}
function Editor(props) {
    const { uri, fontSize, FontStyle, body, TextAdded, setAddingText, AddingText, setTextAdded, next, textColor, setTextColor, textAlign, setTextAlign } = props;
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
    return (
        <>
            <ViewShot ref={viewShot} options={{ format: "jpg", quality: 0.9 }}>
                <ImageBackground blurRadius={2000} style={{ height: '100%', width: '100%', backgroundColor: 'black' }} source={{ uri: uri }}>
                    <ImageBackground resizeMode='contain' style={{ height: '100%', width: '100%' }} source={{ uri: uri }}>
                        {TextAdded &&
                            <Draggable x={100} y={300}>
                                <TouchableOpacity onPress={() => (setAddingText(true))} style={{
                                    backgroundColor: textColor === 'white' ? '#0d0d0d99' : 'white',
                                    maxWidth: '80%',
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 10,
                                }}>
                                    <Text style={{
                                        color: textColor,
                                        fontFamily: FontStyle,
                                        textAlign: textAlign,
                                        fontSize: fontSize
                                    }}>
                                        {body}
                                    </Text>
                                </TouchableOpacity>
                            </Draggable>}
                    </ImageBackground>
                </ImageBackground>
            </ViewShot>
            <View style={NavStyles}>
                <TouchableOpacity onPress={() => (nav.pop())} style={ButtonBackgroundStyles}>
                    <AntDesign name='arrowleft' color={'white'} size={25} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setTextAdded(!TextAdded)
                    setAddingText(!AddingText)
                }} style={[ButtonBackgroundStyles, { paddingHorizontal: 10 }]}>
                    <Text style={{ color: 'white', fontFamily: 'Poppins-Bold' }}>{TextAdded ? 'Edit Text' : 'Add Text'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={Capture} style={ButtonBackgroundStyles}>
                    <AntDesign name='arrowright' color={'white'} size={25} />
                </TouchableOpacity>
            </View>
        </>
    )
}
