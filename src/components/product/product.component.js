import React from 'react';
import NavbarComponent from "../navbar/navbar.component";
import { Alert } from 'reactstrap';
import { Link } from 'react-router-dom';


function Product(props) {
    return <div className="w-100 h-100 overflow-auto" style={{}}>
        <NavbarComponent></NavbarComponent>
        <Alert color="danger">
            This product is not from an Indian company!
        </Alert>
        <Link to="/home" >Hello</Link>
    </div >

}

export default Product;