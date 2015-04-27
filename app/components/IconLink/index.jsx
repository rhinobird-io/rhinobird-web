"use strict";

const React = require("react");
const ReactStyle = require("react-style");
const FontIcon = require("material-ui").FontIcon;

export default React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    args: React.PropTypes.object
  },

  _handleFile(args) {
    let {id, name} = args;
    return {
      icon: "icon-description",
      text: name,
      url: "/file/files/" + id + "/download"
    };
  },

  _handleVity(args) {
    let {room, user} = args;
    return {
      icon: "icon-voice-chat",
      text: "vity:" + room,
      url: "https://46.137.243.49:5151/index.html#" + room + "@" + user
    };
  },

  _handleDefault(args) {
    return {
      icon: args.icon || "icon-error",
      text: args.text || "undefined",
      url: args.url || "#"
    };
  },

  render() {
    let styles = ReactStyle.create({
      wrapper: {
        display: "inline-flex",
        margin: "0 2px"
      },
      icon: {
        marginRight: 2,
        fontSize: "1.4em",
        verticalAlign: "sub"
      }
    });

    let args = this.props.args, attrs;
    switch (this.props.type) {
      case "file":
        attrs = this._handleFile(args);
        break;
      case "vity":
        attrs = this._handleVity(args);
        break;
      default:
        attrs = this._handleDefault(args);
        break;
    }

    return (
      <span styles={styles.wrapper}>
        <a target="_blank" href={attrs.url}>
          <FontIcon className={attrs.icon} styles={styles.icon} />
          <span>{attrs.text}</span>
        </a>
      </span>
    );
  }
});
