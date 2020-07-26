import React, { useState, useEffect, useContext } from 'react';
import { Text, ImageBackground, ScrollView, StyleSheet, View, Alert, Dimensions, Modal } from 'react-native';
import API from '../../utils/API';
import { AuthContext } from '../../context/auth';
import Loading from '../shared/Loading';
import { H1, Row, Thumbnail, H2, Card, Col, Button, Container, Left, Icon, Body, Right, Header, Toast, Root } from 'native-base';
import CustomButton from '../shared/CustomButton';
import LiveIcon from '../../assets/images/live-icon.svg';
import Lectures from './Lectures';

export default function CoursePage({ route, navigation }) {
    let { id } = route.params
    const { state } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState({});

    useEffect(() => {
        API.getCourse(id)
            .then(function (response) {
                // handle success
                const data = response.data;
                setCourse(data);
                setLoading(false);
            })
            .catch(function (error) {
                // handle error

            });
    }, [course._id, loading]);

    var liveLectures = undefined;
    var isMaster = undefined;
    var enrolled = undefined;
    var sortedLearners = undefined;
    if (course.lectures) {
        liveLectures = course.lectures.filter(lecture => new Date(lecture.date) > new Date());
        isMaster = state.user._id === course.master._id;
        enrolled = course.learners.map(learner => learner._id).includes(state.user._id);
        sortedLearners = course.learners.sort((a, b) => a.firstName.localeCompare(b.firstName)).filter(learner => learner._id !== state.user._id);
        if (enrolled) {
            sortedLearners.unshift(state.user);
        }
    }

    const archive = function () {
        API.archive(course._id, state.user._id)
            .then(function (response) {
                // handle success
            })
            .catch(function (error) {
                // handle error

            });
    }

    const register = function () {
        API.register(course._id, state.user._id)
            .then(function (response) {
                // handle success
            })
            .catch(function (error) {
                // handle error

            });
    }

    const unregister = function () {
        API.unregister(course._id, state.user._id)
            .then(function (response) {
                // handle success
            })
            .catch(function (error) {
                // handle error

            });
    }

    const rerender = function () {
        setLoading(true);
    }

    const navigateProfile = (userId) => {
        navigation.push('Profile', { id: userId });
    }

    const navigateConference = (lectureId) => {
        navigation.push('Conference', { id: course._id, lectureId: lectureId });
    }

    const goBack = () => navigation.goBack();

    return (
        <Root>
            <CourseHeader goBack={goBack} openModal={() => Toast.show({ text: 'Use our desktop version for a full Masterful experience.', buttonText: 'Sure', duration: 5000 })} />
            {loading && <Loading />}
            {!loading &&
                <ScrollView style={styles.background}>
                    <Card style={[{ paddingBottom: 10 }, styles.shadow]}>
                        <ImageBackground source={{ uri: "https://picsum.photos/350" }} style={styles.coverPhoto}>
                            <H1 style={styles.courseTitle}>{course.title}</H1>
                        </ImageBackground>
                        <Row style={[{ width: '100%' }, styles.center]}>
                            <Button transparent onPress={() => navigation.navigate('Profile', { id: course.master._id })} style={{ height: '100%' }}>
                                <View>
                                    <Text style={styles.textMuted}>Taught By</Text>
                                    <Text style={styles.masterName}>{course.master.firstName + ' ' + course.master.lastName}</Text>
                                </View>
                                <Thumbnail circular source={{ uri: "https://picsum.photos/350?random=" + course.master._id }} />
                            </Button>
                        </Row>
                        <Row style={styles.masterContainer}>
                            <CourseButton isMaster={isMaster} isArchived={course.isArchived} enrolled={enrolled} course={course} archive={archive} register={register} unregister={unregister} rerender={rerender} />
                            {!course.isArchived && course.isLive && <LiveIcon />}
                            {course.isArchived && <Text style={{ color: 'gray', fontSize: 20 }}>ARCHIVED</Text>}
                        </Row>
                    </Card>
                    <Card style={[styles.card, styles.shadow]}>
                        <View>
                            <Text style={styles.textMuted}>Estimated duration: {course.courseLength} months</Text>
                            <Text style={styles.textMuted}>{liveLectures.length} lectures remaining</Text>
                        </View>
                        <ScrollView style={{ maxHeight: '80%', marginTop: 10 }}>
                            <Text>{course.description || 'No description'}</Text>
                        </ScrollView>
                    </Card>
                    <Card style={[styles.card, styles.shadow]}>
                        <View style={{ marginTop: 10, marginBottom: 10 }}>
                            <H2 style={{ fontWeight: 'bold', textAlign: 'center' }}>ENROLLED LEARNERS</H2>
                        </View>
                        <ScrollView horizontal>
                            {sortedLearners.map(learner => <Learner learner={learner} key={learner._id} user={state.user} navigate={navigateProfile} />)}
                        </ScrollView>
                    </Card>
                    <Card style={[styles.card, styles.shadow, { marginBottom: 100 }]}>
                        <View style={{ marginTop: 10, marginBottom: 10 }}>
                            <H2 style={{ fontWeight: 'bold', textAlign: 'center' }}>LECTURES</H2>
                        </View>
                        <View>
                            <Lectures course={course} user={state.user} navigateConference={navigateConference} />
                        </View>
                    </Card>
                </ScrollView>
            }
        </Root>
    );
}

function CourseButton(props) {
    const createAlert = (title, message, action) => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: 'Confirm',
                    onPress: () => action()
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        )
    }

    if (!props.isMaster) {
        if (!props.enrolled) {
            return (
                <CustomButton title="REGISTER" style={[buttonStyles.button, buttonStyles.buttonRegister]} textStyle={buttonStyles.buttonTextDark} onPress={() => createAlert('Confirm Registration', `Are you sure that you want to register for the course ${props.course.title}?`, props.register)} />
            );
        } else {
            return (
                <CustomButton title="UNREGISTER" style={[buttonStyles.button, buttonStyles.buttonUnregister]} textStyle={buttonStyles.buttonTextLight} onPress={() => createAlert('Confirm Unregistration', `Are you sure that you want to unregister from the course ${props.course.title}?`, props.buttonUnregister)} />
            );
        }
    } else {
        if (!props.isArchived) {
            return (
                <CustomButton title="ARCHIVE" style={[buttonStyles.button, buttonStyles.buttonArchive]} textStyle={buttonStyles.buttonTextLight} onPress={() => createAlert('Confirm Archive', `Are you sure that you want to archive the course ${props.course.title}? This action cannot be undone.`, props.archive)} />
            );
        } else {
            return null;
        }
    }
}

function Learner(props) {
    return (
        <Button transparent onPress={() => props.navigate(props.learner._id)} style={{ height: '100%' }}>
            <View style={[styles.center, { marginRight: 10 }]}>
                <Thumbnail circular source={{ uri: "https://picsum.photos/350?random=" + props.learner._id }} />
                <Text style={[styles.textMuted, { marginTop: 5, backgroundColor: props.learner._id === props.user._id ? "#F7FFF7" : "#FFF" }]}>{props.learner.firstName + ' ' + props.learner.lastName}</Text>
            </View>
        </Button>
    );
}

function CourseHeader(props) {
    return (
        <Header>
            <Left>
                <Button transparent onPress={() => props.goBack()}>
                    <Icon name='arrow-left' type="FontAwesome5" style={styles.icon} />
                </Button>
            </Left>
            <Right>
                <Button transparent onPress={() => props.openModal()}>
                    <Icon name='info' type="Feather" style={styles.icon} />
                </Button>
            </Right>
        </Header>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#fffffc",
        minHeight: '100%',
        marginBottom: 20
    },
    coverPhoto: {
        height: 200,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    courseTitle: {
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center'
    },
    card: {
        padding: 10
    },
    shadow: {
        // for ios 
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        // for android
        elevation: 5
    },
    masterContainer: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    masterName: {
        marginRight: 5,
        fontSize: 15,
        color: 'gray'
    },
    textMuted: {
        fontSize: 15,
        color: 'gray'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        color: "#1A535C",
        fontSize: 25
    },
    fixed: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: Dimensions.get('window').height,
        justifyContent: "center"
    },
    modal: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    }
});

const buttonStyles = StyleSheet.create({
    button: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    buttonRegister: {
        backgroundColor: "#fffffc",
    },
    buttonUnregister: {
        backgroundColor: "gray",
    },
    buttonArchive: {
        backgroundColor: "#ff6b6b",
    },
    buttonTextDark: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 15,
        textAlign: 'center'
    },
    buttonTextLight: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 15,
        textAlign: 'center'
    }
})