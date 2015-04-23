var React       = require('react'),
    StyleSheet  = require('react-style'),
    PopupSelect = require('../PopupSelect');

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
        }),
        multiple: React.PropTypes.bool,
        placerholder: React.PropTypes.string
    },

    componentDidMount: function() {

    },

    componentDidUpdate: function() {
        this._updateHintPosition();
    },

    getInitialState: function() {
        return {
            selected: []
        };
    },

    _updateHintPosition() {
        this.refs.hint.getDOMNode().style.top = this.refs.text.getDOMNode().offsetTop + 'px';
        this.refs.hint.getDOMNode().style.left = this.refs.text.getDOMNode().offsetLeft + 'px';
    },

    _addSelectedOption(value) {
        let selected = this.state.selected;
        if (selected.length === 0) {
            selected.push(value);
        } else {
            if (!this.props.multiple) {
                selected[0] = value;
            } else if (selected.indexOf(value) < 0) {
                selected.push(value);
            } else {
                return ;
            }
        }
        this.setState({selected: selected});
    },

    render: function() {
        let styles = {
            select: {
                cursor: "pointer",
                border: "1px solid #ccc"
            },
            spinner: {

            }
        };

        console.log(this.state.selected);
        let single = null;
        let tokens = null;
        let text = <input ref="text" type="text" className="ui-select-input select-text" />;
        let popupSelect = <PopupSelect
            ref="popupSelect"
            controller={this.refs.text}
            onItemSelect={(value) => this._addSelectedOption(value)}>
            {this.props.children}
        </PopupSelect>;

        // Tokens in multiple mode
        if (this.props.multiple) {
            tokens = [];
            for (let i = 0; i < this.state.selected.length; i++) {
                tokens.push(<a>{this.state.selected[i]}</a>);
            }
        } else {
            let singleSelected = this.state.selected.length > 0  ? this.state.selected[0] : null;
            single = <div>{singleSelected || this.props.placeholder}</div>;
        }
        return (
            <div styles={styles.select} className="ui-select">
                {single}
                {tokens}
                {text}
                {popupSelect}
                <input ref="hint" type="text" className="ui-select-input select-hint" />
            </div>
        );
    }
});