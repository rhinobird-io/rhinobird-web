"use strict";

const React = require("react");
import Constants from '../constants.jsx';

const UploadResult = React.createClass({

    setResult(result) {
        this.setState({
            style: {color: (result === Constants.UploadResult.SUCCESS ? "green" : "red")},
            result: result
        });
    },

    getInitialState() {
        return {
            style: {color: "red"},
            result: ''
        }
    },

    render() {
        return (
            <span style={this.state.style}>{this.state.result}</span>
        );
    }
});

module.exports = UploadResult;
