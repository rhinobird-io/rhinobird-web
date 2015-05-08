"use strict";

require("./markdown.css");
require("../../../node_modules/highlight.js/styles/default.css");

let React = require("react/addons");
let HighLight = require("highlight.js");
let MarkdownIt = require("markdown-it");
let Emoji = require("markdown-it-emoji");
let EmojiPng = require.context("../../../node_modules/emojify.js/src/images/emoji", false, /png$/);

let IconLink = require("../IconLink");
let Member = require("../Member");
let LoginStore = require("../../stores/LoginStore");
let UserStore = require("../../stores/UserStore");

const AT_REGEX = /^\s*(@[\w\.-]+)/;
const SLASH_REGEX = /^\s*(#[\w\.-]+(:\S+)?)/;

function _plugin(state, regex, trans) {
  let text = state.src.substr(state.pos);
  if (text.search(regex) < 0) {
    return false;
  } else {
    let start = text.search(/\S/), token;
    if (start > 0) {
      // skip leading whitespaces
      token = state.push("text", "", 0);
      token.content = text.substr(0, start);
    } else if (start === 0) {
      // then the previous character must be whitespace
      if (state.pos > 0 && state.src.charAt(state.pos - 1).search(/\S/) === 0) {
        return false;
      }
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

const SmartDisplay = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  componentDidMount: function() {
    window.addEventListener('click', this._onClick);
  },

  _onClick(e) {
    let target = e.target, text = target.innerHTML;
    // A link Element without `href` attribute, like <a>@someone</a>
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
    let md = MarkdownIt({
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
      md.inline.ruler.before("text", "at", atPlugin);
    }).use(md => {
      md.inline.ruler.before("text", "slash", slashPlugin);
    }).use(Emoji);

    md.renderer.rules.emoji = (token, i) => {
      let markup = token[i].markup;
      if (EmojiPng.keys().includes("./" + markup + ".png")) {
        return '<img class="emoji" alt="$" src="$"></img>'
          .replace("$", token[i].content)
          .replace("$", EmojiPng("./" + markup + ".png"));
      } else {
        return ":" + markup + ":";
      }
    };
    return md.render(value);
  },

  renderIconLink(value) {
    let root = document.createElement("span");
    root.innerHTML = value;
    let list = root.querySelectorAll("span[isIconLink=true]");
    for (let i = 0; i < list.length; i++) {
      let item = list[i], iconLink;
      let [plugin, arg] = item.getAttribute("value").substr(1).split(":");
      switch (plugin) {
        case "vity":
          iconLink = <IconLink type="vity" args={{room: arg, user: LoginStore.getUser().name}} />;
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

  removeNewline(value) {
    return value.replace(/\n?(<(p|pre|blockquote|ol|ul|li|(h\d))\n?>)/g, "$1")
        .replace(/\n?(<\/(blockquote|ol|ul|li)>)/g, "$1");
  },
  
  render() {
    let value = this.markdown(this.props.value);
    value = this.renderIconLink(value);
    value = this.removeNewline(value);
    return (
      <div className="smart-display markdown-body">
        <span dangerouslySetInnerHTML={{__html: value}}></span>
      </div>
    );
  }
});

export default SmartDisplay;
