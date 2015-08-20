"use strict";

const React = require("react");
const PerfectScroll = require('../../PerfectScroll');
const Picture = require('../../Picture');
require('../style.less');

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
            _this = this,
            files = this.state.files,
            styles = {
                height: files && files.length > 0 ? 230 : 0,
                position: 'relative',
                whiteSpace: 'nowrap',
                overflowY: 'auto'
            };

        if (files && files.length > 0) {
            files.map(function (file) {
                content.push(<Picture class="picture" src={file.url}
                                      style={{width: 200, height: 200, margin: 5, cursor: 'pointer', border: 'solid 3px transparent'}}
                                      onClick={_this._deleteImage} />);
            });
        }

        return (
            <PerfectScroll noScrollY style={styles}>
                {content}
            </PerfectScroll>
        );
    },

    _deleteImage: function (url) {
        var files = this.state.files,
            i = 0,
            max = files.length;
        for(; i < max; i++){
            if(files[i].url === url) break;
        }
        files.splice(i, 1);
        this.setState({
            files: files
        });
    },
    getValue() {
        var i = 0,
            files = this.state.files,
            max = files.length;
        for (; i < max; i += 1){
            files[i].url = `/file/files/${files[i].id}/fetch`;
        }
        return files;
    },
    setValue(value) {
        if (value && value.length > 0) {
            if (value[0].url) {
                this.setState({
                    files: value
                });
            } else if (typeof value[0] === 'string') {
                var files = value.map((v) => {
                    var arr = v.split('/');
                    return {
                        id: arr[arr.length - 2],
                        url: v
                    };
                });
                this.setState({
                    files: files
                });
            }
        }
    }
});

module.exports = UploadReview;
