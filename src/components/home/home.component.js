import React, { useState, useRef, useEffect } from 'react';
import './home.component.scss';
import Loader from '../../custom/loader/loader.component';
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import ReactGA from 'react-ga';
import InfoModal from '../info-modal/info-modal.component';
import SuggestionModal from '../suggestion-modal/suggestion-modal.component';
import { get } from '../../utilities/HttpUtility';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes, faChartLine, faInfo, faCheckCircle, faTimesCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify';

const Home = () => {
  const searchInput = useRef(null);
  const [showSearchClear, setShowSearchClear] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestionLoading, setShowSuggestionLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState();
  const [infoModalLive, setInfoModalLive] = useState(false);
  const [suggestionModalLive, setSuggestionModalLive] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState({});
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [showTrendingLoading, setShowTrendingLoading] = useState(true);

  useEffect(() => {
    searchInput.current.focus();
    ReactGA.pageview("/home");
    getTrending();
  }, []);

  function getTrending() {
    get(`api/product/GetTrending`)
      .then(
        (result) => {
          setShowTrendingLoading(false);
          setTrendingSearches(result);
        },
        () => {
          toast.error("An error occoured");
          setShowTrendingLoading(false);
        }
      );
  }

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
        get(`api/product/get/${cleanedSearchTerm}`)
          .then(
            (result) => {
              setShowSuggestionLoading(false);
              setSuggestions(result);
            },
            () => {
              toast.error("An error occoured, try again!");
              setSearchTerm("");
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
    setSelectedSuggestion(suggestion);
    setInfoModalLive(true);
    get(`api/product/peeked/${suggestion.product}`);
  }

  function trendingSelected(suggestion) {
    setSelectedSuggestion(suggestion);
    setInfoModalLive(true);
  }

  function submitSuggestion() {
    setSuggestionModalLive(true);
  }

  return <div className="w-100 h-100 overflow-auto">
    <div className="container d-flex flex-column align-items-center justify-content-center1 w-100 h-100 main-container">

      <div className="col-9 col-lg-6" style={{ flex: 0 }}>
        <img src={require(`../../assets/img/logo.png`)} className="img-fluid" alt="IsItIndian" />
      </div>

      <div className="search-wrapper text-center d-flex flex-row my-3 p-0 col-10 col-lg-6">
        <input type="text" className="flex-grow-1" autoComplete="off" placeholder="Search"
          onChange={onChange} value={searchTerm} ref={searchInput} />

        {showSearchClear && <FontAwesomeIcon icon={faTimes} className="times-icon" onClick={clearInputField} />}

        <div className="divider"></div>
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
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
                      <FontAwesomeIcon icon={(suggestion.isForeign ? faTimesCircle : suggestion.isIndianSubsidary ? faExclamationCircle : faCheckCircle)}
                        className={"mr-1 " + (suggestion.isForeign ? "text-danger" : suggestion.isIndianSubsidary ? "text-warning" : "text-success")} />
                      <span className="suggetion-list-element-text">{suggestion.product}</span>
                    </li>
                  })
                }
              </ul>
            </div>
          }
          {
            (suggestions.length === 0 && searchTerm.length > 1 && !showSuggestionLoading) &&
            <div className="suggestion-count-zero">
              <div>No matching results!</div>
              <div className="link-style" onClick={() => submitSuggestion()}>Are we missing it? Submit a suggestion</div>
            </div>
          }
        </div>
      </div>

      {
        trendingSearches &&
        <div className="trending-section text-center d-flex flex-column p-0 col-10 col-lg-6">
          <p className="w-100 text-center trending-head">Trending</p>
          {
            showTrendingLoading ? <Loader /> :
              <div className="trending-badges w-100 d-flex flex-row">
                {
                  trendingSearches.map((trendingItem) => {
                    return <div key={trendingItem.product} className="trending-item" onClick={() => trendingSelected(trendingItem)}>
                      <FontAwesomeIcon icon={faChartLine} className="trending-icon" />
                      {trendingItem.product}
                    </div>
                  })
                }
              </div>
          }
        </div>
      }

    </div>

    <InfoModal modalLive={infoModalLive} selectedSuggestion={selectedSuggestion} setModalLive={setInfoModalLive}></InfoModal>

    <SuggestionModal modalLive={suggestionModalLive} missedSuggestion={searchTerm} clearSearchInput={clearInputField} setModalLive={setSuggestionModalLive}></SuggestionModal>
    <div className="page-help-icon" id="info-popover"><FontAwesomeIcon icon={faInfo} /></div>
    <UncontrolledPopover trigger="legacy" placement="right" target="info-popover" className="bg-custom">
      <PopoverHeader className="text-light">Icon Legends</PopoverHeader>
      <PopoverBody className="text-light">
        <ul className="p-0 m-0" style={{ listStyle: "none" }}>
          <li>
            <FontAwesomeIcon className="text-success" icon={faCheckCircle} /> - <span>Indian Company</span>
          </li>
          <li>
            <FontAwesomeIcon className="text-warning" icon={faExclamationCircle} /> - <span>Foreign (except china) company with Indian subsidiary</span>
          </li>
          <li>
            <FontAwesomeIcon className="text-danger" icon={faTimesCircle} /> - <span>Foreign Company or any chinese Company</span>
          </li>
        </ul>
      </PopoverBody>
    </UncontrolledPopover>
  </div >
}


export default Home;
