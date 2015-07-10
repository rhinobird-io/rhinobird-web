"use strict";

const React = require("react");
const FileUploader = require('../FileUploader');

/*
  Usage: <FileUploader maxSize="1024000" minSize="1024" acceptTypes={["js", "jpg"]} afterUpload={this.afterUpload}></FileUploader>
 afterUpload(result){
    console.log(result.result);
    console.log(result.error);
    console.log(result.file);
 },
 */
const Test = React.createClass({

    afterUpload(result){
        console.log(result.result);
        console.log(result.error);
        console.log(result.file);
    },
    render() {
        return (
            <FileUploader maxSize="1024000" acceptTypes={["js", "jpg"]} afterUpload={this.afterUpload}></FileUploader>
        );
    }
});

module.exports = Test;
