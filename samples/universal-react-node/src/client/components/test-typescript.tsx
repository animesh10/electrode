import React = require("react");

interface HelloProps { compiler: string; framework: string; }

interface HelloState { helloText : string };

export class Hello extends React.Component<HelloProps, HelloState> {
    render() {
        return <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>;
    }
}
