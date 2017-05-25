import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import electrodeLogo from "../images/electrode.svg";
import Notifications from "react-notify-toast";

class HomeWrapper extends React.Component {
  render() {
    return (
      <Home data={this.props.data} />
    );
  }
}

HomeWrapper.propTypes = {
  data: PropTypes.string
};

/* eslint-disable max-len */
export class Home extends React.Component {
  render() {
    return (
      <div>
        <Notifications />
        <div style={{
          width: "50%",
          marginLeft: "auto",
          marginRight: "auto"
        }}>
          <a href="https://github.com/electrode-io"> <img style={{
            width: "100%"
          }} alt="Electrode Logo" src={electrodeLogo} />
          </a>
        </div>
        <h2>Demonstration Components</h2>
        <ul>
          <li><a href="/csrf">CSRF protection using electrode-csrf-jwt</a></li>
          <li>
            <a href="/above-the-fold?skip=true">
              Above the Fold Render with skip=true - increase your App's performance by using a skip prop
            </a>
          </li>
          <li>
            <a href="/above-the-fold?skip=false">
              Above the Fold Render with skip=false - increase your App's performance by using a skip prop
            </a>
          </li>
          <li><a href="/ssrcachingsimpletype">SSR Caching Simple Type Example</a></li>
          <li><a href="/ssrcachingtemplatetype">SSR Caching Template Type Example</a></li>
          <li><a href="/push-notifications">Push Notifications Example</a></li>
          <li><a href="/todo-app">Todo List Example</a></li>
          <li><a href="/record-store">MongoDB Example</a></li>
        </ul>
        <p>{this.props.data}</p>
        <iframe
          width="600"
          height="450"
          frameBorder="0" style={{ border: 0 }}
          src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDyNxk4jNLQwKpQP8twL1h9kLpTmwDr2D4&q=Space+Needle,Seattle+WA" >
        </iframe>
      </div >
    );
  }
}

Home.propTypes = {
  data: PropTypes.string
};

const mapStateToProps = (state) => ({
  data: state && state.data
});

export default connect(
  mapStateToProps
)(HomeWrapper);
