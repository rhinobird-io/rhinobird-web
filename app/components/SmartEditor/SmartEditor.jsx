"use strict";

const React = require("react");
const mui = require("material-ui"),
      TextField = mui.TextField;

const CaretPosition = require("textarea-caret-position");

const PopupSelect = require("../Select").PopupSelect;

const commands = [
  {name: "vity", manual: ":room_name"},
  {name: "file", manual: ":file_id"}
];

export default React.createClass({
  propTypes: {
    disabled: React.PropTypes.bool,
    users: React.PropTypes.array
  },

  getInitialState() {
    return {
      hidePopup: true,
      popupPosition: {}
    };
  },

  getValue() {
    return this.refs.textfield.getValue();
  },

  _getOptions() {
    return [1,2,4,5,6,9].map(x =>
      <option value={x}><span>{x}</span></option>
    );
  },

  _onChange(e) {
    this._setPopupPosition(this.refs.textfield.refs.input.getInputNode());
  },

  _setPopupPosition(textarea) {
    let text = textarea.value;
    let selectionEnd = textarea.selectionEnd;
    //console.log(text.charAt(selectionEnd - 1));
  },

  render() {
    let _this = this;
    let popupStyle = {
      width: 240,
      maxHeight: 280,
      overflow: "auto"
    };
    for (let k in this.state.popupPosition) {
      popupStyle[k] = this.state.popupPosition[k];
    }
    return (
      <div className="smart-editor">
        <TextField {...this.props} ref="textfield" />
      </div>
    );
    return (
      <div className="smart-editor">
        <TextField {...this.props} ref="textfield" />
        <PopupSelect styles={popupStyle}
            controller={this.refs.textfield}
            onKeyDown={() => 0}
            onChange={this._onChange}>
          {this._getOptions()}
        </PopupSelect>
      </div>
    );
  }
});
