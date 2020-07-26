import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';

export default function Loading() {
    return (
        <View style={styles.fixed}>
            <ActivityIndicator size="large" color="#2EC4B6" />
        </View>
    );
}

const styles = StyleSheet.create({
    fixed: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: Dimensions.get('window').height,
        justifyContent: "center"
    },
})