"use strict";

let React = require("react");
let HighLight = require("highlight.js");
let Marked = require("marked");

export default React.createClass({
  getInitialState: function() {
    return {};
  },

  stripTags(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  },

  markdown(value) {
    value = value.replace(/\n\n(\n+)/g, "\n\n<brs>$1</brs>\n\n");
    Marked.setOptions({
      highlight(code) {
        return HighLight.highlightAuto(code).value;
      }
    });
    return Marked(value).replace(/\n<brs>(\n+)<\/brs>\n/g, "$1")
      .replace(/\n?(<(pre|li|ul|ol|blockquote|(h\d\ .*))>)\n?/g, "$1")
      .replace(/\n?(<\/(pre|li|ul|ol|blockquote)>)\n?/g, "$1");
  },

  _reserve(value, regex, tag) {
    this.state[tag] = (value.match(regex) || []).map(t => t.replace(regex, "$2"))
    return value.replace(regex, "$1<" + tag + "></" + tag + ">");
  },

  reserveAt(value) {
    let regex = /(^|\s)(@\w+)/g;
    return this._reserve(value, regex, "at");
  },

  reserveSlash(value) {
    let regex = /(^|\s)(\/([\w\.-]+)(:(\S+))?)/g;
    return this._reserve(value, regex, "slash");
  },

  reserveEmail(value) {
    let regex = /(^|\s)((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))/g;
    return this._reserve(value, regex, "email");
  },

  _insert(value, tag, transform) {
    let root = document.createElement("span");
    root.innerHTML = value;
    let list = root.querySelector(tag) || [];
    for (let i = 0; i < list.length; i++) {
      let item = this.state[tag][i];
      root.replaceChild(transform(item), list[i]);
    }
    return root.innerHTML;
  },

  linkElement(url, text) {
    return <a target="_blank" href={url}>{text}</a>;
  },

  insertAt(value) {
    return this._insert(value, "at", item => {
      let url = "#/member/" + item.substr(1);
      return this.linkElement(url, item);
    });
  },

  insertSlash(value) {
    return this._insert(value, "slash", item => {
      let tokens = item.substr(1).split(":");
      let plugin = tokens[0].toLowerCase();
      let arg = tokens[1] || "";
      if (plugin === "vity") {
        let user = "guest";  // TODO
        let url = "https://46.137.243.49:5151/index.html#" + arg + "@" + user;
        return this.linkElement(url, item);
      } else if (plugin === "file") {
        // TODO
        // return <FileDisplay fileId={arg}></FileDisplay>;
        return <span>Not implemented</span>;
      } else {
        let url = "/" + plugin + "/cmd/" + arg;
        return this.linkElement(url, item);
      }
    });
  },

  insertEmail(value) {
    return this._insert(value, "email", item => {
      let url = "mailto:" + item;
      return this.linkElement(url, item);
    });
  },

  render() {
    let value = this.props.value;
    let handlers = [
      this.stripTags, this.reserveAt, this.reserveSlash, this.reserveEmail,
      this.markdown, this.insertAt, this.insertSlash, this.insertEmail
    ];
    for (let i = 0; i < handlers.length; i++) {
      value = handlers[i](value);
    }
    return (
      <div className="smart-display">
        <span dangerouslySetInnerHTML={{__html: value}}></span>
      </div>
    );
  }
});
