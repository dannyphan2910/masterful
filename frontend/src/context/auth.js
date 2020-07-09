import { createContext } from 'react';

export const AuthContext = createContext();

export const initialState = {
	isLoggedIn: false,
	user: null
};

export const reducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
            console.log(action.payload);
			localStorage.setItem("user", JSON.stringify(action.payload));

			return {
				...state,
				isLoggedIn: true,
				user: action.payload
			};
		case "LOGOUT":
			localStorage.clear();
			return {
				...state,
				isLoggedIn: false,
				user: null
			};
		default:
			return state;
	}
};
