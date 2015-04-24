'use strict';

const mui = require('material-ui');
const React = require('react');

function textbox(locals) {

    return <mui.TextField floatingLabelText={locals.label}
                          autoFocus={locals.autoFocus}
                          name={locals.name}
                          disabled={locals.disabled}
                          value={locals.value}
                          onChange={(evt)=>{locals.onChange(evt.target.value)}}
                          errorText={locals.hasError?locals.error || 'This field is invalid': undefined }
                          hintText={locals.help}
                          type={locals.type}
        />;

}

function checkbox() {
    throw new Error('selects are not (yet) supported');
}

function select() {
    throw new Error('selects are not (yet) supported');
}

function radio() {
    throw new Error('radios are not (yet) supported');
}

function list() {
    throw new Error('lists are not (yet) supported');
}

function struct(locals) {

    var rows = locals.order.map(function (name) {
        return locals.inputs.hasOwnProperty(name) ? locals.inputs[name] : name;
    });

    return <div>{rows}</div>
}

module.exports = {
    name: 'material-ui',
    textbox: textbox,
    checkbox: checkbox,
    select: select,
    radio: radio,
    struct: struct,
    list: list
};
