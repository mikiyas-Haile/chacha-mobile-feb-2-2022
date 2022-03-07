import { SentencesList } from "./ListOfWords"

export function TranslateAfricaans(str, id){
    word = SentencesList.filter(item => item.src === str)
    return word[0].af
}