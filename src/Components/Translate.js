import { MainLookup, FetchLookup } from '../Lookup'
import { host } from './host'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TranslateArabic } from './Languages/Arabic'
import { TranslateSw } from './Languages/Swahili'
import { TranslateFrench } from './Languages/French'
import { TranslateSpanish } from './Languages/Spanish'
import { TranslateAfricaans } from './Languages/Africaans'
import { TranslateAmharic } from './Languages/Amharic'
import { TranslateAfaanOromo } from './Languages/AfaanOromo'
import { useContext } from 'react'
import { AppContext } from '../../AppContext'

// export function NormalTranslateApi({ str, id }) {
export function TranslateApi({ str, id }) {
    const ctx = useContext(AppContext);
    const lan = ctx.language
    // console.log("======================================")
    // console.log("LANGUAGE: ", lan)
    // console.log("WORD: ", str)
    // console.log("======================================")

    if (lan === 'english') {
        return str
    }
    else if  (lan === 'afan_oromo') {
        return TranslateAfaanOromo(str, id)
    }
    else if (lan === 'Amharic') {
        return TranslateAmharic(str, id)
    }
    else if (lan === 'swahili') {
        return TranslateSw(str, id)
    }
    else if (lan === 'arabic') {
        return TranslateArabic(str, id)
    }
    else if (lan === 'french') {
        return TranslateFrench(str, id)
    }
    else if (lan === 'spanish') {
        return TranslateSpanish(str, id)
    }
    else if (lan === 'africaans') {
        return TranslateAfricaans(str, id)
    }
    else {
        return str
    }
}

export function FetchTranslateApi(str) {
    let responsee;
    const LanguageCallback = async (e, lan) => {
        const url = encodeURI(`${host}/languages/str=${str}/to=${lan}`)
        fetch(url, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => {
                responsee = data.res
            })
            .catch(error => console.log(error))
    }
    AsyncStorage.getItem('lang', LanguageCallback)
    try {
        if (responsee) {
            return responsee
        } else {
            return str
        }
    } catch (e) {
        console.log(e)
        return str
    }
}