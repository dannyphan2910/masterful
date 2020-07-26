import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import pageTitle from '../assets/images/masterful-icon.svg';
import illustrationLearner from '../assets/images/illus_learner.svg';
import illustrationMaster from '../assets/images/illus_master.svg';
import appstore from '../assets/images/app_store_icon.svg';
import googleplaystore from '../assets/images/google_play_icon.png';
import { AuthContext } from '../context/auth';

function Home() {
    const { state } = useContext(AuthContext);

    return (
        <>
            <Header />
            <div className="container">
                <div className="intro-learner">
                    <div className="content">
                        <p>At <b>Masterful</b>, we believe in the beauty of learning,
                        and that is also how <b>Masterful</b> came into existence.
                        Learners are given countless options to gain
                        experience through video conferencing with
                        masters. This format encourages immediate
                        response to inquiries and feedbacks, and thus
                        boosts the effectiveness of the learning experience.</p>
                        <Link to={state.isLoggedIn ? "/dashboard" : "/login"}>
                            <button className="btn-start">BECOME A LEARNER</button>
                        </Link>
                    </div>
                    <div className="illus">
                        <img className="illus-img" src={illustrationLearner} alt="LEARNER" />
                    </div>
                </div>
                <div className="intro-master">
                    <div className="illus">
                        <img className="illus-img" src={illustrationMaster} alt="MASTER" />
                    </div>
                    <div className="content">
                        <p>Learning does not end in classroom environments. Virtual learning has been on the rise,
                        and masters are given the opportunity to spread their knowledge to the public at <b>Masterful</b>.
                        From restricting attendance to holding live class session with students, masters are given
                        similar control over their course just like an in-person classroom setting. Masters can choose
                        to hold the class free-of-charge, donation-based, or fixed-priced. To ensure a perfect experience
                        for both masters and learners, <b>Masterful</b> will conduct screening for lecture materials and relevant
                        credentials before the class is in session. </p>
                        <Link to={state.isLoggedIn ? "/master" : "/login"}>
                            <button className="btn-start">BECOME A MASTER</button>
                        </Link>
                    </div>
                </div>
                <div className="vw-100 mobile-store">
                    <div className="mobile-store-icons">
                        <img className="appstore-icon" src={appstore} alt="app store" />
                        <img className="googleplaystore-icon" src={googleplaystore} alt="google play" />
                    </div>
                </div>
            </div>
        </>
    );
}

function Header() {
    const { state, dispatch } = useContext(AuthContext);
     

    const logOut = function() {
        dispatch({ type: "LOGOUT" }); 
    }

    return (
        <div className="header">
            <img className="header-icon" src={pageTitle} alt="MASTERFUL" />
            {!state.isLoggedIn &&
                <Link to="/login">
                    <h1 className="welcome-text">Sign In</h1>
                </Link>
            }
            {state.isLoggedIn &&
                    <div className="dropdown show">
                        <a className="dropdown-toggle" role="button" data-toggle="dropdown">
                            <span className="h1 welcome-text-loggedin">Hi, {state.user.firstName}</span>
                        </a>
                        <div className="dropdown-menu">
                            <Link to="/dashboard" className="dropdown-item">
                                DASHBOARD <span role="img" aria-label="dashboard-icon">📊</span>
                            </Link>
                            <Link to="/master" className="dropdown-item">
                                MASTER <span role="img" aria-label="master-icon">🤓</span>
                            </Link>
                            <a className="dropdown-item" onClick={logOut}>LOG OUT</a>         
                        </div>
                    </div>
            }
        </div>
    );
}

export default Home;