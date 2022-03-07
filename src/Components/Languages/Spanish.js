import { SentencesList } from "./ListOfWords"

export function TranslateSpanish(str, id) {
    word = SentencesList.filter(item => item.src === str)
    return word[0].es
}