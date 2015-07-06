"use strict";

const React = require("react");
const UploadButton = require('./UploadButton');
const FileName = require('./FileName');
const UploadResult = require('./UploadResult');
const Item = require("../Flex").Item;
import Constants from './constants';

const FileUploader = React.createClass({
    propTypes: {
        acceptTypes: React.PropTypes.array,
        maxSize: React.PropTypes.number.isRequired,
        minSize: React.PropTypes.number
    },

    getDefaultProps() {
        return {
            minSize: 0,
            maxSize: 100 * 1024 * 1024, //max size is 100M by default
            acceptTypes: [] //all file types are supported
        };
    },

    onUpload: function(result) {
        if (result.result === Constants.UploadResult.SUCCESS) {
            this.refs.fileName.setFile(result.file);
            this.refs.uploadResult.setResult(result.result);
        }
        else if (result.result === Constants.UploadResult.FAILED) {
            this.refs.fileName.setFile(undefined);
            this.refs.uploadResult.setResult(result.error);
        }
    },
    render() {
        return (
            <Item>
                <FileName ref="fileName"/>
                <UploadButton {...this.props} onUpload={this.onUpload}/>
                <UploadResult ref="uploadResult"/>
            </Item>
        );
    }
});

module.exports = FileUploader;
