const React = require('react');
const Flex = require('../Flex');
const Moment = require('moment');
const Popup = require('../Popup');
const MUI = require('material-ui');
const Link = require('react-router').Link;
const Display = require('../Common').Display;
const UserStore = require('../../stores/UserStore');
const LoginStore = require('../../stores/LoginStore');
const Colors = require('material-ui/lib/styles/colors.js');
const CalendarStore = require('../../stores/CalendarStore');
const CalendarActions = require('../../actions/CalendarActions');
const CalendarView = require('../Calendar/CommonComponents').CalendarView;

require('./style.less');

let AllEvents = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    componentDidMount() {
        CalendarStore.addChangeListener(this._onChange);
        CalendarActions.receive();
    },

    componentWillUnmount() {

    },

    getInitialState() {
        return {
            events: [],
            createEventPopupPos: 'r'
        }
    },

    render() {
        return (
            <Flex.Layout vertical style={{height: "100%", WebkitUserSelect: "none", userSelect: "none"}}>
                <CalendarView
                    ref="calendar"
                    date={new Date()}
                    exclusive={false}
                    data={this.state.events}
                    rangeContent={this._rangeContent}
                    onRangeCreate={this._showCreateEventPopup}
                    onRangeCancel={this._dismissCreateEventPopup}
                    onRangeClicked={this._showEventDetailPopup}
                    awayExceptions={() => this.refs.createEventPopup.getDOMNode()} />
                {this._getCreateEventPopup()}
                <Link to="create-event">
                    <MUI.FloatingActionButton
                        style={{position: "fixed", bottom: 24, right: 24}}
                        iconClassName="icon-add" />
                </Link>
            </Flex.Layout>
        )
    },

    _onChange() {
        this.setState({
            events: CalendarStore.getAll()
        })
    },

    _rangeContent(range) {
        let creatorId = range.creator_id;
        let user = UserStore.getUser(creatorId);
        let styles = {
            wrapper: {
                height: "100%",
                padding: 6
            },
            timeRange: {
                fontSize: "0.8em",
                fontWeight: 500
            }
        };

        let innerContent = [];
        let timeRange = `${Moment(range.from_time || range.fromTime).format("h:mm a")} ~ ${Moment(range.to_time || range.toTime).format("h:mm a")}`;

        innerContent.push(<div key="range" style={styles.timeRange}>{timeRange}</div>);

        let now = new Date();
        let toTime = new Date(range.to_time);
        if (user) {
            if (LoginStore.getUser().id === creatorId) {
                let background = null;
                if (toTime < now) {
                    background = Colors.pink100;
                } else {
                    background = this.context.muiTheme.palette.accent3Color;
                }
                styles.wrapper.backgroundColor = background;
                //styles.wrapper.border = "1px solid " + this.context.muiTheme.palette.accent2Color;
                innerContent.push(<div>{range.title}</div>)
            } else {
                let background = null;
                if (toTime < now) {
                    background = Colors.cyan100;
                } else {
                    background = this.context.muiTheme.palette.primary1Color;
                }
                styles.wrapper.backgroundColor = background;
                //styles.wrapper.border = "1px solid " + this.context.muiTheme.palette.primary2Color;

            }
        }

        return (
            <Flex.Layout vertical style={styles.wrapper}>
                {innerContent}
            </Flex.Layout>
        );
    },

    _getCreateEventPopup() {
        let className = "event-popup";
        if (this.state.createEventPopupPos === 'r') {
            className += " right";
        } else {
            className += " left";
        }

        return (
            <Popup
                position="none"
                ref="createEventPopup"
                selfAlignOrigin="lt"
                relatedAlignOrigin="rt"
                className={className}
                style={{overflow: "visible !important"}}>
                <div style={{minWidth: 250}}>
                    <h3 style={{padding: "24px 24px 20px 24px"}}>
                        <Display type="headline">Create </Display>
                    </h3>
                </div>
            </Popup>
        );
    },

    _showCreateEventPopup(rect, range) {
        let createEventPopup = this.refs.createEventPopup;
        let position = 'r';

        let newRect = {
            left: rect.left,
            width: rect.width + 10,
            top: rect.top - (createEventPopup.getDOMNode().clientHeight - rect.height) / 2,
            height: rect.height
        };

        if (createEventPopup.getDOMNode().clientWidth > window.innerWidth - rect.right) {
            position = 'l';
            newRect.width = rect.width;
            newRect.left = rect.left - 10;
        }

        this.setState({
            createEventPopupPos: position
        }, () => {
            createEventPopup.setRelatedTo(newRect);
            createEventPopup.show();
        });
    },

    _dismissCreateEventPopup() {
        this.refs.createEventPopup.dismiss();
    },

    _showEventDetailPopup(rect, range) {
        if (range.userId !== LoginStore.getUser().id) {
            return;
        }
    }
});

module.exports = AllEvents;
