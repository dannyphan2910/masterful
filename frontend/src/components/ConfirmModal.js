import React, { useState } from 'react';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';

function ConfirmModal(props) {
    const [redirect, setRedirect] = useState(false);

    const handleSubmit = () => {
        props.handleSubmit();
        $(`#${props.id}`).modal('hide');
        if (props.rerender) {
            props.rerender();
        } else {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Redirect to={props.redirectRoute} />
    }

    return (
        <div className="modal" role="dialog" id={props.id}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title font-weight-bold">{props.title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>{props.description}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;