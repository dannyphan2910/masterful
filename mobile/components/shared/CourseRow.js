import React from 'react';
import LiveIcon from '../../assets/images/live-icon.svg';
import { Text, ScrollView, View, StyleSheet, Image } from 'react-native';
import { Row, H1, Card, CardItem, H3, Subtitle, H2, Button } from 'native-base';

export default function CourseRow(props) {
    return (
        <View style={{ minWidth: '100%', margin: 20 }}>
            <Row style={{ width: '100%', alignItems: 'center' }}>
                <H1 style={{ fontWeight: 'bold', color: '#1A535C', marginBottom: 20 }}>{props.title}</H1>
                {props.title.split(" ")[0].toLowerCase() === 'streaming' && <LiveIcon />}
            </Row>
            <ScrollView horizontal>
                {props.courses.map(course => <CourseCard course={course} key={course._id} navigate={props.navigate} />)}
            </ScrollView>
        </View>
    );
}

function CourseCard(props) {
    return (
        <Button style={{ height: '100%', marginRight: 20 }} transparent onPress={() => props.navigate(props.course._id)}>
            <Card style={[styles.card, styles.shadow]}>
                <CardItem cardBody>
                    <Image source={{ uri: "https://picsum.photos/350?random=" + props.course._id }} style={styles.cardImage} />
                </CardItem>
                <CardItem>
                    <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{props.course.title.substring(0, 35) + (props.course.title.length >= 35 ? '...' : '')}</Text>
                </CardItem>
                <CardItem>
                    <Subtitle style={styles.textMuted}>{props.course.learners.length} enrolled</Subtitle>
                </CardItem>
            </Card>
        </Button>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 200,
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
        color: 'gray'
    }
})