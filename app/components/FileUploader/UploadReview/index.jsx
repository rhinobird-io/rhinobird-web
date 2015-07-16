"use strict";

const React = require("react");

require('../style.less');
var Picture = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
    },
    doubleClickHandler: function(){
        this.props.onClick(this.props.id);
    },
    render: function(){
        return (
            <div className="picture" style={{backgroundImage: 'url('+this.props.src+')'}} onClick={this.doubleClickHandler}>
            </div>
        );

    }

});
const UploadReview = React.createClass({

    setFile(file) {
        if(file) {
            var files = this.state.files;
            files.push(file);
            this.setState({
                files: files
            });
        }
    },

    getInitialState() {
        return {
            files: []
        }
    },

    render() {
        if (this.props.style && this.props.style.display === 'none') {
            return (
                <div></div>
            );
        }

        var content = [],
            list = [],
            _this = this,
            files = this.state.files,
            className = '';

        if (files && files.length > 0) {
            className = 'pictures';
            files.map(function (file) {
                content.push(<Picture id={file.id} src={`/file/files/${file.id}/fetch`} title={file.name} onClick={_this._deleteImage} />);
                list.push(<a href={`/file/files/${file.id}/download`}>{file.name}</a>)
            });
        }

        return (
            <div className={className}>
                {content}
            </div>
        );
    },

    _deleteImage: function (id) {
        var files = this.state.files,
            i = 0,
            max = files.length;
        for(; i < max; i++){
            if(files[i].id === id) break;
        }
        files.splice(i, 1);
        this.setState({
            files: files
        });
    },
    getValue(){
        var i = 0,
            files = this.state.files,
            max = files.length;
        for (; i < max; i += 1){
            files[i].url = `/file/files/${files[i].id}/fetch`;
        }
        return files;
    }
});

module.exports = UploadReview;
