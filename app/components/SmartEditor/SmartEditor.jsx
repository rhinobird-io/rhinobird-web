"use strict";

let React = require("react");
let mui = require("material-ui"),
    TextField = mui.TextField;

const commands = [
  {name: "vity", manual: ":room_name"},
  {name: "file", manual: ":file_id"}
];

export default React.createClass({
  propTypes: {
    disabled: React.PropTypes.bool,
    users: React.PropTypes.array
  },

  getValue() {
    return this.refs.textfield.getValue();
  },

  _onKeyDown() {

  },

  render() {
    return (
      <div className="smart-editor">
        <TextField {...this.props} ref="textfield" onKeyDown={this._onKeyDown} />
      </div>
    );
  }
});
