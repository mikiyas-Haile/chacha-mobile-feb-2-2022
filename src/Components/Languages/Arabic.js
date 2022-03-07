import { SentencesList } from "./ListOfWords"

export function TranslateArabic(str, id){
    word = SentencesList.filter(item => item.src === str)
    return word[0].ar
}