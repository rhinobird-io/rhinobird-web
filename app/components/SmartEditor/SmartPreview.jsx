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
    return {
      value: "",
      display: ""
    };
  },

  _preview(tab) {
    if (tab.props.label === "PREVIEW") {
      this.setState({display: this.state.value});
    }
  },

  render() {
    return (
      <Tabs>
        <Tab label="EDIT">
          <SmartEditor valueLink={this.linkState('value')} multiLine={true} />
        </Tab>
        <Tab label="PREVIEW" onActive={this._preview}>
          <SmartDisplay value={this.state.display} />
        </Tab>
      </Tabs>
    );
  }
});
