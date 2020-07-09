import React, { useContext, useState } from 'react';
import API from '../../utils/API';
import $ from 'jquery';
import { AuthContext } from '../../context/auth';

export default function CourseForm(props) {
    const { state } = useContext(AuthContext);

    console.log(props.course);

    const initialState = {
        title: props.course ? props.course.title : "",
        description: props.course ? props.course.description : "",
        courseLength: props.course ? props.course.courseLength : 0
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

        if (props.course) {
            API.editCourse(props.course._id, data)
                .then(function (response) {
                    // handle success
                    console.log(response.data);
                })
                .catch(function (error) {
                    // handle error
                    setError(error.response.data);
                });
        } else {
            API.createCourse(state.user._id, data)
                .then(function (response) {
                    // handle success
                    console.log(response.data);
                })
                .catch(function (error) {
                    // handle error
                    setError(error.response.data);
                });
        }

        $(`#${props.id || "courseForm"}`).modal('hide');
        props.rerender();
    }

    return (
        <div className="modal fade" id={props.id || "courseForm"} tabIndex="-1" role="dialog" aria-labelledby="courseFormTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="courseFormTitle">{props.course ? `EDIT "${props.course.title}"` : "CREATE A COURSE"}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form id="course-form" className="d-flex flex-column" onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input required type="text" className="form-control" name="title" id="title" value={data.title} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea required maxLength="200" className="form-control" name="description" id="description" value={data.description} onChange={handleInputChange} />
                                <small id="descriptionHelp" className="form-text text-muted">Max 200 characters</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="courseLength">Length</label>
                                <input required type="number" className="form-control" name="courseLength" id="courseLength" value={data.courseLength} min="1" onChange={handleInputChange} />
                                <small id="lengthHelp" className="form-text text-muted">Duration in months</small>
                            </div>
                        </div>
                        {error &&
                            <div class="alert alert-danger mx-3" role="alert">
                                {error}
                            </div>}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="submit" className="btn btn-primary">{props.course ? "Edit Course" : "Create Course"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}