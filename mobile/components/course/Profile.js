import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/auth';
import API from '../../utils/API';
import Loading from '../shared/Loading';
import moment from 'moment';
import CourseRow from '../shared/CourseRow';
import { Text, ScrollView, Image, StyleSheet, View } from 'react-native';
import { Thumbnail, H3 } from 'native-base';
import CustomButton from '../shared/CustomButton';

function Profile({ route, navigation }) {
    let { id } = route.params;
    const { state, dispatch } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [masterCourses, setMasterCourses] = useState([]);
    const [learningCourses, setLearningCourses] = useState([]);

    const isCurrentUser = id === state.user._id;

    useEffect(() => {
        if (isCurrentUser) {
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

    const logOut = function () {
        dispatch({ type: "LOGOUT" });
    }

    const navigate = (courseId) => {
        navigation.navigate('Course', { id: courseId })
    }

    return (
        <>
            {loading && <Loading />}
            {
                !loading &&
                <ScrollView style={styles.background}>
                    <>
                        <View style={styles.backgroundCenter}>
                            <Image source={{ uri: "https://picsum.photos/350" }} style={[styles.profileImage, styles.shadow]} />
                            <H3 style={{ fontWeight: 'bold' }}>{user.firstName + ' ' + user.lastName}</H3>
                        </View>

                        <View>


                            <CourseRow title={`I'm teaching ${masterCourses.length} courses`} courses={masterCourses} navigate={navigate} />
                            <CourseRow title={`and learning ${learningCourses.length} courses`} courses={learningCourses} navigate={navigate} />

                        </View>
                    </>

                    {isCurrentUser &&
                        <CustomButton title="Sign Out" style={styles.buttonSignOut} textStyle={styles.buttonTextSignOut} onPress={logOut} />
                    }
                </ScrollView>
            }
        </>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#fffffc",
        minHeight: '100%',
        marginBottom: 20
    },
    backgroundCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },
    profileImage: {
        width: 150,
        aspectRatio: 1,
        borderRadius: 150 / 2,
        marginBottom: 20
    },
    shadow: {
        shadowColor: 'gray',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0
    },
    buttonSignOut: {
        marginTop: 20,
        backgroundColor: "#FF6B6B",
        width: "100%"
    },
    buttonTextSignOut: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 20
    },
})

export default Profile;