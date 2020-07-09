import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import API from '../../utils/API';
import { AuthContext } from '../../context/auth';

function Register() {
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

    const handleInputChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (data.password !== data.passwordConfirmation) {
            document.getElementById("password-confirmation").classList.remove("is-valid");
            if (document.getElementById("password-confirmation").classList.contains("is-invalid")) document.getElementById("password-confirmation").classList.add("is-invalid");
            setData({
                ...data,
                password: "",
                passwordConfirmation: ""
            });
            return;
        }

        var newUser = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password
        }

        API.registerUser(newUser)
            .then(function (response) {
                document.getElementById("register-form").reset();
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

    if (state.isLoggedIn) {
        return <Redirect to="/dashboard" />;
    }

    return (
        <div className="wrapper position-relative">
            {error && <div className="alert alert-danger text-center" role="alert">
                {error}
            </div>}
            <div className="container-fluid m-0 p-0 vh-100 d-flex justify-content-center align-items-center position-absolute" style={{ top: 0, left: 0 }}>
                <form id="register-form" className="w-50 d-flex flex-column" onSubmit={handleSubmit}>
                    <h1 className="text-center mb-4 font-weight-bold">CREATE AN ACCOUNT</h1>

                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input required type="text" className="form-control" name="firstName" id="firstName" value={data.firstName} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input required type="text" className="form-control" name="lastName" id="lastName" value={data.lastName} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input required type="email" className="form-control" name="email" id="email" value={data.email} onChange={handleInputChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input required minLength="6" maxLength="10" type="password" className="form-control" name="password" id="password" value={data.password} onChange={handleInputChange} />
                        <small id="passwordHelp" className="form-text text-muted">Password must be between 6 to 10 characters</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password-confirmation">Re-enter Password</label>
                        <input required type="password" className="form-control" name="passwordConfirmation" id="password-confirmation" value={data.passwordConfirmation} onChange={handleInputChange} />
                    </div>

                    <button type="submit" className="btn btn-warning">SUBMIT</button>

                    <div className="dropdown-divider"></div>

                    <Link to="/login">
                        <p className="text-muted">Already have an account?</p>
                    </Link>
                    <Link to="/">
                        <p className="text-muted">Back to Home</p>
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Register;