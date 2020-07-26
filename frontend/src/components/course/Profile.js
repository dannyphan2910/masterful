import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/auth';
import API from '../../utils/API';
import Nav from '../shared/Nav';
import Loading from '../shared/Loading';
import moment from 'moment';
import CourseRow from '../shared/CourseRow';

function Profile() {
    let { id } = useParams();
    const { state } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [masterCourses, setMasterCourses] = useState([]);
    const [learningCourses, setLearningCourses] = useState([]);

    useEffect(() => {
        if (id === state.user._id) {
            setUser(state.user);
        } else {
            API.getUser(id)
                .then(function (response) {
                    // handle success
                    const data = response.data;
                    setUser(data);
                })
                .catch(function (error) {
                    // handle error
                     
                });
        }
        async function getCourses() {
            var isError = false;
            await API.getMasterCourses(id)
                .then(function (response) {
                    // handle success
                    const data = response.data;
                    setMasterCourses(data);
                })
                .catch(function (error) {
                    // handle error
                     
                    isError = true;
                });

            await API.getCoursesProgress(id)
                .then(function (response) {
                    // handle success
                    const data = response.data;
                    setLearningCourses(data);
                })
                .catch(function (error) {
                    // handle error
                     
                    isError = true;
                });
            return isError;
        }
        getCourses().then(isError => {
            if (!isError) {
                setLoading(false);
            }
        });
    }, [user, loading]);

    var created = undefined;
    if (user) {
        created = new Date(user.createdAt);
    }

    return (
        <div className="profile-dashboard d-flex">
            <Nav toggle="profile" />
            <div className="profile-info overflow-auto w-75">
                {!loading &&
                <>
                    <div className="profile-header d-flex align-items-center justify-content-between py-4 px-5">
                        <img src="https://picsum.photos/350" alt="profile pic" className="h-100 rounded-circle shadow-lg" />
                        <h1 className="font-weight-bold">{user.firstName + ' ' + user.lastName}</h1>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <p className="text-muted">Days with us</p>
                            <div className="day-counter rounded-circle mx-auto d-flex align-items-center justify-content-center my-2 text-white shadow-lg">
                                <span className="h4 font-weight-bold m-0 p-0">{Math.floor(moment.duration(new Date() - created).asDays())}</span>
                            </div>
                            <p className="text-muted">from {created.toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="p-5">
                        <CourseRow title={`I'm teaching ${masterCourses.length} courses`} courses={masterCourses} />
                        <CourseRow title={`and learning ${learningCourses.length} courses`} courses={learningCourses} />
                    </div>
                </>
                }
                {loading && <Loading />}
            </div>
        </div>
    );
}

export default Profile;