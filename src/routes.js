import React from "react";
import { Switch, Route } from "react-router-dom";
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';
import Home from './components/home/home.component';
// import Product from './components/product/product.component';

function Routes() {

    const history = createBrowserHistory();
    history.listen(location => {
        console.log(123);
        ReactGA.pageview(location.pathname); // Record a pageview for the given page
    });

    return (
        <Switch>
            <Route path="/home" component={Home} />
            <Route path="/" component={Home} />
        </Switch>
    );
}

export default Routes;