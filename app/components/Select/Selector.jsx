const React = require('react');

let Selector = React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    propTypes: {
        multiple: React.PropTypes.bool,
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.oneOfType([
                React.PropTypes.array,
                React.PropTypes.string
            ]).isRequired,
            requestChange: React.PropTypes.func.isRequired
        }),
        valueAttr: React.PropTypes.string,
        onSelectChange: React.PropTypes.func,
        selectedStyle: React.PropTypes.object,
        selectedClass: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            valueAttr: "name",
            selectedStyle: {},
            selectedClass: "selected"
        };
    },

    getInitialState() {
        return {
            selected: {},
            children: [],
            multiple: false
        }
    },

    getValueLink(props) {
        return props.valueLink || {
                value: props.value,
                requestChange: props.onChange
            };
    },

    select(id) {
        let selected = {};
        for (let key in this.state.selected) {
            selected[key] = true;
        }

        let selectedValue = null;
        if (this.props.multiple) {
            if (!selected[id]) {
                selected[id] = true;
            } else {
                delete selected[id];
            }
            selectedValue = Object.keys(selected).map((select) => this.state.children[select].value);
        } else {
            for (let key in selected) {
                delete selected[key];
            }
            selected[id] = true;
            selectedValue = this.state.children[id].value;
        }

        this.setState({selected: selected});

        if (this.getValueLink(this.props).requestChange) {
            this.getValueLink(this.props).requestChange(selectedValue);
        }

        if (this.props.onSelectChange) {
            this.props.onSelectChange(selectedValue);
        }
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.children !== this.props.children) {
            let children = nextProps.children;
            let selectedValue = [];
            if (nextProps.value) {
                selectedValue = nextProps.value;
            } else if (nextProps.valueLink) {
                selectedValue = nextProps.valueLink.value;
            }
            let selected = {};

            children = children.map((child, index) => {
                let count = index.toString();
                let value = child.props[nextProps.valueAttr] || count;

                if ((typeof selectedValue === "string" && selectedValue === value) ||
                    (Array.isArray(selectedValue) && selectedValue.indexOf(value) >= 0)) {
                    selected[count] = true;
                }

                return {
                    id: count,
                    value: value,
                    element: child
                };
            });
            this.setState({selected: selected, children: children});
        }
    },

    render: function() {
        let styles = {
            selected: {
                cursor: "pointer",
                padding: "6px 8px",
                verticalAlign: "middle",
                boxSizing: "border-box",
                backgroundColor: this.context.muiTheme.palette.primary1Color
            },
            normal: {
                cursor: "pointer",
                padding: "6px 8px",
                verticalAlign: "middle",
                boxSizing: "border-box",
                backgroundColor: this.context.muiTheme.palette.primary3Color
            }
        };

        let selected = this.state.selected;
        let children = this.state.children.map((child, index) => {
            let count = index.toString();
            return React.cloneElement(child.element, {
                key: count,
                onClick: () => this.select(count),
                className: child.element.props.className + (selected[count] ? " " + this.props.selectedClass : ""),
                style: selected[count] ? styles.selected : styles.normal
            });
        });

        return (
            <div>{children}</div>
        );
    }
});

module.exports = Selector;