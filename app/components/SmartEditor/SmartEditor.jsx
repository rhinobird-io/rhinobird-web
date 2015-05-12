"use strict";

const React = require("react");
const MUI = require("material-ui"), TextField = MUI.TextField;
const CaretPosition = require("textarea-caret-position");
const EmojiPng = require.context("../../../node_modules/emojify.js/src/images/emoji", false, /png$/);

const Avatar = require("../Member").Avatar;
const Item = require("../Flex").Item;
const PopupSelect = require("../Select").PopupSelect;
const UserStore = require("../../stores/UserStore");
const ClickAwayable = MUI.Mixins.ClickAwayable;
import _ from 'lodash';

const COMMANDS = [
  {name: "vity", manual: ":room_name"},
  {name: "file", manual: ":file_id"}
];

const SmartEditor = React.createClass({
  mixins: [ClickAwayable],

  propTypes: {
    valueLink: React.PropTypes.shape({
      value: React.PropTypes.string.isRequired,
      requestChange: React.PropTypes.func.isRequired
    }),
    nohr: React.PropTypes.bool,
    popupWidth: React.PropTypes.number,
    popupMaxHeight: React.PropTypes.number,
    popupMarginTop: React.PropTypes.number,
    popupMinusTop: React.PropTypes.number
  },

  componentClickAway() {
    this.hidePopup();
  },

  getDefaultProps() {
    return {
      popupWidth: 240,
      popupMaxHeight: 280,
      popupMarginTop: 24,  // Magic number in `TextField` source code
      popupMinusTop: -4
    };
  },

  getInitialState() {
    return {
      options: [],
      position: "top",
      popupPosition: {},
      popupJustified: false
    };
  },

  componentDidMount() {
    // When using `SmartEditor` in `Tabs`, switching tabs will cause
    // components' re-mount. Since the `valueLink` property won't be passed to
    // `TextField`, we need to restore the text value here.
    if (this.props.valueLink) {
      this._getInputNode().value = this.props.valueLink.value;
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.valueLink) {
      this._getInputNode().value = nextProps.valueLink.value;
    }
  },

  getValue() {
    return this.refs.textfield.getValue();
  },

  showPopup() {
      this.refs.popup.show();
  },

  hidePopup() {
      this.refs.popup.dismiss();
  },

  // Filter menu options in current component rather than PopupSelect
  _setOptions(keyword) {
    let style = {
      overflowX: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    };
    let options = [];
    if (!keyword) {
      options = [];
    } else if (keyword.charAt(0) === "@" && keyword.length > 1) {
      options = UserStore.getUsersArray().filter(u =>
        u.name.indexOf(keyword.substr(1)) >= 0
      ).map(u =>
          <div key={u.id} value={[keyword, "@" + u.name + " "]} style={style}>
            <Avatar member={u} /> &ensp;
            <span style={{fontWeight: 500}}>{u.name}</span>
          </div>
      );
    } else if (keyword.charAt(0) === "#") {
      options = COMMANDS.filter(c =>
        c.name.indexOf(keyword.substr(1)) >= 0
      ).map(c =>
          <div key={c.name} value={[keyword, "#" + c.name + ":"]} style={style}>
            <span style={{fontWeight: 500}}>{c.name}</span>
            <span>{c.manual}</span>
          </div>
      );
    } else if (keyword.charAt(0) === ":" && keyword.length > 1) {
      options = EmojiPng.keys().map(k => k.substr(2, k.length - 6)).filter(k =>
        k.indexOf(keyword.substr(1)) >= 0
      ).slice(0, 10).map(k =>
          <div key={k} value={[keyword, ":" + k + ": "]} style={style}>
            <span>
              <img style={{height: "1.6em", verticalAlign: "middle"}} src={EmojiPng("./" + k + ".png")} />
            </span> &ensp;
            <span style={{fontWeight: 500}}>{k}</span>
          </div>
      );
    } else {
      options = [];
    }
    if (options.length > 0) {
      this.setState({options: options});
      this.showPopup();
    } else {
      this.hidePopup();
    }
  },

  _setPopupPosition(textarea, pos) {
    let caretPos = CaretPosition(textarea, pos);
    let textareaRect = textarea.getBoundingClientRect();
    let top = textareaRect.top + caretPos.top - textarea.scrollTop;
    let left = textareaRect.left + caretPos.left - textarea.scrollLeft;
    let popupPosition = {
      position: "fixed",
      top: top,
      left: left,
      marginTop: this.props.popupMarginTop
    };
    this.setState({
      popupPosition: popupPosition,
      popupJustified: false
    });
  },

  _updateValueLink() {
    let valueLink = this.props.valueLink;
    if (valueLink) {
      valueLink.value = this.getValue();
      valueLink.requestChange(valueLink.value);
    }
  },

  _getInputNode() {
    if (this.props.multiLine) {
      return this.refs.textfield.refs.input.getInputNode();  // <textarea>
    } else {
      return this.refs.textfield.refs.input.getDOMNode();  // <input>
    }
  },

  _onInputChange() {
    let textarea = this._getInputNode();
    let text = textarea.value, triggerPos = -1;
    for (let i = textarea.selectionEnd - 1; i >= 0; i--) {
      let ch = text.charAt(i);
      if (/[\w\.-]/.test(ch)) {
        continue;
      } else if (["@", "#", ":"].includes(ch)) {
        if (i === 0 || /\s/.test(text.charAt(i - 1))) triggerPos = i;
        break;
      } else {
        break;
      }
    }
    if (triggerPos >= 0) {
      this._setOptions(text.substring(triggerPos, textarea.selectionEnd));
      this._setPopupPosition(textarea, triggerPos);
    } else if (this.refs.popup.isShow()) {
      this.hidePopup();
    }
    this._updateValueLink();
  },

  _onItemSelect([keyword, replace]) {
    let textarea = this._getInputNode();
    let text = textarea.value;
    let end = textarea.selectionEnd - keyword.length + replace.length;
    textarea.value = text.substr(0, textarea.selectionEnd - keyword.length) +
      replace + text.substr(textarea.selectionEnd);
    textarea.selectionEnd = end;
    this.hidePopup();
    this._updateValueLink();
  },

  render() {
    let props = this.props;
    let style = {
      padding: "0 0.5em 0.5em",
      boxSizing: "border-box"
    };
    Object.assign(style, props.style);

    let popupStyle = {
      width: props.popupWidth,
      maxHeight: props.popupMaxHeight,
      overflow: "auto",
      zIndex: 20
    };
    for (let k in this.state.popupPosition) {
      popupStyle[k] = this.state.popupPosition[k];
    }

    // Re-render popup's position
    setTimeout(() => {
      if (this.state.popupJustified) return;
      let rect = this.refs.popup.getDOMNode().getBoundingClientRect();
      let popupPosition = {
        position: "fixed",
        visibility: "visible"
      };
      let newTop = this.state.popupPosition.top - rect.height;
      let position;
      if (rect.bottom > window.innerHeight && newTop > 0) {
        position = "top";
        popupPosition.top = newTop;
        popupPosition.marginTop = props.popupMinusTop;
      } else {
          position = "bottom";
        // unchanged
        popupPosition.top = this.state.popupPosition.top;
        popupPosition.marginTop = this.state.popupPosition.marginTop;
      }
      if (rect.right > window.innerWidth && rect.width < window.innerWidth) {
        popupPosition.left = "auto";
        popupPosition.right = 0;
      } else {
        // unchanged
        popupPosition.left = this.state.popupPosition.left;
      }
      this.setState({
        popupPosition: popupPosition,
        popupJustified: true,
          position: position
      });
    }, 0);

    let tfProps = {};
    ["className", "defaultValue", "errorText", "floatingLabelText", "hintText", "multiLine", "onKeyDown"].map(
      k => { tfProps[k] = props[k] }
    );

    // Apply `style` to TextField seems no effect, so just apply to Item
    return (
      <Item flex style={style} className={"smart-editor" + (props.nohr ? " nohr" : "")}>
        <TextField {...tfProps} ref="textfield"
                                onChange={this._onInputChange}/>
        <PopupSelect ref="popup"
                     position={this.state.position}
                     onItemSelect={this._onItemSelect}
            style={popupStyle}>
          {this.state.options}
        </PopupSelect>
      </Item>
    );
  }
});

export default SmartEditor;
