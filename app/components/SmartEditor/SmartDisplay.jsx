"use strict";

require("../../../node_modules/highlight.js/styles/default.css");

let React = require("react");
let HighLight = require("highlight.js");
let MarkdownIt = require("markdown-it");

let IconLink = require("../IconLink");
let Member = require("../Member");
let UserStore = require("../../stores/UserStore");

const AT_REGEX = /^\s*(@\w+)/;
const SLASH_REGEX = /^\s*(\/[\w\.-]+(:\S+)?)/;
const EMAIL_REGEX = /^\s*(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

function _plugin(state, regex, trans) {
  let text = state.src.substr(state.pos);
  if (text.search(regex) < 0) {
    return false;
  } else {
    let start = text.search(/\S/), token;
    if (start > 0) {
      token = state.push("text", "", 0);
      token.content = text.substr(0, start);
    }
    let match = text.substr(start).match(regex)[0];
    trans(state, match);
    state.pos += start + match.length;
    return true;
  }
}

function atPlugin(state) {
  return _plugin(state, AT_REGEX, (state, match) => {
    let token = state.push("at_open", "a", 1);
    token = state.push("text", "", 0);
    token.content = match;
    token = state.push("at_close", "a", -1);
  });
}

function slashPlugin(state) {
  return _plugin(state, SLASH_REGEX, (state, match) => {
    let token = state.push("slash_open", "span", 1);
    token.attrPush(["isIconLink", true]);
    token.attrPush(["value", match]);
    token = state.push("slash_close", "span", -1);
  });
}

function emailPlugin(state) {
  return _plugin(state, EMAIL_REGEX, (state, match) => {
    let token = state.push("email_open", "a", 1);
    token.attrPush(["target", "_blank"]);
    token.attrPush(["href", "mailto:" + match]);
    token = state.push("text", "", 0);
    token.content = match;
    token = state.push("email_close", "a", -1);
  });
}

export default React.createClass({
  componentDidMount: function() {
    window.addEventListener('click', this._onClick);
  },

  _onClick(e) {
    let target = e.target, text = target.innerHTML;
    if (text && target.tagName.toLowerCase() === "a" && !target.href) {
      let match = text.match(AT_REGEX);
      if (match && match[0] === text) {
        e.preventDefault();
        let user = UserStore.getUserByName(text.substr(1));
        if (user) Member.showMemberProfile(user.id);
      }
    }
  },

  markdown(value) {
    let renderer = MarkdownIt({
      highlight(str, lang) {
        if (lang && HighLight.getLanguage(lang)) {
          return HighLight.highlight(lang, str).value;
        } else {
          return HighLight.highlightAuto(str).value;
        }
      },
      html: false,
      linkify: true
    }).use(md => {
      md.inline.ruler.before("text", "email", emailPlugin);
    }).use(md => {
      md.inline.ruler.before("text", "at", atPlugin);
    }).use(md => {
      md.inline.ruler.before("text", "slash", slashPlugin);
    });
    return renderer.render(value);
  },

  renderIconLink(value) {
    let root = document.createElement("span");
    root.innerHTML = value;
    let list = root.querySelectorAll("span[isIconLink=true]");
    for (let i = 0; i < list.length; i++) {
      let item = list[i], iconLink;
      let [plugin, arg] = item.getAttribute("value").substr(1).split(":");
      switch (plugin) {
        case "vity":  // TODO
          iconLink = <IconLink type="vity" args={{room: arg, user: "guest"}} />;
          break;
        case "file":  // TODO
          iconLink = <IconLink type="file" args={{id: arg, name: arg}} />;
          break;
        default:
          iconLink = <span>{item.getAttribute("value")}</span>
      }
      React.render(iconLink, item);
    }
    return root.innerHTML;
  },
  
  render() {
    let value = this.markdown(this.props.value);
    value = this.renderIconLink(value);
    return (
      <div className="smart-display">
        <span dangerouslySetInnerHTML={{__html: value}}></span>
      </div>
    );
  }
});
