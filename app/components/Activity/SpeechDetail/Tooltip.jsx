const React = require("react");
const MUI = require('material-ui');
const Common = require('../../Common');
const Flex = require('../../Flex');
const PerfectScroll = require("../../PerfectScroll");
const UserStore = require('../../../stores/UserStore');
const Member = require('../../Member');
const SmartTimeDisplay = require("../../SmartTimeDisplay");
const Moment = require("moment");

let Item = React.createClass({
    propTypes: {
        sender: React.PropTypes.object.isRequired,
        time: React.PropTypes.string.isRequired,
        message: React.PropTypes.string.isRequired
    },
    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    render() {
        let nameStyle = {
            maxWidth: 250,
            fontSize: "1.1em",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
        };
        return <Flex.Layout vertical justified flex={1} style={{padding: '6px 12px', lineHeight: "1.5em"}}>
                    <Flex.Layout horizontal justified>
                        <div style={nameStyle}><Member.Avatar style={{marginRight: 4}} scale={0.5} member={this.props.sender}/><Member.Name member={this.props.sender}/></div>
                        <div flex={1}>{Moment(this.props.time).format('YYYY-MM-DD HH:mm')}</div>
                    </Flex.Layout>
                    <Common.Display type='body1' style={{wordBreak: 'break-word'}}>{this.props.message}</Common.Display>
                </Flex.Layout>;
    }
});

module.exports = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object,
    },
    render() {
        let comments = this.props.comments;
        if (!comments || comments.length === 0) {
            return null;
        }
        let tooltipStyle = {
            maxHeight: 400,
            display: 'none',
            position: 'absolute',
            right: 48,
            top: 0,
            zIndex: 10,
            width: 300,
            border: `1px solid ${muiTheme.palette.borderColor}`,
            background: 'white',
            padding: 12
        };
        return <div onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}
                    style={{position: 'relative'}}>
                <Common.Link type='body3' style={{textDecoration: 'none'}}>
                    <Flex.Layout center>
                        <MUI.FontIcon className="icon-speaker-notes" style={{fontSize: 16, marginRight: 4}}/>
                        Memo
                    </Flex.Layout>
                </Common.Link>
                <PerfectScroll　ref='tooltip' style={tooltipStyle}>
                <Flex.Layout vertical style={{fontSize: 'smaller'}}>
                    {
                        comments.map(n => <Item key={n.id} sender={UserStore.getUser(n.user_id)} time={n.created_at} message={n.comment}/>)
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