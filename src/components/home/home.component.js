import React, { useState, useRef, useEffect } from 'react';
import './home.component.dark.scss';
import Loader from '../../custom/loader/loader.component';
import { UncontrolledPopover, PopoverHeader, PopoverBody, Modal, Input, Button } from 'reactstrap';
import { baseUrl } from '../../config';

const Home = (props) => {
  const searchInput = useRef(null);
  const alternateInput = useRef(null);
  const [showSearchClear, setShowSearchClear] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestionLoading, setShowSuggestionLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState();
  const [modalLive, setModalLive] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState({});
  const [alternateTerm, setAlternateTerm] = useState('');
  const [AlternateSubmitting, setAlternateSubmitting] = useState(false);
  const [AlternateSubmitSuccess, setAlternateSubmitSuccess] = useState(false);
  const [AlternateSubmitFail, setAlternateSubmitFail] = useState(false);

  useEffect(() => {
    searchInput.current.focus();
  }, [])

  function onChange(e) {
    clearTimeout(searchTimeout)
    setShowSuggestionLoading(false);
    setSuggestions([]);

    let searchTerm = e.currentTarget.value;
    setSearchTerm(e.currentTarget.value);
    let cleanedSearchTerm = searchTerm.trim();
    if (cleanedSearchTerm && cleanedSearchTerm.length > 0) {
      setShowSearchClear(true);
    }
    else {
      setShowSearchClear(false);
    }
    if (cleanedSearchTerm && cleanedSearchTerm.length < 2) {
    }

    if (cleanedSearchTerm && cleanedSearchTerm.length >= 2) {
      setShowSuggestionLoading(true);
      let timeout = setTimeout(() => {
        fetch(`${baseUrl}api/product/get/${cleanedSearchTerm}`)
          .then(res => res.json())
          .then(
            (result) => {
              setShowSuggestionLoading(false);
              setSuggestions(result);
            },
            (error) => {
              setShowSuggestionLoading(false);
              setSuggestions([]);
            }
          )
      }, 500);
      setSearchTimeout(timeout);
    }
  }

  function clearInputField() {
    setSearchTerm('');
    setShowSearchClear(false);
    setShowSuggestionLoading(false);
    setSuggestions([]);
    searchInput.current.focus();
  }

  function suggestionSelected(suggestion) {
    setAlternateSubmitSuccess(false);
    setAlternateSubmitFail(false);
    setSelectedSuggestion(suggestion);
    setModalLive(true);
    fetch(`${baseUrl}api/product/peeked/${suggestion.product}`);
  }

  function alternateSubmit() {
    setAlternateSubmitSuccess(false);
    setAlternateSubmitFail(false);
    setAlternateSubmitting(true);
    let data = { product: selectedSuggestion.product, alternate: alternateTerm }
    fetch(`${baseUrl}api/product/addAlternate`, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(
        (result) => {
          setAlternateTerm('');
          setAlternateSubmitting(false);
          setAlternateSubmitSuccess(true);
        },
        (error) => {
          setAlternateSubmitFail(true);
          setAlternateSubmitting(false);
        }
      )
  }

  return <div className="w-100 h-100 overflow-auto">
    <div className="container d-flex flex-column align-items-center justify-content-center1 w-100 h-100 main-container">

      <div className="col-9 col-lg-6" style={{ flex: 0 }}>
        <img src={require(`../../assets/img/logo.jpg`)} className="img-fluid" alt="IsItIndian" />
      </div>

      <div className="search-wrapper text-center d-flex flex-row my-3 p-0 col-10 col-lg-6">
        <input type="text" className="flex-grow-1" autoComplete="off" placeholder="Search"
          onChange={onChange} value={searchTerm} ref={searchInput} />

        {showSearchClear && <i className="fa fa-times search-icons" onClick={clearInputField}></i>}

        <div className="divider"></div>
        <i className="fa fa-search search-icons"></i>
        <div className="suggestion-list-wrapper">
          {showSuggestionLoading &&
            <div className="suggestion-loading">
              <Loader />
            </div>
          }
          {
            suggestions.length > 0 &&
            <div className="suggestion-list w-100">
              <ul className="p-0 m-0">
                {
                  suggestions.map((suggestion) => {
                    return <li key={suggestion.product} className="suggetion-list-element" onClick={() => suggestionSelected(suggestion)}>
                      <i className={"mr-1 fa " + (suggestion.isForeign ? "fa-times-circle text-danger" : suggestion.isIndianSubsidary ? "fa-exclamation-circle text-warning" : "fa-check-circle text-success")}></i>
                      <span className="suggetion-list-element-text">{suggestion.product}</span>
                    </li>
                  })
                }
              </ul>
            </div>
          }
          {
            (suggestions.length == 0 && searchTerm.length > 1 && !showSuggestionLoading) &&
            <div className="suggestion-count-zero">No matching results!</div>
          }
        </div>
      </div>

      {/* <div className="w-100">
        <p className="m-0 mb-2 text-center text-light">Browse Categories</p>
        <div className="categories-wrapper d-flex flex-row flex-wrap justify-content-center">
          <div className="category-div">
            <img src={require(`../../assets/img/automobile.png`)} height="40" width="40" alt="automobile" />
            <p className="text-light">Automobile</p>
          </div>
          <div className="category-div">
            <img src={require(`../../assets/img/cosmetics.png`)} height="40" width="40" alt="cosmetics" />
            <p className="text-light">Cosmetics</p>
          </div>
          <div className="category-div">
            <img src={require(`../../assets/img/software.png`)} height="40" width="40" alt="software" />
            <p className="text-light">Software</p>
          </div>
          <div className="category-div">
            <img src={require(`../../assets/img/apparel.png`)} height="40" width="40" alt="apparel" />
            <p className="text-light">Apparel</p>
          </div>
        </div>
      </div> */}
    </div>

    <Modal toggle={() => setModalLive(false)} isOpen={modalLive} backdropClassName="item-info-modal-backdrop">
      <div className="modal-header">
        <h5 className="modal-title">{selectedSuggestion.product}</h5>
        <i className="fa fa-times pointer" onClick={() => setModalLive(false)} />
      </div>
      <div className="modal-body">
        {
          selectedSuggestion.isIndian &&
          (
            selectedSuggestion.isCompany ?
              <div>
                {selectedSuggestion.product} is <b className="text-success"><u>Indian</u></b> company.
            </div>
              : <div>
                {selectedSuggestion.product} is by <b className="text-success"><u>Indian</u></b> company {selectedSuggestion.parent !== null && selectedSuggestion.parent}
              </div>
          )
        }

        {
          selectedSuggestion.isIndianSubsidary &&
          (
            selectedSuggestion.isCompany ?
              <div>
                {selectedSuggestion.product} is <b><u>Indian subsidary</u></b> company.
              </div>
              : <div>
                {selectedSuggestion.product} is by {selectedSuggestion.parent !== null && selectedSuggestion.parent}'s <b><u>Indian subsidary</u></b> company.
              </div>
          )
        }
        {
          selectedSuggestion.isForeign &&
          <div>
            {
              selectedSuggestion.isCompany ?
                <div>
                  {selectedSuggestion.product} is a <b className="text-danger"><u>{selectedSuggestion.isChinese ? "chinese" : "foreign"}</u></b> company.
            </div>
                : <div>
                  {selectedSuggestion.product} is by a <b className="text-danger"><u>{selectedSuggestion.isChinese ? "chinese" : "foreign"}</u></b> company {selectedSuggestion.parent !== null && selectedSuggestion.parent}
                </div>
            }
            {
              selectedSuggestion.alternates !== null &&
              <div className="text-success">
                <hr />
                <u className="text-light">Alternates:</u> {selectedSuggestion.alternates}
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
              {AlternateSubmitSuccess && <div className="text-success">Thanks for your submission!</div>}
              {AlternateSubmitFail && <div className="text-danger" >An error occoured!</div>}
            </div>
          </div>
        }
      </div>
    </Modal>

    <i className="fa fa-info page-help-icon" id="info-popover" />
    <UncontrolledPopover trigger="legacy" placement="right" target="info-popover" className="bg-custom">
      <PopoverHeader className="text-light">Classification of icons</PopoverHeader>
      <PopoverBody className="text-light">
        <ul className="p-0 m-0" style={{ listStyle: "none" }}>
          <li>
            <i className="fa fa-check-circle text-success" /> - <span>Indian Company</span>
          </li>
          <li>
            <i className="fa fa-exclamation-circle text-warning" /> - <span>Foreign (except china) company with Indian subsidiary</span>
          </li>
          <li>
            <i className="fa fa-times-circle text-danger" /> - <span>Foreign Company or any chinese Company</span>
          </li>
        </ul>
      </PopoverBody>
    </UncontrolledPopover>
  </div >
}


export default Home;
