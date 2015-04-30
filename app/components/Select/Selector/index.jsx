const React = require('react');

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    propTypes: {
        multiple: React.PropTypes.bool,
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.array.isRequired,
            requestChange: React.PropTypes.func.isRequired
        }),
        valueAttr: React.PropTypes.string,
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
        if (this.props.multiple) {
            if (!selected[id]) {
                selected[id] = true;
            }
        } else {
            for (let key in selected) {
                delete selected[key];
            }
            selected[id] = true;
        }
        this.setState({selected: selected});
        let selectedValues = Object.keys(selected).map((select) => this.state.children[select].value);
        this.getValueLink(this.props).requestChange(selectedValues);
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

