import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

import Logo from '../../images/logo-smo.png';

import './Header.scss';

type Props = {};

export const Header = ({}: Props) => (
  <header>
    <Container>
      <Row>
        <Col sm={2} md={2}>
          <div className="logo-wrapper">
            <Link to="/">
              <img src={Logo} alt="smo-logo" className="logo"/>
            </Link>
          </div>
        </Col>
        <Col sm={10} md={10}>
          <nav className="main-nav">
            <ul className="nav-list">
              <li className="nav-item"><Link to="/">Community</Link></li>
              <li className="nav-item"><Link to="/">Trainingen</Link></li>
              <li className="nav-item"><Link to="/gallery">Tools<span className="badge">7</span></Link></li>
            </ul>
          </nav>
        </Col>
      </Row>
    </Container>
  </header>
);
