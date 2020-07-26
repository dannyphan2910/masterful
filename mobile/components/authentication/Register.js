import React, { useState, useContext } from 'react';
import API from '../../utils/API';
import { AuthContext } from '../../context/auth';
import { Item, Input, H2, Button } from 'native-base';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import CustomButton from '../shared/CustomButton';
import Loading from '../shared/Loading';

function Register({ navigation }) {
    const { state, dispatch } = useContext(AuthContext);

    const initialState = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: ""
    };
    const [data, setData] = useState(initialState);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    if (state.isLoggedIn) {
        navigation.navigate('Learner Dashboard');
        return null;
    }

    const handleInputChange = (name, value) => {
        setData({
            ...data,
            name: value
        });
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (data.password !== data.passwordConfirmation) {
            setData({
                ...data,
                password: "",
                passwordConfirmation: ""
            });
            return;
        }

        setSubmitted(true);

        var newUser = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password
        }

        API.registerUser(newUser)
            .then(function (response) {
                // handle success
                dispatch({
                    type: "LOGIN",
                    payload: response.data
                })
            })
            .catch(function (error) {
                // handle error
                setError(error.response.data);
            })
    };

    if (submitted) {
        return (
            <View style={[styles.background, styles.backgroundCenter]}>
                <Loading />
            </View>
        );
    }

    return (
        <ScrollView style={styles.background} contentContainerStyle={styles.backgroundCenter}>
            <H2 style={styles.title}>BECOME MASTERFUL</H2>
            <Item regular style={{ marginBottom: 20 }}>
                <Input placeholder="First Name" onChangeText={(text) => handleInputChange("firstName", text)} />
            </Item>
            <Item regular style={{ marginBottom: 20 }}>
                <Input placeholder="Last Name" onChangeText={(text) => handleInputChange("lastName", text)} />
            </Item>
            <Item regular style={{ marginBottom: 20 }}>
                <Input placeholder="Email" keyboardType="email-address" onChangeText={(text) => handleInputChange("email", text)} />
            </Item>
            <Item regular style={{ marginBottom: 20 }}>
                <Input placeholder="Password" maxLength={10} secureTextEntry={true} onChangeText={(text) => handleInputChange("password", text)} />
            </Item>
            <Item regular>
                <Input placeholder="Password Confirmation" maxLength={10} secureTextEntry={true} onChangeText={(text) => handleInputChange("passwordConfirmation", text)} />
            </Item>
            <CustomButton title="Create An Account" style={styles.buttonSignIn} textStyle={styles.buttonTextSignIn} onPress={handleSubmit} />
            <Button transparent hasText onPress={() => navigation.navigate('Login')} style={{ padding: 0 }}>
                <Text style={{color: '#1E90FF'}}>Already have an account?</Text>
            </Button>
            <Button transparent hasText onPress={() => navigation.navigate('Home')} style={{ marginBottom: 50, padding: 0 }}>
                <Text style={{color: '#1E90FF'}}>Back to Home</Text>
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#fffffc",
        height: '100%',
        padding: 40
    },
    backgroundCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonSignIn: {
        marginTop: 20,
        backgroundColor: "#e9c46a",
        width: "85%"
    },
    buttonTextSignIn: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 20,
        textAlign: 'center'
    },
    title: {
        fontWeight: 'bold', 
        marginBottom: 20, 
        color: '#1A535C',
        textAlign: 'center'
    }
})

export default Register;