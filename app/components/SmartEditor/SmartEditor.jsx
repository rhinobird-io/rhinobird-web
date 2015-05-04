"use strict";

const React = require("react");
const mui = require("material-ui"), TextField = mui.TextField;
const CaretPosition = require("textarea-caret-position");

const Item = require("../Flex").Item;
const PopupSelect = require("../Select").PopupSelect;
const UserStore = require("../../stores/UserStore");

const COMMANDS = [
  {name: "vity", manual: ":room_name"},
  {name: "file", manual: ":file_id"}
];

export default React.createClass({
  propTypes: {
    disabled: React.PropTypes.bool,
    popupWidth: React.PropTypes.number,
    popupMaxHeight: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      popupWidth: 240,
      popupMaxHeight: 280
    };
  },

  getInitialState() {
    return {
      options: this._getOptions(),
      showPopup: false,
      popupPosition: {}
    };
  },

  componentDidMount() {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.setState({options: this._getOptions()});
  },

  _getOptions() {
    return UserStore.getUsersArray().map(u =>
      <option key={u.id} value={u.id} data={"@" + u.name}>
        <span style={{fontWeight: 500}}>{u.name}</span>
      </option>
    ).concat(COMMANDS.map(c =>
      <option key={c.name} value={c.name} data={"#" + c.name}>
        <span style={{fontWeight: 500}}>{c.name}</span>
        <span>{c.manual}</span>
      </option>
    ));
  },

  _onInputChange(e) {
    this.refs.popup.filter(this.getValue());
    this._setPopupPosition(this.refs.textfield.refs.input.getInputNode());
  },

  _setPopupPosition(textarea) {
    let text = textarea.value;
    let selectionEnd = textarea.selectionEnd;
    console.log(text.charAt(selectionEnd - 1));
  },

  getValue() {
    return this.refs.textfield.getValue();
  },

  showPopup() {
    this.setState({showPopup: true});
  },

  hidePopup() {
    this.setState({showPopup: false});
  },

  render() {
    let style = {
      padding: "0 0.5em 0.5em",
      boxSizing: "border-box"
    };
    Object.assign(style, this.props.style);

    let popupStyle = {
      width: this.props.popupWidth,
      maxHeight: this.props.popupMaxHeight,
      overflow: "auto"
    };
    for (let k in this.state.popupPosition) {
      popupStyle[k] = this.state.popupPosition[k];
    }

    let popup = <PopupSelect ref="popup"
            style={popupStyle}
            controller={this.refs.textfield}
            onKeyDown={() => 0}
            onChange={this._onInputChange}>
          {this.state.options}
        </PopupSelect>

    // Apply `style` to TextField seems no effect, so just apply to Item
    return (
      <Item flex style={style} className="smart-editor">
        <TextField {...this.props} ref="textfield" />
        {popup}
      </Item>
    );
  }
});
