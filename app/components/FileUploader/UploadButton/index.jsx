"use strict";

const React = require("react");
const MUI = require("material-ui");
const FileName = require('../FileName');

import Constants from '../constants.jsx';

const UploadButton = React.createClass({
    propTypes: {
        acceptTypes: React.PropTypes.array,
        maxSize: React.PropTypes.number.isRequired,
        minSize: React.PropTypes.number,
        onUpload: React.PropTypes.func.isRequired
    },

    getDefaultProps() {
        return {
            minSize: 0,
            maxSize: 100 * 1024 * 1024, //max size is 100M by default
            acceptTypes: [] //all file types are supported
        };
    },

    buildRegExp() {
        let str = "";
        if (this.props.acceptTypes && this.props.acceptTypes.length > 0){
            this.props.acceptTypes.forEach(item => {
                str += item + "|";
            });
            str = str.substring(0, str.length - 1);
        }
        let regExp = new RegExp("(\.|\/)(" + str + ")$", "i");
        return regExp;
    },

    _uploadFile() {
        let _this = this;
        var input = $(document.createElement('input'));
        input.attr("type", "file");

        input.change(function(e) {
            let file = e.target.files[0];
            if (!file){
                return;
            }
            let regExp = _this.buildRegExp();
            if (!(regExp.test(file.type) || regExp.test(file.name))){
                _this.props.onUpload({result: Constants.UploadResult.FAILED, error: "File type is not supported!"});
                return;
            }
            else if (file.size > _this.props.maxSize){
                _this.props.onUpload({result: Constants.UploadResult.FAILED, error: `File is too large! Max size is ${_this.props.maxSize} bytes!`});
                return;
            }
            else if (file.size < _this.props.minSize){
                _this.props.onUpload({result: Constants.UploadResult.FAILED, error: `File is too small! Min size is ${_this.props.minSize} bytes!`});
                return;
            }
            let formData = new FormData();
            formData.append('file', file);
            $.post('/file/files', {name: file.name}).done((newFile)=>{
                $.ajax({
                    url: `/file/files/${newFile.id}`,
                    type: 'PUT',
                    processData: false,
                    contentType: false,
                    data: formData
                }).done((uploadedFile) => {
                    uploadedFile.url = `/file/files/${uploadedFile.id}/fetch`;
                    _this.props.onUpload({result: Constants.UploadResult.SUCCESS, file: uploadedFile});
                });

            });
        });
        input.trigger('click');
    },

    render() {
        return (
            <MUI.RaisedButton type="button" label={this.props.text ? this.props.text : 'Upload'} secondary={true} onClick={this._uploadFile}/>
        );
    }
});

module.exports = UploadButton;
