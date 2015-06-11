"use strict";

let React = require("react");
let mui = require("material-ui"),
    Tabs = mui.Tabs,
    Tab = mui.Tab;

let SmartEditor = require("./SmartEditor");
let SmartDisplay = require("./SmartDisplay");

const SmartPreview = React.createClass({
  contextTypes:{
    muiTheme: React.PropTypes.object
  },
  getInitialState() {
    return {
      value: this.props.defaultValue || ""
    };
  },

  _preview(tab) {
    if (!tab.props.selected) {
      this.setState({value: this.refs.editor.getValue()});
    }
  },

  render() {
    let defaultValue = this.props.valueLink ? undefined : this.state.value;
    return (
      <Tabs style={this.props.style}>
        <Tab label="EDIT" >
          <SmartEditor ref="editor" defaultValue={defaultValue} valueLink={this.props.valueLink} multiLine />
        </Tab>
        <Tab label="PREVIEW" onActive={this._preview} >
          <SmartDisplay value={this.state.value} />
        </Tab>
      </Tabs>
    );
  }
});

export default SmartPreview;
