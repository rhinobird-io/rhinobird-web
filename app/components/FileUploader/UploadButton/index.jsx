"use strict";

const React = require("react");
const MUI = require("material-ui");

import Constants from '../constants.jsx';

const UploadButton = React.createClass({
    propTypes: {
        acceptTypes: React.PropTypes.array,
        maxSize: React.PropTypes.number.isRequired,
        minSize: React.PropTypes.number,
        beforeUpload: React.PropTypes.func.isRequired,
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
        this.props.beforeUpload();
        let _this = this;
        var input = $(document.createElement('input'));
        input.attr("type", "file");
        input.attr("multiple", "true");

        input.change(function(e) {
            if (e && e.target && e.target.files && e.target.files.length > 0) {
                let regExp = _this.buildRegExp();
                for (var index = 0, max = e.target.files.length; index < max; index += 1) {
                    let file = e.target.files[index];
                    if (!file) {
                        _this.props.onUpload({
                            result: Constants.UploadResult.FAILED,
                            error: "can not find the file."
                        });
                        continue;
                    }
                    if (!(regExp.test(file.type) || regExp.test(file.name))) {
                        _this.props.onUpload({
                            result: Constants.UploadResult.FAILED,
                            error: `${file.name} : File type is not supported!`
                        });
                        continue;
                    }
                    else if (file.size > _this.props.maxSize) {
                        _this.props.onUpload({
                            result: Constants.UploadResult.FAILED,
                            error: `${file.name} : File is too large! Max size is ${_this.props.maxSize} bytes!`
                        });
                        continue;
                    }
                    else if (file.size < _this.props.minSize) {
                        _this.props.onUpload({
                            result: Constants.UploadResult.FAILED,
                            error: `File is too small! Min size is ${_this.props.minSize} bytes!`
                        });
                        continue;
                    }
                    let formData = new FormData();
                    formData.append('file', file);
                    $.post('/file/files', {name: file.name}).done((newFile)=> {
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
                }
            }
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
