import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import API from '../../utils/API';
import { AuthContext } from '../../context/auth';

function Login(props) {
    const { state, dispatch } = useContext(AuthContext);

    const initialState = {
        email: "",
        password: ""
    };
    const [data, setData] = useState(initialState);
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = event => {
        event.preventDefault();

        API.login(data)
            .then(function (response) {
            document.getElementById("login-form").reset();
            // handle success
            dispatch({
                type: "LOGIN",
                payload: response.data
            });
            setRedirect(true);
          })
          .catch(function (error) {
            // handle error
            setError(error.response.data);
          })
    }

    if (redirect || state.isLoggedIn) {
        return <Redirect to={props.history.location.state ? props.history.location.state.from.pathname : '/dashboard'} />
    }

    return (
        <div className="wrapper position-relative">
        {error && <div className="alert alert-danger text-center" role="alert">
            {error}
        </div>}
        <div className="container-fluid m-0 p-0 vh-100 d-flex justify-content-center align-items-center position-absolute" style={{top: 0, left: 0}}>
            <form id="login-form" className="w-25 d-flex flex-column" onSubmit={handleSubmit}>
            <h1 className="text-center mb-4 font-weight-bold">SIGN IN</h1>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input required type="email" className="form-control" name="email" id="email" value={data.email} onChange={handleInputChange} />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input required minLength="6" maxLength="10" type="password" className="form-control" name="password" id="password" value={data.password} onChange={handleInputChange} />
            </div>

            <button type="submit" className="btn btn-success">Submit</button>

            <div className="dropdown-divider"></div>

            <Link to="/register">
                <p className="text-muted">Create an Account</p>
            </Link>
            <Link to="/">
                <p className="text-muted">Back to Home</p>
            </Link>
        </form>
        </div>
        </div>
    );
}

export default Login;