import { SentencesList } from "./ListOfWords"

export function TranslateAfaanOromo(str, id){
    word = SentencesList.filter(item => item.src === str)
    return word[0].oro
}