"use strict";

const React = require("react");
import Constants from '../constants.jsx';
const StylePropable = require('material-ui/lib/mixins/style-propable');

const UploadResult = React.createClass({
    clearResults: function () {
        this.setState({
            results: []
        });
    },
    mixins: [React.addons.PureRenderMixin, StylePropable],
    addResult(result) {
        let results = this.state.results;
        if (result.result === Constants.UploadResult.SUCCESS) {
            results.push({
                style: {color: 'green'},
                msg: ": Upload success.",
                url: `/file/files/${result.file.id}/download`,
                name: result.file.name
            });
        }
        else if (result.result === Constants.UploadResult.FAILED) {
            results.push({
                style: {color: 'red'},
                msg: result.error
            });
        }
        this.setState({
            results: results
        });
        this.forceUpdate();
    },

    getInitialState() {
        return {
            results: []
        };
    },

    render() {
        let content = [];
        if (this.state.results && this.state.results.length > 0)
            content = this.state.results.map((result) => (
                <span key={result.url} style={this.mergeAndPrefix(result.style, this.props.style)}>
                    {result.url ? <a href={result.url}>{result.name}</a> : ''}
                    {result.msg}
                </span>
            ));
        return (
            <div>
            {content}
            </div>
        );
    }
});

module.exports = UploadResult;
