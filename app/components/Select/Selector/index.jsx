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
            selectedStyle: {
                fontWeight: "bold"
            }
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

    selectPrevious() {

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
        this.getValueLink(this.props).requestChange(selectedValue);
        if (this.props.onSelectChange) {
            this.props.onSelectChange(selectedValue);
        }
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.children !== this.props.children) {
            let children = nextProps.children;
            children = children.map((child, index) => {
                let count = index.toString();
                return {
                    id: count,
                    value: child.props[nextProps.valueAttr] || count,
                    element: child
                };
            });
            this.setState({children: children});
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
                style: selected[count] ? styles.selected : undefined,
                onClick: () => this.select(index)
            });
        });


        return (
            <div>{children}</div>
        );
    }
})

