const React = require("react");
const MUI = require('material-ui');
require('./style.less');
let Gallery = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    getInitialState() {
        return {
            images: this.props.images,
            current: 0
        };
    },
    render() {
        var images = this.state.images,
            content = null,
            showPrevious = true,
            showNext = true;

        if (images && images.length > 0){
            content = <div style={{display: 'table-cell', height: '100%', width: '100%', backgroundSize: 'contain', backgroundImage: 'url('+images[this.state.current]+')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}/>;
        }
        if (this.state.current === 0)
            showPrevious = false;
        if (!this.state.images || this.state.images.length === 0 || this.state.current === this.state.images.length - 1)
            showNext = false;

        let styles = {
            height: 200,
            width: '100%',
            backgroundColor: (images && images.length > 0) ? 'transparent' : this.context.muiTheme.palette.primary3Color,
            display: 'table',
            border: (images && images.length > 0) ? '5px solid' : 'none',
            borderColor: this.context.muiTheme.palette.primary3Color
        };
        return (
            <div style={styles}>
                {showPrevious ?
                    <MUI.IconButton className='previous left' onClick={this.previous} iconStyle={{fontSize: 40}} iconClassName="icon-chevron-left"/>
                    : <MUI.IconButton className="empty left" disabled />}
                {content}
                {showNext ?
                    <MUI.IconButton className='next right' onClick={this.next} iconStyle={{fontSize: 40}} iconClassName="icon-chevron-right"/>
                    : <MUI.IconButton className="empty right" disabled />}
            </div>
        );
    },
    previous(){
        let current = this.state.current;
        current -= 1;
        if (current < 0)
            current = 0;
        this.setState({
            current: current
        });
    },
    next(){
        let current = this.state.current;
        current += 1;
        if (current >= this.state.images.length)
            current = this.state.images.length - 1;
        this.setState({
            current: current
        });
    }

});

module.exports = Gallery;
