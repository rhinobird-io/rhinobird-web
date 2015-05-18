
require("./markdown.css");
require("../../../../node_modules/highlight.js/styles/default.css");
require('./highlight-material.less');
let HighLight = require("highlight.js");
let MarkdownIt = require("markdown-it");
let Emoji = require("markdown-it-emoji");
let EmojiPng = require.context("../../../../node_modules/emojify.js/src/images/emoji", false, /png$/);
let commands = require('../commands');
import UserStore from '../../../stores/UserStore';


const AT_REGEX = /^\s*(@[\w\.-]+)/;
const COMMAND_REGEX = /^\s*(#[\w\.-]+(:\S+)?)/;

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
        let token = state.push("at", '', 0);
        token.content = match;
    });
}

function commandPlugin(state) {
    return _plugin(state, COMMAND_REGEX, (state, match) => {
        let token = state.push("command", "", 0);
        token.content = match;
    });
}

let emojifyDefs = {};
EmojiPng.keys().map(k => {
    let n = k.substr("./".length, k.length - "./.png".length);
    // If `md.renderer.rules.emoji` is not defined, we need to assign the
    // unicode of emoji to `emojifyDefs[n]`.
    emojifyDefs[n] = n;
});

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
    md.inline.ruler.before("text", "command", commandPlugin);
}).use(Emoji, {defs: emojifyDefs});

md.renderer.rules.emoji = (token, i) => {
    let markup = token[i].markup;
    if (EmojiPng.keys().includes("./" + markup + ".png")) {
        return '<img class="emoji" alt="' + token[i].content + '" src="' +
            EmojiPng("./" + markup + ".png") + '"></img>';
    } else {
        return ":" + markup + ":";
    }
};

md.renderer.rules.command = (token, i) => {
    let content = token[i].content;
    let match = content.match(/#(.*):(.*)/);
    if(!match){
        return content;
    }
    let [,commandName, value] = match;
    let command = commands.getCommand(commandName);
    if(!command) {
        return content;
    } else {
        return command.render(value);
    }
};

md.renderer.rules.at = (token, i) => {
    let content = token[i].content;
    let username = content.substr(1);
    let user = UserStore.getUserByName(username);
    if(!user){
        return content;
    }
    else {
        return `<a class="member-at">${content}</a>`
    }
};

module.exports = md;
