import { SentencesList } from "./ListOfWords"

export function TranslateFrench(str, id) {
    word = SentencesList.filter(item => item.src === str)
    return word[0].fr
}