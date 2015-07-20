const React = require("react");
const MUI = require('material-ui');
const Picture = require('./../../Picture/index');
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
            thumbnails = [],
            showPrevious = true,
            showNext = true;

        if (images && images.length > 0){
            content = <Picture src={images[this.state.current]}/>;
            thumbnails = images.map((image) => (<Picture style={{height: 40, width: 40, border: `1px solid ${image === images[this.state.current] ? '#E4393C' : this.context.muiTheme.palette.borderColor}`, margin: '0 2px'}} src={image}/>));
        }
        if (this.state.current === 0)
            showPrevious = false;
        if (!this.state.images || this.state.images.length === 0 || this.state.current === this.state.images.length - 1)
            showNext = false;

        let styles = {
            height: 200,
            width: '100%',
            display: 'flex',
            paddingBottom: 5,
            backgroundColor: (images && images.length > 0) ? 'transparent' : this.context.muiTheme.palette.primary3Color
        };
        let thumbsStyles = {
            height: 50,
            width: '100%',
            display: 'flex',
            overflow: 'hidden'
        };
        return (
            <div>
                <div style={styles}>
                    {showPrevious ?
                        <MUI.IconButton className='previous left' onClick={this.previous} iconStyle={{fontSize: 40, left: -12}} iconClassName="icon-chevron-left"/>
                        : <MUI.IconButton className="empty left" disabled />}
                    {content}
                    {showNext ?
                        <MUI.IconButton className='next right' onClick={this.next} iconStyle={{fontSize: 40}} iconClassName="icon-chevron-right"/>
                        : <MUI.IconButton className="empty right" disabled />}
                </div>
                <div style={thumbsStyles}>
                    {thumbnails}
                </div>
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
