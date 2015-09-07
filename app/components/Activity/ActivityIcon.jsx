const React = require("react");

module.exports = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render(){
        let outStyle = {
            height: 40,
            width: 40,
            lineHeight: '20px',
            display: 'inline-block',
            textAlign: 'center'
        }, topStyle = {
            fontWeight: 500,
            height: '50%',
            backgroundColor: this.props.type === 'L' ? this.context.muiTheme.palette.primary1Color : this.context.muiTheme.palette.accent1Color,
            color: this.context.muiTheme.palette.canvasColor
        }, bottomStyle = {
            height: '50%',
            fontSize: 12,
            backgroundColor: this.props.type === 'L' ? this.context.muiTheme.palette.primary3Color : this.context.muiTheme.palette.accent3Color
        }, leftStyle = {
            width: '40%',
            height: '100%',
            textAlign: 'right',
            display: 'inline-block'
        }, rightStyle = {
            width: '40%',
            height: '100%',
            textAlign: 'left',
            display: 'inline-block'
        }, slashStyle ={
            height: '100%',
            width: '20%',
            fontSize: 14,
            color: 'rgba(0,0,0,0.38)',
            display: 'inline-block'
        };
        return <div style={outStyle}>
            <div style={topStyle}>{this.props.type}</div>
            <div style={bottomStyle}>
                <div style={leftStyle}>{isNaN(this.props.month) ? 'N' : this.props.month}</div>
                <div style={slashStyle}>/</div>
                <div style={rightStyle}>{isNaN(this.props.day) ? 'N' : this.props.day}</div>
            </div>
        </div>
    }
});