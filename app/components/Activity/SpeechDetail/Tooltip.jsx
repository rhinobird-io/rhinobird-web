const React = require("react");
const MUI = require('material-ui');
const Common = require('../../Common');
const Flex = require('../../Flex');
const PerfectScroll = require("../../PerfectScroll");

module.exports = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object,
    },
    render() {
        let memo = this.props.memo;
        if (!memo) {
            return null;
        }
        let tooltipStyle = {
            maxHeight: 400,
            display: 'none',
            position: 'absolute',
            right: 24,
            top: 0,
            zIndex: 10,
            width: 300,
            border: `1px solid ${muiTheme.palette.borderColor}`,
            background: 'white',
            padding: 12
        };
        return <div onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}
                    style={{position: 'relative'}}>
                <Common.Link type='body3'>Memo</Common.Link>
                <PerfectScroll　ref='tooltip' style={tooltipStyle}>
                <Flex.Layout vertical>
                    {
                        memo.split('||').map(e => <Flex.Layout><li><Common.Display style={{display: 'inline'}} type='body2'>{e}</Common.Display></li></Flex.Layout>)
                    }

                </Flex.Layout>
                </PerfectScroll>
            </div>

    },
    _onMouseEnter() {
        this.refs.tooltip.getDOMNode().style.display = '';
    },
    _onMouseLeave() {
        this.refs.tooltip.getDOMNode().style.display = 'none';
    }
});