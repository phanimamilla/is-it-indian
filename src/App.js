import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.scss'
import Routes from './routes';
import ReactGA from 'react-ga';
import { gaTrackingId } from './config';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

function App() {
  ReactGA.initialize(gaTrackingId);
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />
      <Routes />
    </Router>
  );
}

export default App;
