import React from "react";
// reactstrap components
import {
    UncontrolledCollapse,
    NavbarBrand,
    Navbar,
    Nav,
    Container
} from "reactstrap";
// core components
import logo from '../../assets/img/logo.png'

function NavbarComponent() {
    return (
        <>
            <Navbar className="navbar bg-primary py-0" expand="lg">
                <Container>
                    <NavbarBrand href="/" className="p-0" onClick={e => e.preventDefault()}>
                        <img src={logo} height="53px" alt="logo"/>
                    </NavbarBrand>
                    <button className="navbar-toggler" id="navbarNav" type="button">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <UncontrolledCollapse navbar toggler="#navbarNav">
                        <Nav navbar>

                        </Nav>
                    </UncontrolledCollapse>
                </Container>
            </Navbar>
        </>
    );
}

export default NavbarComponent;