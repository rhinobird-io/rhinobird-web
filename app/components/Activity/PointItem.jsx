const React = require("react");
const mui = require("material-ui"), ListItem = mui.ListItem;
const moment = require('moment');
const Avatar = require("../Member").Avatar;
const Flex = require('../Flex');
const Common = require('../Common');

var PointIcon = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render() {
      let iconBgColor = this.props.item.category === 'gain' ? this.context.muiTheme.palette.accent1Color : this.context.muiTheme.palette.primary1Color;
      let iconStyle = {
          height: 40,
          width: 40,
          lineHeight: '40px',
          textAlign: 'center',
          background: iconBgColor,
          fontWeight: 500,
          color: 'white'
      };

      let pointStyle = {
        display: 'inline-block',
        verticalAlign: 'middle',
        lineHeight: 'normal'
      };

      let point = this.props.item.category === 'gain' ? '+' + this.props.item.point: '-' + this.props.item.point;

      return <div style={iconStyle}>
                <div style={pointStyle}>{point}</div>
            </div>
    }
});

module.exports = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.func.isRequired
    },
    render() {
        if (!this.props.item) {
            return null;
        }

        let style = {
            cursor: 'pointer',
            padding: 12,
            transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
        };
        let titleStyle= {
            textOverflow:'ellipsis',
            overflow:'hidden',
            whiteSpace: 'nowrap'
        };


        let time = moment(this.props.item.time);
        let points = this.props.item.point;
        let title = this.props.item.category === 'gain' ? 'You have gained ' + points + ' points from speech ' + this.props.item.title
                                : 'You have used ' + points + ' points to exchange ' + this.props.item.title;

        let itemId = this.props.item.id;
        let path = '';
        if ( itemId.lastIndexOf('exchange_', 0) === 0 ) {
          path = '/platform/activity/prizes?id=' + this.props.item.prizeId;
        } else if ( itemId.lastIndexOf('attendance_', 0) === 0 ) {
          path = '/platform/activity/speeches/' + this.props.item.speechId;
        }
        let canvasColor = this.context.muiTheme.palette.canvasColor;
        let borderColor = 'rgba(0,0,0,0.03)';
        return <Flex.Layout style={style} onClick={() => {this.context.router.transitionTo(path)}}
                            onMouseOver={()=>this.getDOMNode().style.backgroundColor = borderColor}
                            onMouseOut={()=>this.getDOMNode().style.backgroundColor = canvasColor}>
                  <PointIcon item={this.props.item}/>
                    <Flex.Layout vertical style={{marginLeft:12, width: 0}} flex={1}>
                        <Common.Display style={titleStyle} title={title}>{title}</Common.Display>
                        <Common.Display type='caption'>
                            <Flex.Layout justified center>
                                <div><span className='icon-access-time'/> {time.isValid() ? time.format('YYYY/MM/DD HH:mm') : '--:--'}</div>
                            </Flex.Layout>
                        </Common.Display>
                    </Flex.Layout>
               </Flex.Layout>
    }
});
