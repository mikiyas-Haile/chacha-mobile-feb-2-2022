import Moment from 'moment';

export default function DateAdded(str) {
    var dateCalender = str.split("T")[0]
    var time = str.split("T")[1].split(".")[0]
    return Moment(str).fromNow()
}


export function SecondaryDateAdded(str) {
    var dateCalender = str.split("T")[0]
    var time = str.split("T")[1].split(".")[0]
    return dateCalender
}