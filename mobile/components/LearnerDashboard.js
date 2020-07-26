import React, { useContext, useState, useEffect } from 'react'
import { ScrollView, Text, View, StyleSheet, Image, ActivityIndicator, ImageBackground, StatusBar, Dimensions, Platform } from 'react-native';
import { AuthContext } from '../context/auth';
import API from '../utils/API';
import MasterfulIcon from '../assets/images/masterful-logo.svg';
import ProfileIcon from '../assets/images/profile-icon.svg';
import SearchIcon from '../assets/images/search-icon.svg';
import { Item, Row, Input, Button, Card, CardItem, Icon } from 'native-base';
import Loading from './shared/Loading';
import CourseRow from './shared/CourseRow';

function LearnerDashboard({ navigation }) {
    const { state } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [inProgress, setInProgress] = useState([]);
    const [sugggested, setSuggested] = useState([]);
    const [streaming, setStreaming] = useState([]);
    const [trending, setTrending] = useState([]);
    const [result, setResult] = useState([]);

    useEffect(() => {
        const numCourses = 6;

        API.getCoursesMeta(state.user._id, numCourses)
            .then(function (response) {
                // handle success
                const data = response.data;
                setInProgress(data.progress);
                setSuggested(data.suggested);
                setStreaming(data.streaming);
                setTrending(data.trending);
                setLoading(false);
            })
            .catch(function (error) {
                // handle error
            });
    }, []);


    const handleSearch = function (newKeyword) {
        setKeyword(newKeyword);
        if (newKeyword.length > 0) {
            setLoading(true);

            if (newKeyword.length > 1) {
                API.searchCourses(newKeyword)
                    .then(function (response) {
                        // handle success
                        const data = response.data;
                        setLoading(false);
                        setResult(data);
                    })
                    .catch(function (error) {
                        // handle error
                    });
            }
        } else {
            setLoading(false);
        }
    }

    const navigate = (courseId) => {
        navigation.push('Course', { id: courseId })
    }

    const X_WIDTH = 375;
    const X_HEIGHT = 812;

    const XSMAX_WIDTH = 414;
    const XSMAX_HEIGHT = 896;

    const { height, width } = Dimensions.get('window');

    const isIPhoneX = () => Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
        ? width === X_WIDTH && height === X_HEIGHT || width === XSMAX_WIDTH && height === XSMAX_HEIGHT
        : false;

    const StatusBarHeight = Platform.select({
        ios: isIPhoneX() ? 44 : 20,
        android: StatusBar.currentHeight,
        default: 0
    })

    return (
        <ScrollView style={{ backgroundColor: '#fffffc', marginTop: -StatusBarHeight }}>
            <Row style={styles.nav}>
                <MasterfulIcon />
                <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <Button icon transparent onPress={() => navigation.navigate('Home')}>
                        <Icon name="home" type="FontAwesome5" style={styles.homeIcon} />
                    </Button>
                    <Button transparent onPress={() => navigation.push('Profile', { id: state.user._id })} >
                        <ProfileIcon style={{ marginRight: 15 }} />
                    </Button>
                </View>
            </Row>
            <Row>
                <Item rounded style={{ width: '80%', alignSelf: 'center', marginLeft: 10 }}>
                    <Input placeholder="Meaning to learn something?" onChangeText={(text) => handleSearch(text)} />
                </Item>
                <Button transparent style={{ width: '20%', alignSelf: 'center', marginLeft: 10 }}>
                    <SearchIcon />
                </Button>
            </Row>
            <View>
                {keyword === "" && !loading &&
                    <>
                        <CourseRow title="In Progress" courses={inProgress} navigate={navigate} />
                        <CourseRow title="Suggested For You" courses={sugggested} navigate={navigate} />
                        <CourseRow title="Streaming Now" courses={streaming} navigate={navigate} />
                        <CourseRow title="Trending Now" courses={trending} navigate={navigate} />
                    </>
                }
                {keyword !== "" && !loading && <SearchResult keyword={keyword} result={result} navigate={navigate} />}
            </View>
            {loading && <Loading />}
        </ScrollView>
    );
}


function SearchResult(props) {
    return (
        <ScrollView style={{ padding: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>{props.result.length} results for "{props.keyword}"</Text>
            <View>
                {props.result.map(course => <SearchResultItem course={course} key={course._id} navigate={props.navigate} />)}
            </View>
        </ScrollView>
    );
}

function SearchResultItem(props) {
    return (
        <Button style={{ height: 100 }} transparent onPress={() => props.navigate(props.course._id)}>
            <Card style={{ width: '100%' }}>
                <Row style={{ width: '100%', alignItems: 'center' }}>
                    <CardItem cardBody>
                        <Image source={{ uri: "https://picsum.photos/350?random=" + props.course._id }} style={styles.searchImage} />
                    </CardItem>
                    <CardItem style={styles.textContainer}>
                        <Text style={{ fontWeight: 'bold' }}>{props.course.title}</Text>
                        <Text style={styles.textMuted}>{props.course.learners.length} enrolled</Text>
                    </CardItem>
                </Row>
            </Card>
        </Button>
    );
}

const styles = StyleSheet.create({
    nav: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchImage: {
        height: '100%',
        aspectRatio: 1
    },
    textMuted: {
        fontSize: 10,
        color: 'gray'
    },
    textContainer: {
        width: 0,
        flexGrow: 1,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    homeIcon: {
        color: "#1A535C",
        fontSize: 25
    }
});

export default LearnerDashboard;