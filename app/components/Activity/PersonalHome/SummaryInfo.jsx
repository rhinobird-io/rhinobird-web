import $ from 'jquery';
const React = require("react");
const Common = require('../../Common');

module.exports = React.createClass({

    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render(){
        let outStyle = {width: 50, height: 50, textAlign: 'center', margin: 2, textDecoration: 'none'};
        let numberStyle = {display: 'block', fontWeight: 'bold', fontSize: 20};
        let textStyle = {color: '#767676', fontSize: 13};
        return <Common.Link style={outStyle} onClick={this.scroll} title={this.props.title}>
            <strong style={numberStyle}>
                {this.props.number}
            </strong>
            <span style={textStyle}>
                {this.props.text}
            </span>
            </Common.Link>
    },
    scroll() {
        $('#scrollContainer').animate({
            scrollTop: $('#' + this.props.text).offset().top - $('#scrollContainer').offset().top + $('#scrollContainer').scrollTop()
        }, 1000);
    }
});

