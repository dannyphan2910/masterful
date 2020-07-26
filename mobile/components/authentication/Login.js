import React, { useState, useContext } from 'react';
import API from '../../utils/API';
import { AuthContext } from '../../context/auth';
import { View, StyleSheet, Text } from 'react-native';
import { Item, Input, H2, Button } from 'native-base';
import CustomButton from '../shared/CustomButton';
import Loading from '../shared/Loading';

function Login({ navigation }) {
    const { state, dispatch } = useContext(AuthContext);

    const initialState = {
        email: "",
        password: ""
    };
    const [data, setData] = useState(initialState);
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (name, value) => {
        setData({
            ...data,
            [name]: value
        });
    };

    const handleSubmit = event => {
        event.preventDefault();

        setSubmitted(true);

        API.login(data)
            .then(function (response) {
                // handle success
                dispatch({
                    type: "LOGIN",
                    payload: response.data
                });
                navigation.navigate('Learner Dashboard');
            })
            .catch(function (error) {
                 
                // handle error
                setError(error.response.data);
            })
    }

    if (submitted) {
        return (
            <View style={styles.background}>
                <Loading />
            </View>
        );
    }

    return (
        <View style={styles.background}>
            <H2 style={styles.title}>SIGN IN</H2>
            <Item regular style={{ marginBottom: 20 }}>
                <Input placeholder="Email" keyboardType="email-address" onChangeText={(text) => handleInputChange("email", text)} />
            </Item>
            <Item regular>
                <Input placeholder="Password" maxLength={10} secureTextEntry={true} onChangeText={(text) => handleInputChange("password", text)} />
            </Item>
            <CustomButton title="Sign In" style={styles.buttonSignIn} textStyle={styles.buttonTextSignIn} onPress={handleSubmit} />
            <Button transparent hasText onPress={() => navigation.navigate('Register')} style={{ padding: 0 }}>
                <Text style={{color: '#1E90FF'}}>Don't have an account?</Text>
            </Button>
            <Button transparent hasText onPress={() => navigation.navigate('Home')} style={{ padding: 0 }}>
                <Text style={{color: '#1E90FF'}}>Back to Home</Text>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#fffffc",
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: 40
    },
    buttonSignIn: {
        marginTop: 20,
        backgroundColor: "#2EC4B6",
        width: "50%"
    },
    buttonTextSignIn: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 20
    },
    title: {
        fontWeight: 'bold', 
        marginBottom: 20, 
        color: '#1A535C'
    }
})

export default Login;