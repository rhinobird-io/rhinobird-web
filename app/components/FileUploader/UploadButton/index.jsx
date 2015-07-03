"use strict";

const React = require("react");
const MUI = require("material-ui"), TextField = MUI.TextField;

const Item = require("../../Flex/index").Item;
const Flex = require('../../Flex/index');
const FileName = require('../FileName');

const UploadButton = React.createClass({
    propTypes: {
        types: React.PropTypes.string,
        maxsize: React.PropTypes.number,
        onUpload: React.PropTypes.func.isRequired
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


    _uploadFile(callback) {
        let _this = this;
        var input = $(document.createElement('input'));
        input.attr("type", "file");
        input.change(function(e) {
            let file = e.target.files[0];
            let formData = new FormData();
            formData.append('file', file);
            $.post('/file/files', {name: file.name}).done((newFile)=>{
                console.log(newFile.id);
                console.log(newFile);
                $.ajax({
                    url: `/file/files/${newFile.id}`,
                    type: 'PUT',
                    processData: false,
                    contentType: false,
                    data: formData
                });
                _this.props.onUpload(newFile);
            });
        });
        input.trigger('click'); // opening dialog
    },

    render() {
        return (
            <input type="button" value="Upload" onClick={this._uploadFile}/>
        );
    }
});

module.exports = UploadButton;
