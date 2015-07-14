"use strict";

const React = require("react");

const FileName = React.createClass({

    setFile(file) {
        var name = '',
            id = '';
        if(file) {
            name = file.name;
            id = file.id;
        }
        this.setState({
            name: name,
            id: id
        });
    },

    getInitialState() {
        return {
            name: '',
            id: ''
        }
    },

    render() {
        if (this.props.style && this.props.style.display === 'none') {
            return (
                <div></div>
            );
        }
        return (
            <a href={`/file/files/${this.state.id}/download`}>{this.state.name}</a>
        );
    }
});

module.exports = FileName;
