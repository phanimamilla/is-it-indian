import React, { useState, useRef, useEffect } from 'react';
import './info-modal.component.scss';
import Loader from '../../custom/loader/loader.component';
import { Modal, Input, Button } from 'reactstrap';
import { toast } from 'react-toastify';
import { post } from '../../utilities/HttpUtility';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


const InfoModal = (props) => {
    const alternateInput = useRef(null);
    const [modalLive, setModalLive] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState({});
    const [alternateTerm, setAlternateTerm] = useState('');
    const [AlternateSubmitting, setAlternateSubmitting] = useState(false);


    useEffect(() => {
        setModalLive(props.modalLive);
        setSelectedSuggestion(props.selectedSuggestion)
    }, [props.modalLive, props.selectedSuggestion]);

    function alternateSubmit() {
        setAlternateSubmitting(true);
        let data = { product: selectedSuggestion.product, alternate: alternateTerm }
        post(`api/product/addAlternate`, data)
            .then(
                () => {
                    toast.success("Thanks for your submission!");
                    setAlternateTerm('');
                    setAlternateSubmitting(false);
                },
                () => {
                    toast.error("An error occoured!");
                    setAlternateSubmitting(false);
                }
            )
    }

    return <Modal toggle={() => props.setModalLive(false)} isOpen={modalLive} backdropClassName="item-info-modal-backdrop">
        <div className="modal-header">
            <h5 className="modal-title">{selectedSuggestion.product}</h5>
            <FontAwesomeIcon icon={faTimes} className="pointer" onClick={() => props.setModalLive(false)} />
        </div>
        <div className="modal-body">
            {
                selectedSuggestion.isIndian &&
                (
                    selectedSuggestion.isCompany ?
                        <div>
                            {selectedSuggestion.product} is an <b className="text-success">Indian</b> company.
            </div>
                        : <div>
                            {selectedSuggestion.product} is by an <b className="text-success">Indian</b> company {selectedSuggestion.parent !== null && selectedSuggestion.parent}
                        </div>
                )
            }

            {
                selectedSuggestion.isIndianSubsidary &&
                (
                    selectedSuggestion.isCompany ?
                        <div>
                            {selectedSuggestion.product} is an <b>Indian subsidiary</b> company.
              </div>
                        : <div>
                            {selectedSuggestion.product} is by {selectedSuggestion.parent !== null ? selectedSuggestion.parent + "'s" : "an"} <b> Indian subsidiary</b> company.
              </div>
                )
            }
            {
                selectedSuggestion.isForeign &&
                <div>
                    {
                        selectedSuggestion.isCompany ?
                            <div>
                                {selectedSuggestion.product} is a <b className="text-danger">{selectedSuggestion.isChinese ? "chinese" : "foreign"}</b> company.
            </div>
                            : <div>
                                {selectedSuggestion.product} is by a <b className="text-danger">{selectedSuggestion.isChinese ? "chinese" : "foreign"}</b> company {selectedSuggestion.parent !== null && selectedSuggestion.parent}
                            </div>
                    }
                    {
                        selectedSuggestion.alternates !== null &&
                        <div className="text-info">
                            <hr />
                            <b className="text-light">Alternates:</b> {selectedSuggestion.alternates}
                        </div>
                    }
                    <br />
                    <label htmlFor="alternate-input">Suggest an alternate</label>
                    <Input className="form-control-lg" placeholder="Alternative" type="text" autoComplete="off"
                        id="alternate-input" value={alternateTerm} ref={alternateInput} disabled={AlternateSubmitting}
                        onChange={(e) => setAlternateTerm(e.currentTarget.value)}></Input>
                    <div className="text-center">
                        <Button color="primary" onClick={alternateSubmit} disabled={AlternateSubmitting}>
                            {AlternateSubmitting ? <Loader /> : "Submit"}
                        </Button>
                    </div>
                </div>
            }
        </div>
    </Modal>
}


export default InfoModal;
