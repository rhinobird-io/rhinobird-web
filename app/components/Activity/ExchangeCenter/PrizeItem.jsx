const React = require("react");
const MUI = require('material-ui');
const Flex = require("../../Flex");
const Common = require('../../Common');
const PerfectScroll = require("../../PerfectScroll");
const LoginStore = require('../../../stores/LoginStore');
const Moment = require("moment");
const PrizeStore = require('../../../stores/PrizeStore');
const ActivityAction = require('../../../actions/ActivityAction');
const Gallery = require('../../Resource/Gallery');

module.exports = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.func.isRequired
    },
    render(){
        let prize = this.props.prize;
        if (!prize) {
            return null;
        }
        let styles = {
            iconStyle: {
                color: this.context.muiTheme.palette.textColor,
                fontSize: 20,
                width: 25,
                height: 25,
                padding: 0
            },
            circleStyle: {
                width: "50px",
                height: "50px",
                color: "white",
                position: 'absolute',
                top: 0,
                right: 0,
                borderRadius: "0 0 0 100%",
                backgroundColor: muiTheme.palette.accent1Color
            },
            circleTextStyle: {
                fontSize: "14px",
                verticalAlign: "baseline",
                textAlign: "right",
                marginRight: 10
            },
            priceStyle: {
                fontSize: 24,
                color: '#383838'
            },
            timesStyle: {
                fontSize: 12,
                color: '#909090',
                textAlign: 'right',
                marginRight: 12
            },
            getStyle: {
                width: '100%',
                position: 'relative',
                display: 'block',
                padding: '.6em',
                fontSize: '.875em',
                fontWeight: 'bold',
                textAlign: 'center',
                textTransform: 'uppercase',
                color: 'rgba(0,0,0,0.6)',
                background: '#a7d155',
                borderRadius: '0 0 0 .25em'
            }
        };
        let images = prize.picture_url.split(',');
        return <MUI.Paper style={{flex: "1 1 400px", margin: 20, maxWidth: "50%", whiteSpace:'nowrap', textOverflow:'ellipsis', overflow:'hidden', position: 'relative'}}>
            <Flex.Layout vertical>
                <Gallery images={images}/>
                <Flex.Layout style={{padding: '12px 12px 0 12px'}}>
                    <Flex.Layout vertical flex={1} style={{marginRight: 6}}>
                        <Common.Display type="body2">{prize.name}</Common.Display>
                        <p style={{color: this.context.muiTheme.palette.disabledColor, lineHeight: '1.5em', height: '3em', textOverflow:'ellipsis', overflow:'hidden', whiteSpace: 'normal'}}>{prize.description}</p>
                    </Flex.Layout>
                    <Flex.Layout vertical stretch center aroundJustified style={{width: 80, flexShrink: 0}}>
                        <Flex.Item style={styles.priceStyle}>{prize.price} Pt.</Flex.Item>
                        <Flex.Item style={styles.getStyle}>Get</Flex.Item>
                    </Flex.Layout>
                </Flex.Layout>
                <div style={styles.timesStyle}>Has been exchanged for <p style={{color: 'red', display: 'inline'}}>{prize.exchanged_times}</p> times.</div>
            </Flex.Layout>

        </MUI.Paper>
    }
});
