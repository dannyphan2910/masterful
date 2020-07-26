import { createContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export const AuthContext = createContext();

export const initialState = {
	isLoggedIn: false,
	user: null
};

export const reducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
             
			const saveItem = async () => {
				await AsyncStorage.setItem("user", JSON.stringify(action.payload));
			}

			saveItem();

			return {
				...state,
				isLoggedIn: true,
				user: action.payload
			};
		case "LOGOUT":
			AsyncStorage.clear();
			return {
				...state,
				isLoggedIn: false,
				user: null
			};
		default:
			return state;
	}
};
