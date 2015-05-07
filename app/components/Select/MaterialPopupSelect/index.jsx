var React = require('react'),
    MUI = require('material-ui'),
    Paper = MUI.Paper;

require('./style.less');

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    propTypes: {
        controller: React.PropTypes.object,
        onItemSelect: React.PropTypes.func,
        onChange: React.PropTypes.func,
        onAutoComplete: React.PropTypes.func,
        onShow: React.PropTypes.func,
        onHide: React.PropTypes.func,
        onFocus: React.PropTypes.func,
        onFilter: React.PropTypes.func,
        valueAttr: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            valueAttr: "name"
        };
    },

    getInitialState() {
        return {
            visible: false,
            list: [],
            filteredContent: [],
            filteredContentMap: {},
            selectedIndex: 0
        }
    },

    componentDidMount() {

    },

    componentWillReceiveProps(nextProps) {
        // TODO: this following event binding is not recommended
        if (nextProps.controller) {
            var target = nextProps.controller;
            target.props.onBlur = nextProps.onBlur || this._blurListener;
            target.props.onFocus = nextProps.onFocus || this._focusListener;
            target.props.onChange = nextProps.onChange || this._changeListener;
            target.props.onKeyDown = nextProps.onKeyDown || this._keyDownListener;
        }

        var _this = this;
        let listContent = [];
        let listContentMap;

        nextProps.children.forEach(function(child) {
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

        this.setState({
            visible: false,
            list: listContent,
            filteredContent: listContent,
            filteredContentMap: listContentMap,
            selectedIndex: 0
        });
    },

    componentWillUnmount() {
    },

    hide() {
        this.setState({visible: false});
        if (this.props.onHide) {
            this.props.onHide();
        }
    },

    show: function() {
        this.setState({visible: true});
        if (this.props.onShow) {
            this.props.onShow();
        }
    },

    filter(keyword) {
        let lowerCaseKeyword = keyword.toLowerCase();
        let filtered = this.state.list.filter((item) => {
            if (item.type === "group") {
                let filteredOptions = item.content.filter((option) => {
                    return option.data.toLowerCase().indexOf(lowerCaseKeyword) >= 0;
                });
                return filteredOptions.length !== 0;
            } else if (item.type === "option") {
                return item.data.toLowerCase().indexOf(lowerCaseKeyword) >= 0;
            } else {
                return false;
            }
        });
        filtered = filtered.map((item) => {
            if (item.type === "option") {
                return item;
            } else if (item.type === "group") {
                let options = item.content.filter((option) => {
                    return option.data.toLowerCase().indexOf(lowerCaseKeyword) >= 0
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
        if (this.props.onFilter) {
            this.props.onFilter(filteredValues);
        }
        this.setState({filteredContent: filtered, filteredContentMap: filteredContentMap, selectedIndex: 0});
    },

    selectPrevious() {
        let selectedIndex = this.state.selectedIndex;
        if (selectedIndex > 0) {
            selectedIndex = selectedIndex - 1;
        } else {
            selectedIndex = this.state.filteredContentMap.length - 1;
        }
        this.setState({selectedIndex: selectedIndex});
        this._updateScroll(selectedIndex);
    },

    selectNext() {
        var selectedIndex = this.state.selectedIndex;
        if (selectedIndex < this.state.filteredContentMap.length - 1) {
            selectedIndex = selectedIndex + 1;
        } else {
            selectedIndex = 0;
        }
        this.setState({selectedIndex: selectedIndex});
        this._updateScroll(selectedIndex);
    },

    select(index) {
        if (index < 0 || index >= this.state.filteredContentMap.length) {
            return;
        }
        this.setState({selectedIndex: index});
    },

    _doSelect: function() {
        var selectedItem = this.state.filteredContentMap[this.state.selectedIndex];
        if (this.props.onItemSelect) {
            this.props.onItemSelect(selectedItem.value);
        }
        let listContent = this.state.list;
        this.setState({filteredContentMap: this._getListContentMap(listContent), filteredContent: listContent});
    },

    _doSelectAndHide() {
        this._doSelect();
        this.hide();
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
            data: child.props.data || child.props.value || "",
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
            case 27:    // Escape
                event.preventDefault();
                if (event.target.blur) {
                    event.target.blur();
                }
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
    },

    render: function() {
        var styles = {
            popup: {
                zIndex: 10,
                overflowY: "auto",
                maxHeight: "300px",
                background: "white",
                display: this.state.visible ? "block" : "none"
            },
            list: {
                cursor: "text",
                listStyle: "none"
            },
            label: {
                paddingLeft: 10
            }
        };

        // Construct the popup select content
        var listContent = [];
        var filteredContent = this.state.filteredContent;

        if (filteredContent.length === 0) {
            listContent.push(<strong style={styles.label}>No result found.</strong>);
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
                                onMouseDown={() => this._doSelectAndHide()}
                                onMouseOver={() => this.select(currentIndex)}>
                                {item.content[j].content}
                            </li>);
                    }
                    listContent.push(<ul style={styles.list}><strong style={styles.label}>{label}</strong>{groupOptions}</ul>)
                } else if (item.type === "option") {
                    let currentIndex = itemCount++;
                    let className = "mui-menu-item";
                    if (selected === item) {
                        className += " mui-is-selected";
                    }
                    listContent.push(<li className={className} ref={item.value} onMouseDown={() => this._doSelectAndHide()} onMouseOver={() => this.select(currentIndex)}  key={item.value}>{item.content}</li>);
                }
            }
        }

        return (
            <div ref="popup" style={styles.popup} className="select-popup mui-z-depth-5" {...this.props}>
                <ul ref="__list" style={styles.list}>
                    {listContent}
                </ul>
            </div>
        );
    }
});

