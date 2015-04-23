var React       = require('react');
var PopupSelect = require('../PopupSelect');

require('./style.less');

export default React.createClass({
    propTypes: {
        dataSource: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.string,
        ]),
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.array.isRequired,
            requestChange: React.PropTypes.func.isRequired
        })
    },

    componentDidMount: function() {
    },

    componentDidUpdate: function() {
        this._updateHintPosition();
    },

    _updateHintPosition() {
        this.refs.hint.getDOMNode().style.top = this.refs.text.getDOMNode().offsetTop + 'px';
        this.refs.hint.getDOMNode().style.left = this.refs.text.getDOMNode().offsetLeft + 'px';
    },

    render: function() {
        var text = <input ref="text" type="text" className="select-text" />;
        var popupSelect = <PopupSelect ref="popupSelect" controller={this.refs.text} onItemSelect={(value) => this.refs.text.getDOMNode().value = value}> {this.props.children} </PopupSelect>;

        return (
            <div className="select">
                {text}
                {popupSelect}
                <input ref="hint" type="text" className="select-hint" value="hello" />
            </div>
        );
    }
});