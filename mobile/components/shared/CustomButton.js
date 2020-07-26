import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

function CustomButton(props) {
    const { title = 'Enter', style = {}, textStyle = {}, onPress } = props;

    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={[styles.text, textStyle]}>{props.title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        display: 'flex',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#1A535C',
    },
    text: {
        fontSize: 16,
        textTransform: 'uppercase',
        color: '#FFFFFF',
    },
});

export default CustomButton;
