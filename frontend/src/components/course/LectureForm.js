import React, { useState } from 'react';
import API from '../../utils/API';
import $ from 'jquery';

function LectureForm(props) {
    const toLocalDateTimeString = (date) => {
        function reformat(x) {
            return x < 10 ? `0${x}` : x
        }

        const year = date.getFullYear();
        const month = reformat(date.getMonth() + 1);
        const day = reformat(date.getDate());
        const hour = reformat(date.getHours());
        const minute = reformat(date.getMinutes());

        return `${year}-${month}-${day}T${hour}:${minute}`;
    };

    const initialState = {
        title: props.lecture ? props.lecture.title : "",
        description: props.lecture ? props.lecture.description : "",
        date: props.lecture ? toLocalDateTimeString(new Date(props.lecture.date)) : undefined,
        length: props.lecture ? props.lecture.length : 0
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

        if (!data.date || new Date(data.date) <= new Date()) {
            setError("Invalid Date for Future Lecture");
            return;
        }
 
        data.date = new Date(data.date).toISOString().substring(0, 16);

        if (props.lecture) {
            API.editLecture(props.lecture._id, data)
                .then(function (response) {
                    // handle success
                    console.log(response.data);
                })
                .catch(function (error) {
                    // handle error
                    setError(error.response.data);
                });
        } else {
            API.createLecture(props.course._id, data)
                .then(function (response) {
                    // handle success
                    console.log(response.data);
                })
                .catch(function (error) {
                    // handle error
                    setError(error.response.data);
                });
        }

        $(`#${props.id || "lectureForm"}`).modal('hide');
        props.rerender();
    }

    return (
        <div className="modal fade" id={props.id || "lectureForm"} tabIndex="-1" role="dialog" aria-labelledby="lectureFormTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title font-weight-bold" id="lectureFormTitle">{props.lecture ? `EDIT "${props.lecture.title}"` : "CREATE A LECTURE"}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form id="lecture-form" className="d-flex flex-column" onSubmit={handleSubmit}>
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
                        <label htmlFor="date">Date</label>
                        <input required type="datetime-local" className="form-control" name="date" id="date" value={data.date} min={new Date().toISOString().substring(0, 16)} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="length">Length</label>
                        <input required type="number" className="form-control" name="length" id="length" value={data.length} min="1" max="360" onChange={handleInputChange} />
                        <small id="lengthHelp" className="form-text text-muted">Max 360 minutes (6 hours)</small>
                    </div>
                    </div>
                    {error &&
                    <div class="alert alert-danger mx-3" role="alert">
                        {error}
                    </div>}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="submit" className="btn btn-primary">{props.lecture ? "Edit Lecture" : "Create Lecture"}</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LectureForm;