var React = require('react');

require('./style.less');

export default React.createClass({
    propTypes: {
        controller: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            visible: false
        }
    },

    componentDidMount: function() {
        this._parse();
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.controller !== this.props.controller) {
            nextProps.controller.getDOMNode().addEventListener("keydown", this._keyDownListener);
        }
    },

    _getOptionGroup: function(child) {
        var _this = this;
        var content = [];
        child.props.children.forEach(function(option) {
            if (option.type === "option") {
                var _content = _this._getOption(option);
                if (_content !== null) {
                    content.push(_content);
                }
            }
        });

        return {
            type: "group",
            label: child.props.label || "",
            content: content
        }
    },

    _getOption: function(child) {
        return {
            type: "option",
            value: child.props.value || child.props.children,
            content: child.props.children
        };
    },

    _parseChild: function(child) {
        if (typeof child === "object") {
            if (child.type === "optgroup") {
                return this._getOptionGroup(child);
            } else if (child.type === "option") {
                return this._getOption(child);
            }
        }
        return null;
    },

    _parseChildren: function(children) {
        var _this = this;
        var content = [];
        children.forEach(function(child) {
            if (child instanceof Object) {
                var _content = _this._parseChild(child);
                if (_content !== null) {
                    content.push(_content);
                }
            }
        });
        return content;
    },

    _parse: function() {
        console.log(this.props.children);
        var _this = this;
        var content = [];
        this.props.children.forEach(function(child) {
            var _content = null;
            if (child instanceof Array) {
                _content = _this._parseChildren(child);
            } else if (child instanceof Object) {
                _content = _this._parseChild(child);
            }
            if (_content !== null) {
                content = content.concat(_content);
            }
        });
        console.log(content);
    },

    _keyDownListener: function(event) {
        var keyCode = event.keyCode;
        switch (keyCode) {
            case 38:
                event.preventDefault();
                break;
            case 40:
                event.preventDefault();
                break;
            case 13:
                event.preventDefault();
                break;
            case 27:
                event.preventDefault();
                break;
        }
    },

    render: function() {
        return (
            <div className="select-popup">
                {this.props.children}
            </div>
        );
    }
});

