const React = require('react');
const Flex = require('../Flex');
const WeekView = require('../Calendar/CommonComponents').WeekView;

let ResourceDetailContent = React.createClass({
    propTypes: {
        resource: React.PropTypes.object
    },

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            resource: {}
        }
    },

    render() {
        let {
            resource
        } = this.props;

        let styles = {
            action: {
                fontSize: "2em",
                padding: 12,
                minHeight: 60,
                backgroundColor: this.context.muiTheme.palette.primary1Color
            }
        };

        let actions = <Flex.Layout flex={1} center horizontal style={styles.action}>{resource.name}</Flex.Layout>;
        return (
            <Flex.Layout vertical style={{height: "100%"}}>
                {actions}
                <WeekView date={new Date()}/>
            </Flex.Layout>
        );
    }
});

module.exports = ResourceDetailContent;