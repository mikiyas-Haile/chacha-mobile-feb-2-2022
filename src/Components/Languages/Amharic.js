import { SentencesList } from "./ListOfWords"

export function TranslateAmharic(str, id){
    word = SentencesList.filter(item => item.src === str)
    return word[0].am
}