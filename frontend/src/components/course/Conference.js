import React, { useEffect, useState, useContext } from 'react';
import { useParams, Redirect } from "react-router-dom";
import { useJitsi } from 'react-jutsu';
import API from '../../utils/API';
import { AuthContext } from '../../context/auth';

function Conference() {
    let { id, lectureId } = useParams();
    const { state } = useContext(AuthContext);

    const [lecture, setLecture] = useState({});
    const [left, setLeft] = useState(false);

    const roomName = lectureId;
    const parentNode = 'jitsi-container';
    const jitsi = useJitsi({ roomName, parentNode });

    function reset() {
        API.setNotLive(id)
            .then(function (response) {
                // handle success
                 
                setLeft(true);
            })
            .catch(function (error) {
                // handle error
                 
            });
    }

    useEffect(() => {
        API.getLecture(lectureId)
            .then(function (response) {
                // handle success
                const data = response.data;
                setLecture(data);
                if (jitsi) {
                    jitsi.executeCommand('subject', lecture.title)
                }
            })
            .catch(function (error) {
                // handle error
                 
            });

        window.onpopstate = event => {
            reset();
        }
    }, [lecture])

    useEffect(() => {
        if (jitsi) {
            jitsi.addEventListener('videoConferenceJoined', () => {
                jitsi.executeCommand('displayName', `${state.user.firstName} ${state.user.lastName}`)
                // jitsi.executeCommand('password', '12345')

                API.setLive(id)
                .then(function (response) {
                    // handle success
                     
                })
                .catch(function (error) {
                    // handle error
                     
                });
            })

            jitsi.addEventListener('videoConferenceLeft', () => {
                reset();
                jitsi.executeCommand('hangup');
            })
        }

        return () => jitsi && jitsi.dispose();
    }, [jitsi])

    return left ? <Redirect to={`/courses/${id}`} /> : <div className="vw-100 vh-100" id={parentNode}></div>;
}

export default Conference;