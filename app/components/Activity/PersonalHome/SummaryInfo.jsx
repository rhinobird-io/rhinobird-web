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
        let target = '#' + this.props.text;
        return <Common.Link style={outStyle} href={target} title={this.props.title}>
            <strong style={numberStyle}>
                {this.props.number}
            </strong>
            <span style={textStyle}>
                {this.props.text}
            </span>
            </Common.Link>
    }
});

