import React, { useEffect, useContext, useState } from 'react';
import { View } from 'react-native';
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import { AuthContext } from '../../context/auth';
import API from '../../utils/API';
import Loading from '../shared/Loading';
import { StackActions } from '@react-navigation/native';

function Conference({ route, navigation }) {
    let { id, lectureId } = route.params;
    const { state } = useContext(AuthContext);

    const roomName = lectureId;

    function reset() {
        API.setNotLive(id)
            .then(function (response) {
                // handle success
                 
            })
            .catch(function (error) {
                // handle error
                 
            });
    }

    useEffect(() => {
        setTimeout(() => {
            const url = `https://meet.jit.si/${roomName}`; // can also be only room name and will connect to jitsi meet servers
            const userInfo = { displayName: state.user.firstName + ' ' + state.user.lastName, email: state.user.email, avatar: '' };
            JitsiMeet.call(url, userInfo);
            /* You can also use JitsiMeet.audioCall(url) for audio only call */
            /* You can programmatically end the call with JitsiMeet.endCall() */
            API.setLive(id)
                .then(function (response) {
                    // handle success
                     
                })
                .catch(function (error) {
                    // handle error
                     
                });
        }, 5000);

        return () => JitsiMeet.endCall();
    }, []);

    const onConferenceTerminated = (nativeEvent) => {
        /* Conference terminated event */
        reset();
        navigation.dispatch(StackActions.pop(1));
    }

    const onConferenceJoined = (nativeEvent) => {
        /* Conference joined event */
    }

    const onConferenceWillJoin = (nativeEvent) => {
        /* Conference will join event */
    }

    return (
        <View style={{ backgroundColor: 'black', flex: 1 }}>
            <JitsiMeetView onConferenceTerminated={onConferenceTerminated} onConferenceJoined={onConferenceJoined} onConferenceWillJoin={onConferenceWillJoin} style={{ flex: 1, height: '100%', width: '100%' }} />
        </View>
    );
}

export default Conference;