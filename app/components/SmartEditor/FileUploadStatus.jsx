"use strict";

let React = require("react");
let mui = require("material-ui");
const Flex = require('../Flex');
const FileUploadStatus = React.createClass({
    render() {
        return <Flex.Layout>
            <div>{this.props.file.name}</div>
            <mui.LinearProgress mode='determinate' value={this.props.file.value} />
        </Flex.Layout>;
    }
});

export default FileUploadStatus;
