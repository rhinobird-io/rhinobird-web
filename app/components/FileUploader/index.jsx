"use strict";

const React = require("react");
const UploadButton = require('./UploadButton');
const UploadResult = require('./UploadResult');
const UploadReview = require('./UploadReview');
const Item = require("../Flex").Item;
import Constants from './constants';

const FileUploader = React.createClass({
    propTypes: {
        acceptTypes: React.PropTypes.array,
        maxSize: React.PropTypes.number.isRequired,
        minSize: React.PropTypes.number,
        afterUpload: React.PropTypes.func,
        showReview: React.PropTypes.bool,
        showResult: React.PropTypes.bool,
        text: React.PropTypes.string,
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.string.isRequired,
            requestChange: React.PropTypes.func.isRequired
        })
    },

    getDefaultProps() {
        return {
            minSize: 0,
            maxSize: 100 * 1024 * 1024, //max size is 100M by default
            acceptTypes: [], //all file types are supported
            showReview: false,
            showResult: false
        };
    },
    componentDidMount() {
        if (this.props.valueLink) {
            this.refs.uploadReview.setValue(this.props.valueLink.value);
        }
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.valueLink) {
            this.refs.uploadReview.setValue(nextProps.valueLink.value);
        }
    },
    _updateValueLink() {
        let valueLink = this.props.valueLink;
        if (valueLink) {
            valueLink.value = this.getValue();
            valueLink.requestChange(valueLink.value);
        }
    },
    onUpload: function(result) {
        if (result.result === Constants.UploadResult.SUCCESS) {
            this.refs.uploadReview.setFile(result.file);
            this.refs.uploadResult.addResult(result);
            this._updateValueLink();
        }
        else if (result.result === Constants.UploadResult.FAILED) {
            this.refs.uploadReview.setFile(undefined);
            this.refs.uploadResult.addResult(result);
            this._updateValueLink();
        }

        this.props.afterUpload(result);
    },
    beforeUpload: function () {
        this.refs.uploadResult.clearResults();
    },
    render() {
        return (
            <Item style={{padding: '10px 0px'}}>
                <UploadReview style={{display: !this.props.showReview ? 'none' : ''}} ref="uploadReview"/>
                <UploadButton {...this.props} beforeUpload={this.beforeUpload} onUpload={this.onUpload}/>
                <UploadResult style={{display: !this.props.showResult ? 'none' : 'block'}}  ref="uploadResult"/>
            </Item>
        );
    },
    getValue(){
        return this.refs.uploadReview.getValue();
    }
});

module.exports = FileUploader;
