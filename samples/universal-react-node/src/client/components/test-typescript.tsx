import * as React from 'react';

interface HelloProps { compiler: string; framework: string; }

interface HelloState { helloText : string };

class Hello extends React.Component<HelloProps, HelloState> {
    render() {
        return <h1>Hello from TypeScript React!</h1>;
    }
}

export default Hello;
