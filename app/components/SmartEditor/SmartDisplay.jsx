"use strict";


let React = require("react/addons");

let IconLink = require("../IconLink");
let Member = require("../Member");
let LoginStore = require("../../stores/LoginStore");
let UserStore = require("../../stores/UserStore");

let markdown = require('./markdown');


const SmartDisplay = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  componentDidMount() {
    let list = this.getDOMNode().querySelectorAll("a[isAtUser]");
    for (let i = 0; i < list.length; i++) {
      list[i].addEventListener("click", this._onClick);
    }
  },

  _onClick(e) {
    e.preventDefault();
    let user = UserStore.getUserByName(e.target.innerHTML.substr(1));
    if (user) Member.showMemberProfile(user.id);
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
    let value = markdown.render(this.props.value);
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
