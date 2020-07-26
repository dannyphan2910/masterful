import React, { useContext, useEffect, useState } from 'react';
import API from '../utils/API';
import { AuthContext } from '../context/auth';
import moment from 'moment';
import Loading from './shared/Loading';
import { Text, View, ScrollView, StyleSheet, Image, ImageBackground, Dimensions } from 'react-native';
import { Card, CardItem, H1, Title, Button, Row, Subtitle, H2, H3, Header, Icon } from 'native-base';
import Ending from '../assets/images/ending.svg';
import masterBackground from '../assets/images/master-background.png';

function MasterDashboard({ navigation }) {
    const { state } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        API.getMasterCourses(state.user._id)
            .then(function (response) {
                // handle success
                const data = response.data;
                setCourses(data);

                var thisWeekLectures = [];
                data.forEach(course => {
                    const lectures = course.lectures;
                    const weekLectures = lectures.filter(lecture => {
                        const thisDate = new Date(lecture.date);
                        const startOfWeek = moment().startOf('isoWeek').subtract(1, 'd').toDate();
                        const endOfWeek = moment().endOf('isoWeek').subtract(1, 'd').toDate();
                        return startOfWeek <= thisDate && thisDate <= endOfWeek;
                    });

                    const reformatted = weekLectures.map(lecture => {
                        const thisDate = new Date(lecture.date);
                        return {
                            title: `${lecture.title} (${course.title})`,
                            startDate: thisDate,
                            endDate: moment(thisDate).add(lecture.length, 'm').toDate()
                        }
                    });

                    thisWeekLectures = thisWeekLectures.concat(reformatted);
                })
                setSchedule(thisWeekLectures);
                setLoading(false);
            })
            .catch(function (error) {
                // handle error
                 
            });
    }, [loading]);

    const rerender = function () {
        setLoading(true);
    }

    const navigate = (courseId) => {
        navigation.push('Course', { id: courseId })
    }

    const unarchivedCourses = courses.filter(course => !course.isArchived);
    const archivedCourses = courses.filter(course => course.isArchived);

    return (
        <>

            <View style={{ minHeight: Dimensions.get('window').height }}>
                <ScrollView styles={styles.background} contentContainerStyle={styles.center}>
                    <Button icon transparent style={{ alignSelf: 'flex-start', marginLeft: 20 }} onPress={() => navigation.navigate('Home')}>
                        <Icon name="home" type="FontAwesome5" style={styles.homeIcon} />
                    </Button>
                    <Text style={styles.title}>MASTER DASHBOARD</Text>
                    {!loading &&
                        <>
                            <View style={{ marginBottom: 30 }}>
                                <H2 style={{ color: 'gray' }}>Good Day, {state.user.firstName}</H2>
                                <H3 style={{ color: 'gray' }}>You have {schedule.length} lectures this week.</H3>
                            </View>
                            <View style={{ marginBottom: 30 }}>
                                <Text style={styles.sectionTitle}>LIVE COURSES</Text>
                                {unarchivedCourses.map(course => <MasterCard course={course} key={course._id} navigate={navigate} />)}
                            </View>
                            <View>
                                <Text style={styles.sectionTitle}>COMPLETED COURSES</Text>
                                {archivedCourses.map(course => <MasterCard course={course} key={course._id} navigate={navigate} />)}
                            </View>
                            <Ending style={{ marginTop: 20 }} />
                        </>
                    }
                    {loading && <Loading />}
                </ScrollView>
                <ImageBackground source={masterBackground} style={[imageBackgroundConfig.fixed, imageBackgroundConfig.size]} />
            </View>

        </>
    );
}

function MasterCard(props) {
    return (
        <Button style={{ height: 375, justifyContent: 'center' }} transparent onPress={() => props.navigate(props.course._id)}>
            <Card style={[styles.card, styles.shadow]}>
                <View>
                    <CardItem cardBody>
                        <Image source={{ uri: "https://picsum.photos/350?random=" + props.course._id }} style={styles.cardImage} />
                    </CardItem>
                    <CardItem>
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{props.course.title.substring(0, 35) + (props.course.title.length >= 35 ? '...' : '')}</Text>
                            <Subtitle style={styles.textMuted}>{props.course.learners.length} enrolled</Subtitle>
                            <Text style={{ marginTop: 10 }}>{(props.course.description).substring(0, 210) + (props.course.description.length >= 225 ? '...' : '')}</Text>
                        </View>
                    </CardItem>
                </View>
            </Card>
        </Button>
    );
}


const styles = StyleSheet.create({
    background: {
        backgroundColor: "transparent",
        marginBottom: 20,
        padding: 20
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        width: '95%',
        height: '100%',
        padding: 0,
        margin: 0,
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
    cardImage: {
        height: 200,
        width: '100%',
        margin: 0,
        padding: 0
    },
    textMuted: {
        fontSize: 10,
        color: 'gray',
    },
    title: {
        color: "#2EC4B6",
        fontWeight: '800',
        fontSize: 40,
        letterSpacing: 3,
        marginBottom: 30,
        textDecorationColor: "#2EC4B6",
        textDecorationLine: 'underline',
    },
    sectionTitle: {
        fontWeight: '800',
        fontSize: 25,
        marginBottom: 20,
        textAlign: 'center',
        color: "#1A535C"
    },
    homeIcon: {
        color: "#1A535C",
        fontSize: 25
    }
});

const imageBackgroundConfig = StyleSheet.create({
    fixed: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1
    },
    size: {
        width: "100%",
        height: "100%"
    }
})

export default MasterDashboard;