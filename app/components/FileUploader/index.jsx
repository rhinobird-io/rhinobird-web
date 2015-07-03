"use strict";

const React = require("react");
const UploadButton = require('./UploadButton');
const FileName = require('./FileName');
const Item = require("../Flex").Item;

const FileUploader = React.createClass({
    propTypes: {
        types: React.PropTypes.string,
        maxsize: React.PropTypes.number,
    },

    getDefaultProps() {
        return {
        };
    },

    getInitialState() {
        return {
        };
    },

    componentDidMount() {
    },

    onUpload: function(file) {
        this.refs.filename.setName(file.id + ":" + file.name);
    },
    render() {
        return (
            <Item>
                <FileName ref="filename"/>
                <UploadButton onUpload={this.onUpload}/>
            </Item>
        );
    }
});

module.exports = FileUploader;
