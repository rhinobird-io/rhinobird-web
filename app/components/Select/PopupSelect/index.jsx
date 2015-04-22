var React = require('react'),
    StyleSheet = require('react-style');

require('./style.less');

export default React.createClass({
    propTypes: {
        filter: React.PropTypes.boolean,
        controller: React.PropTypes.object,
        onItemSelected: React.PropTypes.func
    },

    getInitialState: function() {
        var _this = this;

        var listContent = [];
        var listContentMap = [];

        this.props.children.forEach(function(child) {
            var _content = null;
            if (child instanceof Array) {
                _content = _this._parseChildren(child);
            } else if (child instanceof Object) {
                _content = _this._parseChild(child);
            }
            if (_content !== null) {
                listContent = listContent.concat(_content);
            }
        });

        for (var i = 0; i < listContent.length; i++) {
            if (listContent[i].type === "option") {
                listContentMap.push(listContent[i]);
            } else if (listContent[i].type === "group") {
                for (var j = 0; j < listContent[i].content.length; j++) {
                    listContentMap.push(listContent[i].content[j]);
                }
            }
        }

        console.log(listContentMap);
        return {
            visible: false,
            content: listContent,
            filteredContent: listContent,
            filteredContentMap: listContentMap,
            selectedIndex: 0
        }
    },

    componentDidMount: function() {
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.controller !== this.props.controller) {
            var target = nextProps.controller.getDOMNode();
            target.removeEventListener("keydown");
            target.removeEventListener("focus");
            target.removeEventListener("blur");
            target.addEventListener("keydown", this._keyDownListener);
            target.addEventListener("focus", this._focusListener);
            target.addEventListener("blur", this._blurListener);
        }
    },

    hide: function() {
        this.setState({visible: false});
    },

    show: function() {
        this.setState({visible: true});
    },

    filter: function(keyword) {

    },

    selectPrevious: function() {
        if (this.state.selectedIndex > 0) {
            this.setState({selectedIndex: this.state.selectedIndex - 1});
        } else {
            this.setState({selectedIndex: this.state.filteredContentMap.length - 1});
        }
        this._updateScroll();
    },

    selectNext: function() {
        var selectedIndex = this.state.selectedIndex;
        if (selectedIndex < this.state.filteredContentMap.length - 1) {
            this.setState({selectedIndex: selectedIndex + 1});
        } else {
            this.setState({selectedIndex: 0});
        }
        this._updateScroll();
    },

    _updateScroll: function() {
        var popup = this.refs.popup.getDOMNode();
        var selected = this.refs[this.state.filteredContentMap[this.state.selectedIndex].value].getDOMNode();
        //var listOffset = this.refs["__list"].getDOMNode().offsetTop;
        //console.log(this.refs["__list"].getDOMNode().offsetParent);
        if (selected.offsetTop + selected.clientHeight >= popup.clientHeight) {
            popup.scrollTop = selected.offsetTop - popup.clientHeight + selected.clientHeight;
        } else if (selected.offsetTop < popup.clientHeight){
            popup.scrollTop = 0;
        }
    },

    _getOptionGroup: function(child) {
        var _this = this;
        var content = [];
        var label = null;
        child.props.children.forEach(function(option) {
            if (option.type === "option") {
                var _content = _this._getOption(option);
                if (_content !== null) {
                    content.push(_content);
                }
            } else if (option.type === "label") {
                label = option.props.children;
            }
        });

        return {
            type: "group",
            label: label || child.props.label,
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

    _keyDownListener: function(event) {
        var keyCode = event.keyCode;
        switch (keyCode) {
            case 38:
                event.preventDefault();
                this.selectPrevious();
                break;
            case 40:
                event.preventDefault();
                this.selectNext();
                break;
            case 13:
                event.preventDefault();
                break;
            case 27:
                event.preventDefault();
                break;
        }
    },

    _blurListener: function() {
        //this.hide();
    },

    _focusListener: function() {
        this.show();
    },

    render: function() {
        var styles = {
            popup: {
                overflowY: "auto",
                maxHeight: "150px",
                display: this.state.visible ? "block" : "none"
            },
            list: {
                cursor: "pointer",
                listStyle: "none"
            },
            selected: {
                background: "grey"
            },
            normal: {
                background: "transparent"
            }
        };

        var listContent = [];
        var content = this.state.filteredContent;
        var selected = this.state.filteredContentMap[this.state.selectedIndex];

        for (var i = 0; i < content.length; i++) {
            var item = content[i];
            if (item.type === "group") {
                var label = item.label;
                var groupOptions = [];
                for (var j = 0; j < item.content.length; j++) {
                    groupOptions.push(<li ref={item.content[j].value} styles={selected == item.content[j] ? styles.selected : styles.normal}>{item.content[j].content}</li>);
                }
                listContent.push(<ul styles={styles.list}><strong>{label}</strong>{groupOptions}</ul>)
            } else if (item.type === "option") {
                listContent.push(<li ref={item.value}  styles={selected == item ? styles.selected : styles.normal} key={item.value}>{item.content}</li>);
            }
        }

        return (
            <div ref="popup" styles={styles.popup} className="select-popup">
                <ul ref="__list" styles={styles.list}>
                    {listContent}
                </ul>
            </div>
        );
    }
});

