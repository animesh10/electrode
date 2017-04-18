import React from "react";
import "es6-promise";
import "isomorphic-fetch";

const HTTP_BAD_REQUEST = 400;
const HTTP_OK = 200;
let token;

class RecordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      artist: ''
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleArtistChange = this.handleArtistChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }
  handleArtistChange(event) {
    this.setState({
      artist: event.target.value
    });
  }
  handleSubmit(event) {
    //alert('A new record was submitted: ' + this.state.name + " By: " + this.state.artist);
    fetch("/1", { credentials: "same-origin" })
      .then((resp) => {
        if (resp.status === HTTP_OK) {
          token = resp.headers.get("x-csrf-jwt");
          console.log("TOKEN IS:::", token);
        } else {
          throw new Error("token generation failed");
        }
        fetch('/addRecord', {
          credentials: "same-origin",
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "x-csrf-jwt": token
          },
          body: JSON.stringify({
            name: this.state.name,
            artist: this.state.artist
          })
        })
          .then((response) => {
            if (response.status >= HTTP_BAD_REQUEST) {
              throw new Error("Bad response from server");
            }
            return result;
          })
          .catch((err) => {
            throw new Error("Error Adding Record", err);
          });
      })
      .catch((err) => {
        throw new Error("Error Fetching Csrf Token for Record", err);
      });
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} >
        <label>
          Name:
          <input type="text" value={this.state.name} onChange={this.handleNameChange} />
        </label>
        <label>
          Artist:
          <input type="text" value={this.state.artist} onChange={this.handleArtistChange} />
        </label>
        <input type="submit" value="Submit" />
      </form >
    );
  }
}

export default RecordForm;
