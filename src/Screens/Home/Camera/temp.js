const HandlePost = () => {
    const cb = (r, c) => {
        setBody('')
        if (c === 201) {
            links.forEach(item => {
                const pcb = (_r, _c) => {
                    console.log(_r, _c)
                    setLinks([])
                    if (_c === 200) {
                        setMsg("Post was made successfully.")
                        setSnackBarOpacity(1)
                        setInterval(() => {
                            setSnackBarOpacity(0)
                            setMsg('')
                            // nav.push("Home")
                        }, 5000)
                    }
                }
                MainLookup(pcb, {
                    endpoint: `/api/post/${r.id}/add-att`, data: {
                        file: item,
                        type: 'img'
                    }, method: 'POST', csrf: CSRFToken
                })
            })
            // Upload the images to firebase and update each one of them using `/api/post/${post_id}/add-att`
        } else {
            setBody(body)
            setMsg("There was an error trying to post.\nPlease try again.")
            setSnackBarOpacity(1)
            setInterval(() => {
                setSnackBarOpacity(0)
                setMsg('')
            }, 5000)
        }
    }
    MainLookup(cb, {
        endpoint: `/api/post/create`, data: {
            body: body
        }, method: 'POST', csrf: CSRFToken
    })
}
let linkss = []
const PictureUploadedHandlers = (r, c, id) => {
    if (c === 201) {
        linkss = linkss.concat(r)
    }
    console.log(linkss)
    setLinks(linkss)
    linkss = []
}
const Post = () => {
    if (body) {
        let count = SelectedPictures.length;
        for (let i = 0; i < count; i++) {
            if (count === i + 1) {
                HandlePost()
                console.log('done')
                break
            }
            UploadImage(`images/${SelectedPictures[i].uri}`, SelectedPictures[i].uri, PictureUploadedHandlers, i + 1)
        }
    }
}