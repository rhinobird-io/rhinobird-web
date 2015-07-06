"use strict";

const React = require("react");

const FileName = React.createClass({

    setFile(file) {
        if(file)
            this.setState({
                name: file.name,
                id: file.id
            });
        else
            this.setState({
                name: '',
                id: ''
            });
    },

    getInitialState() {
        return {
            name: '',
            id: ''
        }
    },

    render() {
        return (
            <a href={`/file/files/${this.state.id}/download`}>{this.state.name}</a>
        );
    }
});

module.exports = FileName;
