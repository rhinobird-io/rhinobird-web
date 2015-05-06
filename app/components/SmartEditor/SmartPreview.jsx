"use strict";

let React = require("react");
let mui = require("material-ui"),
    Tabs = mui.Tabs,
    Tab = mui.Tab;

let SmartEditor = require("./SmartEditor");
let SmartDisplay = require("./SmartDisplay");

// `valueLink` are not supported yet because of the bug in enhanced-textarea.jsx
const SmartPreview = React.createClass({
  propTypes: {
    defaultValue: React.PropTypes.string
  },

  getInitialState() {
    return { value: this.props.defaultValue };
  },

  _preview(tab) {
    if (tab.props.label === "PREVIEW" && !tab.props.selected) {
      this.setState({value: this.refs.editor.getValue()});
    }
  },

  render() {
    return (
      <Tabs>
        <Tab label="EDIT">
          <SmartEditor ref="editor" defaultValue={this.state.value || ""} multiLine />
        </Tab>
        <Tab label="PREVIEW" onActive={this._preview}>
          <SmartDisplay value={this.state.value} />
        </Tab>
      </Tabs>
    );
  }
});

export default SmartPreview;
