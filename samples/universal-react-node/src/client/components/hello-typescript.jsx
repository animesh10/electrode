import React from "react";
const HTTP_OK = 200;

export default class HelloTypescript extends React.Component {

  constructor() {
    super();
    this.state = {
      testResult: ""
    };
    this.handleTestValid = this.handleTestValid.bind(this);
  }

  handleTestValid() {
    this.setState({ testResult: "valid" });
    fetch("/hello-coffeescript") // eslint-disable-line
      .then((resp) => {
        console.log("RESP:", resp);
        if (resp.status === HTTP_OK) {
          this.setState({ testResult: resp.body });
        } else {
          this.setState({ testResult: `GET request returned ${resp.status}` });
        }
      })
      .catch((e) => {
        this.setState({ testResult: e.toString() });
      });
  }

  render() {
    const result = this.state.testResult;
    return (
      <div>
        <h1>Electrode CoffeeScript plugin demo</h1>
        <p>This component demonstrates usage of a hapi plugin written in CoffeeScript</p>
        <p>A GET endpoint, <code>/hello-coffeescript</code>, which returns <code>Hello</code> </p>
        <p><a href="#" onClick={this.handleTestValid}>Test CoffeScript Plugin</a> </p>
        {result}
      </div>
    );
  }
}
