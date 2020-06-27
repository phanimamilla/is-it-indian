import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.scss'
import Routes from './routes';
import ReactGA from 'react-ga';
import { gaTrackingId } from './config';

function App() {
  ReactGA.initialize(gaTrackingId);
  return (
    <Router>
      <Routes />
    </Router>
  );
}

export default App;
