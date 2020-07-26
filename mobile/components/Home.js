import React, { useContext } from 'react';
import { View, StyleSheet, ImageBackground, Text, Image, Button, SafeAreaView } from 'react-native';
import backgroundHome from '../assets/images/background_home.png'
import CustomButton from './shared/CustomButton';
import { AuthContext } from '../context/auth';
import MasterfulText from '../assets/images/masterful-text.svg';

function Home({ navigation }) {
    const { state } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <ImageBackground source={backgroundHome} style={styles.backgroundImage}>
                <Text style={styles.textWelcome}>Welcome To</Text> 
                <MasterfulText style={{ marginBottom: 10 }} />
                {state.isLoggedIn && 
                    <View>
                        <CustomButton title="Learner Dashboard" style={styles.buttonDashboard} textStyle={styles.buttonTextDashboard} onPress={() => navigation.navigate('Learner Dashboard')}/>
                        <CustomButton title="Master Dashboard" style={styles.buttonDashboard} textStyle={styles.buttonTextDashboard} onPress={() => navigation.navigate('Master Dashboard')}/>
                    </View>
                }
                {!state.isLoggedIn &&
                    <CustomButton title="Get Started" style={styles.buttonSignIn} textStyle={styles.buttonTextSignIn} onPress={() => navigation.navigate('Login')}/>
                }
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        height: '100%'
    },
    textWelcome: {
        fontSize: 30,
        fontWeight: '800',
        letterSpacing: 2,
        color: "#2EC4B6"
    },
    buttonSignIn: {
        marginTop: 20,
        backgroundColor: "#1A535C",
        width: "50%"
    },
    buttonTextSignIn: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 20
    },
    buttonDashboard: {
        marginTop: 20,
        backgroundColor: "#1A535C",
        paddingLeft: 10,
        paddingRight: 10
    }, 
    buttonTextDashboard: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 20
    }
})

export default Home;