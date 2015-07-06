"use strict";

const React = require("react");
const UploadButton = require('./UploadButton');
const FileName = require('./FileName');
const UploadResult = require('./UploadResult');
const Item = require("../Flex").Item;
import Constants from './constants';

/*
  Usage: <FileUploader maxSize="1024000" minSize="1024" acceptTypes={["js", "jpg"]} afterUpload={this.afterUpload}></FileUploader>
 afterUpload(result){
    console.log(result.result);
    console.log(result.error);
    console.log(result.file);
 },
 */
const FileUploader = React.createClass({
    propTypes: {
        acceptTypes: React.PropTypes.array,
        maxSize: React.PropTypes.number.isRequired,
        minSize: React.PropTypes.number,
        afterUpload: React.PropTypes.func
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
        this.props.afterUpload(result);
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
