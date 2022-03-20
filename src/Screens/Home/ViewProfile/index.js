import { View, ActivityIndicator } from 'react-native'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../../AppContext'
import { MainLookup } from '../../../Lookup'
import RenderProfile from './RenderProfile';

export default function ViewProfile(props) {
    const ctx = useContext(AppContext);
    const { user } = props?.route?.params;
    const [filled, setFilled] = useState(false);
    const [UserNotFound, setUserNotFound] = useState(false)
    const [User, setUser] = useState([]);
    const [pfps, setpfps] = useState([]);

    useEffect(() => {
        if (user["pfps"] === undefined) {
            const cb = (r, c) => {
                if (c === 200) {
                    setpfps(r?.pfps ? r?.pfps : [])
                    setUser(r)
                    setFilled(true)
                } else if (c === 404) {
                    setUserNotFound(true)
                } else {
                    setLoaded(false)
                    ctx.MyAlert("There was an error Please try again later")
                }
            }
            MainLookup(cb, { method: 'GET', endpoint: `/api/user/${user}/no-post` })
        } else {
            setpfps(user?.pfps ? user?.pfps : [])
            setFilled(true)
            setUser(user)
        }
    }, [])

    useEffect(() => {

        return () => {
            setUser([]);
            setFilled(false)
        }
    }, [])

    const profileProps = { User, UserNotFound, pfps }
    if (filled) {
        return (
            <RenderProfile {...profileProps} />
        )
    } else {
        return (
            <View style={{
                flex: 1,
                backgroundColor: ctx.bgColor,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <ActivityIndicator size={'large'} color={ctx.textColor} />
            </View>
        )
    }

}
