var React = require('react'),
    StyleSheet = require('react-style'),
    MUI = require('material-ui'),
    Paper = MUI.Paper;

require('./style.less');

export default React.createClass({
    propTypes: {
        filter: React.PropTypes.bool,
        controller: React.PropTypes.object,
        onItemSelect: React.PropTypes.func,
        onChange: React.PropTypes.func,
        onAutoComplete: React.PropTypes.func,
        onFocus: React.PropTypes.func
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

        listContentMap = this._getListContentMap(listContent);

        return {
            visible: false,
            list: listContent,
            filteredContent: listContent,
            filteredContentMap: listContentMap,
            selectedIndex: 0
        }
    },

    componentDidMount: function() {
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.controller) {
            var target = nextProps.controller;
            target.props.onBlur = this._blurListener;
            target.props.onFocus = this._focusListener;
            target.props.onChange = this._changeListener;
            target.props.onKeyDown = this._keyDownListener;
        }
    },

    componentWillUnmount() {
    },

    hide() {
        this.setState({visible: false});
    },

    show: function() {
        this.setState({visible: true});
    },

    filter(keyword) {
        console.log(keyword);
        let filtered = this.state.list.filter((item) => {
            if (item.type === "group") {
                let filteredOptions = item.content.filter((option) => {
                    return option.value.indexOf(keyword) >= 0;
                });
                return filteredOptions.length !== 0;
            } else if (item.type === "option") {
                return item.value.indexOf(keyword) >= 0;
            } else {
                return false;
            }
        });
        filtered = filtered.map((item) => {
            if (item.type === "option") {
                return item;
            } else if (item.type === "group") {
                let options = item.content.filter((option) => {
                    return option.value.indexOf(keyword) >= 0
                });
                var newItem = {};
                newItem.type = item.type;
                newItem.label = item.label;
                newItem.content = options;
                return newItem;
            }
        });
        let filteredContentMap = this._getListContentMap(filtered);
        let filteredValues = filteredContentMap.map((item) => item.value);
        if (this.props.onChange) {
            this.props.onChange(filteredValues);
        }
        this.setState({filteredContent: filtered, filteredContentMap: filteredContentMap});
    },

    selectPrevious: function() {
        let selectedIndex = this.state.selectedIndex;
        if (selectedIndex > 0) {
            selectedIndex = selectedIndex - 1;
        } else {
            selectedIndex = this.state.filteredContentMap.length - 1;
        }
        this.setState({selectedIndex: selectedIndex});
        this._updateScroll(selectedIndex);
    },

    selectNext: function() {
        var selectedIndex = this.state.selectedIndex;
        if (selectedIndex < this.state.filteredContentMap.length - 1) {
            selectedIndex = selectedIndex + 1;
        } else {
            selectedIndex = 0;
        }
        this.setState({selectedIndex: selectedIndex});
        this._updateScroll(selectedIndex);
    },

    select: function(index) {
        if (index < 0 || index >= this.state.filteredContentMap.length) {
            return;
        }
        this.setState({selectedIndex: index});
    },

    _doSelect: function() {
        var selectedItem = this.state.filteredContentMap[this.state.selectedIndex];
        this.hide();
        if (this.props.onItemSelect) {
            this.props.onItemSelect(selectedItem.value);
        }
        console.log(this.props.controller.props.onFocus);
        let listContent = this.state.list;
        this.setState({filteredContentMap: this._getListContentMap(listContent), filteredContent: listContent});
    },

    _getListContentMap: function(listContent) {
        let listContentMap = [];
        for (let i = 0; i < listContent.length; i++) {
            if (listContent[i].type === "option") {
                listContentMap.push(listContent[i]);
            } else if (listContent[i].type === "group") {
                for (var j = 0; j < listContent[i].content.length; j++) {
                    listContentMap.push(listContent[i].content[j]);
                }
            }
        }
        return listContentMap;
    },

    _updateScroll: function(selectedIndex) {
        var popup = this.refs.popup.getDOMNode();
        var selected = this.refs[this.state.filteredContentMap[selectedIndex].value].getDOMNode();
        //var listOffset = this.refs["__list"].getDOMNode().offsetTop;
        //console.log(this.refs["__list"].getDOMNode().offsetParent);
        console.log(selected.offsetTop);
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
            case 13:    // Enter
                event.preventDefault();
                this._doSelect();
                break;
            case 27:
                event.preventDefault();
                break;
            case 9:     // Tab
                event.preventDefault();
                let filteredContentMap = this.state.filteredContentMap;
                let filteredValues = filteredContentMap.map((item) => item.value);
                if (this.props.onAutoComplete) {
                    this.props.onAutoComplete(filteredValues);
                }
                break;
            default:
                break;
        }
    },

    _changeListener(event) {
        this.filter(event.target.value);
    },

    _blurListener() {
        this.hide();
    },

    _focusListener() {
        this.show();
        if (this.props.onFocus) {
            this.props.onFocus();
        }
    },

    render: function() {
        var styles = {
            popup: {
                overflowY: "auto",
                maxHeight: "500px",
                display: this.state.visible ? "block" : "none"
            },
            list: {
                cursor: "pointer",
                listStyle: "none"
            },
            selected: {
                background: "grey"
            },
            label: {
                paddingLeft: 10
            }
        };

        // Construct the popup select content
        var listContent = [];
        var filteredContent = this.state.filteredContent;

        if (filteredContent.length === 0) {
            listContent.push(<strong styles={styles.label}>No result found.</strong>);
        } else {
            var selected = this.state.filteredContentMap[this.state.selectedIndex];
            var itemCount = 0;
            for (var i = 0; i < filteredContent.length; i++) {
                var item = filteredContent[i];
                if (item.type === "group") {
                    let label = item.label;
                    let groupOptions = [];
                    for (let j = 0; j < item.content.length; j++) {
                        let currentIndex = itemCount++;
                        let className = "mui-menu-item";
                        if (selected === item.content[j]) {
                            className += " mui-is-selected";
                        }
                        groupOptions.push(
                            <li
                                className={className}
                                ref={item.content[j].value}
                                onMouseDown={() => this._doSelect(currentIndex)}
                                onMouseOver={() => this.select(currentIndex)}>
                                {item.content[j].content}
                            </li>);
                    }
                    listContent.push(<ul styles={styles.list}><strong styles={styles.label}>{label}</strong>{groupOptions}</ul>)
                } else if (item.type === "option") {
                    let currentIndex = itemCount++;
                    let className = "mui-menu-item";
                    if (selected === item) {
                        className += " mui-is-selected";
                    }
                    listContent.push(<li className={className} ref={item.value} onMouseDown={() => this._doSelect(currentIndex)} onMouseOver={() => this.select(currentIndex)}  key={item.value}>{item.content}</li>);
                }
            }
        }

        return (
            <div ref="popup" styles={styles.popup} className="select-popup mui-z-depth-5">
                <ul ref="__list" styles={styles.list}>
                    {listContent}
                </ul>
            </div>
        );
    }
});

