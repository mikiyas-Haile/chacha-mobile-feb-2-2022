import { SentencesList } from "./ListOfWords"

export function TranslateSw(str, id) {
    word = SentencesList.filter(item => item.src === str)
    return word[0].sw
}
