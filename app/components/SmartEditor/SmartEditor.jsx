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
    nohr: React.PropTypes.bool,
    popupWidth: React.PropTypes.number,
    popupMaxHeight: React.PropTypes.number,
    popupMarginTop: React.PropTypes.string,
    popupMinusTop: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      popupWidth: 240,
      popupMaxHeight: 280,
      popupMarginTop: "1.8em",
      popupMinusTop: "-0.3em"
    };
  },

  getInitialState() {
    return {
      options: [],
      showPopup: false,
      popupPosition: {},
      popupJustified: false
    };
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

  // Filter menu options in current component rather than PopupSelect
  _setOptions(keyword) {
    let options = [];
    if (!keyword) {
      options = [];
    } else if (keyword.charAt(0) === "@") {
      options = UserStore.getUsersArray().filter(u =>
        keyword.length > 1 && u.name.indexOf(keyword.substr(1)) >= 0
      ).map(u =>
        <option key={u.id} value={[keyword, "@" + u.name + " "]}>
          <span style={{fontWeight: 500}}>{u.name}</span>
        </option>
      );
    } else if (keyword.charAt(0) === "#") {
      options = COMMANDS.filter(c =>
        c.name.indexOf(keyword.substr(1)) >= 0
      ).map(c =>
        <option key={c.name} value={[keyword, "#" + c.name + ":"]}>
          <span style={{fontWeight: 500}}>{c.name}</span>
          <span>{c.manual}</span>
        </option>
      );
    } else {
      options = [];
    }
    this.setState({
      showPopup: options.length > 0,
      options: options
    });
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

  _onInputChange(e) {
    let textarea = this.refs.textfield.refs.input.getInputNode();
    let text = textarea.value, triggerPos = -1;
    for (let i = textarea.selectionEnd - 1; i >= 0; i--) {
      let ch = text.charAt(i);
      if (ch.search(/\w/) >= 0) {
        continue;
      } else if ("@#".search(ch) >= 0) {
        triggerPos = i;
        break;
      } else {
        break;
      }
    }
    if (triggerPos >= 0) {
      this._setOptions(text.substring(triggerPos, textarea.selectionEnd));
      this._setPopupPosition(textarea, triggerPos);
    } else if (this.state.showPopup) {
      this.hidePopup();
    }
  },

  _onKeyDown(e) {
    // If popup is not active, 'ENTER', 'UP' and 'DOWN' will work as usual
    if (!this.state.showPopup && [13, 38, 40].includes(e.keyCode)) return;
    // If popup is active, map 'TAB' to 'DOWN'
    if (this.state.showPopup && e.keyCode === 9) e.keyCode = 40;
    this.refs.popup._keyDownListener(e);
  },

  _onItemSelect([keyword, replace]) {
    let textarea = this.refs.textfield.refs.input.getInputNode();
    let text = textarea.value;
    let end = textarea.selectionEnd - keyword.length + replace.length;
    textarea.value = text.substr(0, textarea.selectionEnd - keyword.length) +
      replace + text.substr(textarea.selectionEnd);
    textarea.selectionEnd = end;
    this.hidePopup();
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
      background: "#fff",
      display: this.state.showPopup ? "block" : "none",
      zIndex: 20
    };
    for (let k in this.state.popupPosition) {
      popupStyle[k] = this.state.popupPosition[k];
    }

    // Re-render popup's position
    setTimeout(() => {
      if (this.state.popupJustified) return;
      let rect = this.refs.popup.getDOMNode().getBoundingClientRect();
      let popupPosition = {position: "fixed"};
      let newTop = this.state.popupPosition.top - rect.height;
      if (rect.bottom > window.innerHeight && newTop > 0) {
        popupPosition.top = newTop;
        popupPosition.marginTop = props.popupMinusTop;
      } else {
        popupPosition.top = this.state.popupPosition.top;
        popupPosition.marginTop = props.popupMarginTop;
      }
      if (rect.right > window.innerWidth && rect.width < window.innerWidth) {
        popupPosition.left = "auto";
        popupPosition.right = 0;
      } else {
        popupPosition.left = this.state.popupPosition.left;
      }
      this.setState({
        popupPosition: popupPosition,
        popupJustified: true
      });
    }, 0);

    // Apply `style` to TextField seems no effect, so just apply to Item
    return (
      <Item flex style={style} className={"smart-editor" + (props.nohr ? " textfield-nohr" : "")}>
        <TextField {...props} ref="textfield" />
        <PopupSelect ref="popup"
            style={popupStyle}
            controller={this.refs.textfield}
            onChange={this._onInputChange}
            onKeyDown={this._onKeyDown}
            onItemSelect={this._onItemSelect}
            onBlur={this.hidePopup}>
          {this.state.options}
        </PopupSelect>
      </Item>
    );
  }
});
