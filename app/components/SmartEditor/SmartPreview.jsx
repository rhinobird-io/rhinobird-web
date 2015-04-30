"use strict";

let React = require("react");
let mui = require("material-ui"),
    Tabs = mui.Tabs,
    Tab = mui.Tab;

let SmartEditor = require("./SmartEditor");
let SmartDisplay = require("./SmartDisplay");

export default React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState() {
    return { value: null };
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
          <SmartEditor ref="editor" defaultValue={this.state.value || ""} multiLine={true} />
        </Tab>
        <Tab label="PREVIEW" onActive={this._preview}>
          <SmartDisplay value={this.state.value} />
        </Tab>
      </Tabs>
    );
  }
});
