import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../../AppContext'
import { MainLookup } from '../../../Lookup'
import Feather from 'react-native-vector-icons/Feather'
import { host } from '../../../Components/host';
import { RenderUserPfpsList } from '../Profile/index'
import ActionBtns from './ActionButtons'
import RenderBio from './RenderBio'
import MoreModal from './MoreModal'

const { height, width } = Dimensions.get('window')


export default function ProfileCard({ profile, pfps }) {
    const ctx = useContext(AppContext);
    const [Followers, setFollowers] = useState(profile.followers);
    const [Following, setFollowing] = useState(profile.following);
    const [Posts, setPosts] = useState(profile.posts);


    const [IsFollowing, setIsFollowing] = useState(profile.is_following);
    const [IsFriends, setIsFriends] = useState(profile.friends);
    const [IsBlocked, setIsBlocked] = useState(profile.is_blocked);
    const [IsMyProfile, setIsMyProfile] = useState(profile.username === profile.request_user);
    const [HasBlocked, setHasBlocked] = useState(profile.has_blocked);
    const [CSRFToken, setCSRFTOKEN] = useState()
    // FETCH CSRFTOKEN
    useEffect(() => {
        fetch(`${host}/csrf`, { method: "GET", headers: { 'Content-Type': 'application/json', }, })
            .then(data => data.json())
            .then(data => { setCSRFTOKEN(data.csrf) })
            .catch(error => console.log(error))
    }, [])
    const [showMore, setshowMore] = useState(false)

    const FollowLookup = (action) => {
        const cb = (r, c) => {
            if (c === 201 || c === 200) {
                setFollowers(r.other.followers)
                setFollowing(r.other.following)
                setPosts(r.other.posts)

                setIsBlocked(r.other.is_blocked)
                setIsFollowing(r.other.is_following)
                setIsMyProfile(r.other.is_my_profile)
                setHasBlocked(r.other.has_blocked)
                setIsFriends(r.other.friends)
            }
        }
        MainLookup(cb, { csrf: CSRFToken, endpoint: `/api/user/action`, method: 'POST', data: { action: action, id: profile.id } })
    }

    const Follow = () => {
        if (!IsMyProfile) {
            if (IsFollowing) {
                FollowLookup('unfollow')
            } else {
                FollowLookup('follow')
            }
        }
    }
    const Block = () => {
        if (!IsMyProfile) {
            if (IsBlocked) {
                FollowLookup('unblock')
            } else {
                FollowLookup('block')
            }
        }
    }
    const ModalCallback = (type) => {
        if (type === 'block') {
            Block()
        } else if (type === 'unfollow') {
            Follow()
        }
    }
    const NumberStyles = {
        color: ctx.textColor,
        fontSize: 13,
        fontFamily: "Poppins-Regular"
    }
    const isMyProfile = profile.username === profile.request_user
    const ChildProps = {
        IsBlocked: IsBlocked,
        profile: profile,
        pfps: pfps,
        isMyProfile: isMyProfile,
        IsFollowing: IsFollowing,
        IsMyProfile: IsMyProfile,
        Follow: Follow,
        IsFriends: IsFriends,
        NumberStyles: NumberStyles,
        Followers: Followers,
        Following: Following,
        Posts: Posts,
        HasBlocked: HasBlocked
    }
    return (
        <>
            {!HasBlocked ?
                <>{pfps.length > 0 && <RenderUserPfpsList pfps={pfps} viewing={true} user={profile} />}</>
                : <View style={{ height: height / 4, width: '100%' }} />}
            <ActionBtns {...ChildProps} />
            <View style={{
                padding: 10
            }}>
                <Text style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    color: ctx.textColor
                }}>
                    <RenderBio str={HasBlocked ? '' : profile.bio} />
                </Text>
            </View>
            {!IsMyProfile && !HasBlocked &&
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    position: 'absolute',
                    top: 20,
                    right: 0,
                    padding: 20,
                    alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={() => (setshowMore(true))} style={{ backgroundColor: '#17171795', padding: 10, borderRadius: 100 }}>
                        <Feather name='more-vertical' size={20} color={'white'} />
                    </TouchableOpacity>
                </View>}

            {!HasBlocked && <MoreModal {...ChildProps} callback={ModalCallback} item={profile} showMore={showMore} setshowMore={setshowMore} />}
        </>
    )
}