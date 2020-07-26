import React from 'react';
import API from '../../utils/API';
import { Text, StyleSheet, Linking } from 'react-native';
import { View, Icon, Accordion, Row, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';

export default function Lectures(props) {
    const lecturesData = props.course.lectures.sort((a, b) => new Date(b.date) - new Date(a.date)).map(lecture => ({ title: lecture.title, content: lecture.description, length: lecture.length, date: lecture.date, id: lecture._id }));
    
    function _renderHeader(item, expanded) {
        const isMaster = props.user._id === props.course.master._id;
        const isActive = new Date(item.date) > new Date();
        const enrolled = props.course.learners.map(learner => learner._id).includes(props.user._id);

        return (
            <Row style={{ padding: 10, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', borderBottomWidth: 1, borderBottomColor: '#D3D3D3' }}>
                <View style={{ flexShrink: 1, maxWidth: '90%' }}>
                    <Text style={styles.lectureTitle}>{item.title}</Text>
                    <Text style={styles.lectureDate}>Date: {new Date(item.date).toLocaleString()}</Text>
                </View>
                <LectureButton isMaster={isMaster} isActive={isActive} enrolled={enrolled} isLive={props.course.isLive} navigate={() => props.navigateConference(item.id)} />
            </Row>
        );
    }

    function _renderContent(item) {
        const isActive = new Date(item.date) > new Date();

        return (
            <View style={{ padding: 10 }}>
                <Text style={isActive ? styles.activeTag : styles.inactiveTag}>{isActive ? "ACTIVE" : "INACTIVE"}</Text>
                <Text style={styles.textMuted}>Estimated {item.length} minutes</Text>
                <Text style={{ marginTop: 10 }}>{item.content}</Text>
            </View>
        );
    }

    return (
        <View>
            <Accordion
                dataArray={lecturesData}
                animation={true}
                expanded={true}
                renderHeader={_renderHeader}
                renderContent={_renderContent} />
        </View>
    );
}

function LectureButton(props) {
    if (!props.isMaster && !props.enrolled) {
        return (
            <Text style={{ color: 'gray', fontSize: 10 }}>{"NOT\nENROLLED"}</Text>
        );
    }
    if (props.isActive) {
        if (props.isMaster) {
            return (
                <Button style={styles.fixButton} icon success={!props.isLive} danger={props.isLive} transparent small onPress={() => !props.isLive ? props.navigate() : {}}>
                    <Icon name="video" type="FontAwesome5" />
                </Button>
            )
        } else {
            return (
                <Button style={styles.fixButton} icon success={props.isLive} danger={!props.isLive} transparent small onPress={() => props.isLive ? props.navigate() : {}}>
                    <Icon name="video" type="FontAwesome5" />
                </Button>
            )
        }
    } else {
        return (
            <Button style={styles.fixButton} icon success transparent small onPress={() => Linking.openURL("https://www.youtube.com/watch?v=7X8II6J-6mU")}>
                <Icon name="play" type="FontAwesome5" />
            </Button>
        )
    }
}

const styles = StyleSheet.create({
    lectureTitle: {
        fontWeight: "600",
        fontSize: 20,
    },
    lectureDate: {
        fontSize: 15,
        color: 'gray'
    },
    activeTag: {
        color: 'green',
        fontSize: 15,
    },
    inactiveTag: {
        color: 'red',
        fontSize: 15
    },
    textMuted: {
        fontSize: 13,
        color: 'gray'
    },
    fixButton: {
        paddingTop: 5, 
        paddingBottom: 5
    }
})