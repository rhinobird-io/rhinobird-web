"use strict";

const React = require("react");

const FileName = React.createClass({

    setName(name) {
        this.setState({
            name: name
        });
    },

    getInitialState() {
        return {
            name: ''
        }
    },

    componentDidMount() {
    },



    render() {
        return (
            <span>{this.state.name}</span>
        );
    }
});

module.exports = FileName;
