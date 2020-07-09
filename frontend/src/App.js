import React, { useReducer, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from "react-router-dom";

import Home from './components/Home';
import Login from './components/authentication/Login';
import Register from './components/authentication/Register';
import LearnerDashboard from './components/LearnerDashboard';
import MasterDashboard from './components/MasterDashboard';
import PrivateRoute from './components/PrivateRoute';
import CoursePage from './components/course/CoursePage';
import Conference from './components/course/Conference';
import Profile from './components/course/Profile';

import './App.css';
import { AuthContext, initialState, reducer } from './context/auth';

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user'))

		if (user) {
		  dispatch({
			type: 'LOGIN',
			payload: user
		  })
		}
	}, []);

	return (
		<AuthContext.Provider value={{state, dispatch}}>
			<Router>
				<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/login" exact component={Login} />
				<Route path="/register" exact component={Register} />
				<PrivateRoute path="/master" exact component={MasterDashboard} />
				<PrivateRoute path="/dashboard" exact component={LearnerDashboard} />
				<PrivateRoute path="/courses/:id" exact component={CoursePage} />
				<PrivateRoute path="/courses/:id/lectures/:lectureId" exact component={Conference} />
				<PrivateRoute path="/users/:id" exact component={Profile} />
				</Switch>
			</Router>
		</AuthContext.Provider>
	);
}

export default App;
