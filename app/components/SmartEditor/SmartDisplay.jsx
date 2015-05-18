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
    let list = this.getDOMNode().querySelectorAll("a.member-at");
    for (let i = 0; i < list.length; i++) {
      list[i].addEventListener("click", this._onClick);
    }
  },

  _onClick(e) {
    e.preventDefault();
    let user = UserStore.getUserByName(e.target.innerHTML.substr(1));
    if (user) Member.showMemberProfile(user.id);
  },

  removeNewline(value) {
    return value.replace(/\n?(<(p|pre|blockquote|ol|ul|li|(h\d))\n?>)/g, "$1")
        .replace(/\n?(<\/(blockquote|ol|ul|li)>)/g, "$1");
  },
  
  render() {
    let value = markdown.render(this.props.value);
    value = this.removeNewline(value);
    return (
      <div className="smart-display markdown-body" style={this.props.style}>
        <span dangerouslySetInnerHTML={{__html: value}}></span>
      </div>
    );
  }
});

export default SmartDisplay;
