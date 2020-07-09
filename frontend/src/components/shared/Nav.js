import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import gravatar from 'gravatar';
import masterfulText from "../../assets/images/masterful-text.svg";
import { AuthContext } from '../../context/auth';


function Nav(props) {
    const { state, dispatch } = useContext(AuthContext);

    const toggleLearner = props.toggle === "learner";
    const toggleMaster = props.toggle === "master";

    const logOut = function () {
        dispatch({ type: "LOGOUT" });
        return <Redirect to='/' />;
    }

    return (
        <nav className="p-5 border-right shadow">
            <div className="icon w-100 text-center">
                <Link to='/'>
                    <img src={masterfulText} alt="MASTERFUL" />
                </Link>
            </div>
            <div className="user mt-5 text-center">
                <Link to={`/users/${state.user._id}`}>
                    <img src={state.user.profilePicture || "https://picsum.photos/350?random=" + state.user._id || gravatar.url(state.user.email, { protocol: 'https' })} alt={state.user.firstName + " " + state.user.lastName} className="rounded-circle" />
                    <h3 className="mt-3 font-weight-bold">{state.user.firstName + " " + state.user.lastName}</h3>
                </Link>
            </div>
            <div className="nav-links mt-5">
                {!toggleMaster &&
                    <Link to='/master' className="dropdown-item h4 text-center">
                        MASTER DASHBOARD
                    </Link>
                }
                {!toggleLearner &&
                    <Link to='/dashboard' className="dropdown-item h4 text-center">
                        LEARNER DASHBOARD
                    </Link>
                }
                <a className="dropdown-item h4 text-center" onClick={logOut}>LOG OUT</a>

            </div>
        </nav>
    );
}

export default Nav;