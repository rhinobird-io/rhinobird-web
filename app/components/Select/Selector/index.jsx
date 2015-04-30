const React = require('react');

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

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
        let selected = this.state.selected;
        let selectedValue;
        if (this.props.multiple) {
            if (!selected[id]) {
                selected[id] = true;
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
            let selectedValue = nextProps.value || nextProps.valueLink.value;
            let selected = {};

            children = children.map((child, index) => {
                let count = index.toString();
                let value = child.props[nextProps.valueAttr] || count;

                if ((typeof selectedValue === "string" && selectedValue === value) ||
                    (typeof selectedValue === "array" && selectedValue.indexOf(value) >= 0)) {
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
            selected: this.props.selectedStyle
        };

        let selected = this.state.selected;
        let children = this.state.children.map((child, index) => {
            let count = index.toString();
            return React.cloneElement(child.element, {
                key: count,
                onClick: () => this.select(index),
                className: child.element.props.className + (selected[count] ? " " + this.props.selectedClass : ""),
                style: selected[count] ? styles.selected : undefined
            });
        });

        return (
            <div>{children}</div>
        );
    }
})

