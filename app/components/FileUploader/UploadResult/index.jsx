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
        if (this.props.style && this.props.style.display === 'none') {
            return (
                <div></div>
            );
        }
        return (
            <span style={this.state.style}>{this.state.result}</span>
        );
    }
});

module.exports = UploadResult;
