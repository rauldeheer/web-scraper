import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Col, Container, Row } from 'reactstrap';

import { Header } from '../../components/Header/Header';
import { NavigationBox } from '../../components/NavigationBox/NavigationBox';
import AdPage from '../../images/tool-banner.jpg';
import MailBlue from '../../images/mailblue.png';
import InspirationTool from '../../images/inspiration.jpg';

import './Home.scss';

export const Home = ({}: RouteComponentProps) => (
  <>
    <Header/>
    <div className="content">
      <Container>
        <Row>
          <Col sm={12}>
            <h1 className="title">Social Media Ondernemer tool overzicht.</h1>
            <h4 className="subtitle">Hier vind u alle online tools die de Social Media Ondernemer Club te bieden
              heeft:</h4>
          </Col>
        </Row>
        <Row>
          <NavigationBox title="AdPage" text="Maak gemakkelijk en snel converterende landingspagina's" imageSource={AdPage} imageAlt="adpage"/>
          <NavigationBox title="MailBlue" text="Vergroot je winst met marketing automation." imageSource={MailBlue} imageAlt="mailblue"/>
          <NavigationBox title="Inspiration tool" text="Laat je inspireren en vind de mooiste landingspagina's." badge={true} badgeCount={7} imageSource={InspirationTool} imageAlt="inspiration-tool"/>
        </Row>
      </Container>
    </div>
  </>
);
