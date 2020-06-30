import React, { useState, useEffect } from 'react';
import '../info-modal/info-modal.component.scss';
import Loader from '../../custom/loader/loader.component';
import { Modal, Button } from 'reactstrap';
import { toast } from 'react-toastify';
import { post } from '../../utilities/HttpUtility';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const SuggestionModal = (props) => {
    const [modalLive, setModalLive] = useState(false);
    const [missedSuggestion, setMissedSuggestion] = useState({});
    const [suggestionSubmitting, setSuggestionSubmitting] = useState(false);


    useEffect(() => {
        setModalLive(props.modalLive);
        setMissedSuggestion(props.missedSuggestion)
    }, [props.modalLive, props.missedSuggestion]);

    function suggestionSubmit() {
        setSuggestionSubmitting(true);
        let data = { product: missedSuggestion }
        post(`api/product/addSuggestion`, data)
            .then(
                () => {
                    setSuggestionSubmitting(false);
                    props.clearSearchInput();
                    props.setModalLive(false);
                    toast.success("Thanks for your submission!");
                },
                () => {
                    toast.error("An error occoured!");
                    setSuggestionSubmitting(false);
                }
            )
    }

    return <Modal toggle={() => props.setModalLive(false)} isOpen={modalLive} backdropClassName="item-info-modal-backdrop">
        <div className="modal-header">
            <h5 className="modal-title">New Suggestion</h5>
            <FontAwesomeIcon icon={faTimes} className="pointer" onClick={() => props.setModalLive(false)} />
        </div>
        <div className="modal-body">
            Do you wish to submit {missedSuggestion}?
            <div className="text-center">
                <Button color="primary" onClick={suggestionSubmit} disabled={suggestionSubmitting}>
                    {suggestionSubmitting ? <Loader /> : "Submit"}
                </Button>
            </div>
        </div>
    </Modal>
}


export default SuggestionModal;
