import React, { useState, useEffect, useContext } from 'react';
import Nav from './shared/Nav';
import API from '../utils/API';
import { AuthContext } from '../context/auth';
import Loading from './shared/Loading';
import CourseRow from './shared/CourseRow';
import { Link } from 'react-router-dom';

function LearnerDashboard() {
    const { state } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [inProgress, setInProgress] = useState([]);
    const [sugggested, setSuggested] = useState([]);
    const [streaming, setStreaming] = useState([]);
    const [trending, setTrending] = useState([]);
    const [result, setResult] = useState([]);

    useEffect(() => {
        const numCourses = 6;

        API.getCoursesMeta(state.user._id, numCourses)
            .then(function (response) {
                // handle success
                const data = response.data;
                setInProgress(data.progress);
                setSuggested(data.suggested);
                setStreaming(data.streaming);
                setTrending(data.trending);
                setLoading(false);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }, []);


    const handleSearch = function (event) {
        const newKeyword = event.target.value;
        setKeyword(newKeyword);
        if (newKeyword.length > 0) {
            setLoading(true);

            if (newKeyword.length > 1) {
                API.searchCourses(newKeyword)
                    .then(function (response) {
                        // handle success
                        const data = response.data;
                        setLoading(false);
                        setResult(data);
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });
            }
        } else {
            setLoading(false);
        }
    }

    return (
        <div className="learner-dashboard d-flex">
            <Nav toggle="learner" />
            <div className="course-info p-5 overflow-auto w-75">
                <div className="search-bar mt-3 w-100">
                    <div className="input-group">
                        <input type="text" className="form-control" value={keyword} onChange={handleSearch} placeholder="What would you like to learn today?..." aria-label="Recipient's username" aria-describedby="button-addon" />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button" id="button-addon">SEARCH</button>
                        </div>
                    </div>
                </div>
                <div className="mt-3 courses" id="courses">
                    {keyword === "" && !loading &&
                        <>
                            <CourseRow title="In Progress" courses={inProgress} />
                            <CourseRow title="Suggested For You" courses={sugggested} />
                            <CourseRow title="Streaming Now" courses={streaming} />
                            <CourseRow title="Trending Now" courses={trending} />
                        </>
                    }
                    {keyword !== "" && !loading && <SearchResult keyword={keyword} result={result} />}
                    {loading && <Loading />}
                </div>

            </div>
        </div>
    );
}

function SearchResult(props) {
    return (
        <div className="w-100">
            <h4>{props.result.length} results for "{props.keyword}"</h4>
            <ul className="list-group mt-2">
                {props.result.map(course => <SearchResultItem course={course} />)}
            </ul>
        </div>
    );
}

function SearchResultItem(props) {
    return (
        <Link to={`/courses/${props.course._id}`}>
            <li className="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <div className="result-info d-flex align-items-center">
                    <img src={"https://picsum.photos/350?random=" + props.course._id} alt="course image" className="result-img mr-3" />
                    <h4>{props.course.title}</h4>
                </div>
                <small>{props.course.learners.length} enrolled</small>
            </li>
        </Link>
    );
}

export default LearnerDashboard;