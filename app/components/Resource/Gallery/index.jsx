const React = require("react");
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

        return (
            <div style={{height: 200, width: '100%', backgroundColor: this.context.muiTheme.palette.primary3Color, display: 'table'}}>
                {showPrevious ? <a className='previous left icon-chevron-left' href="#" onClick={this.previous}></a> : <a className="empty left" href="#"></a>}
                {content}
                {showNext ? <a className='next right icon-chevron-right' href="#" onClick={this.next}></a> : <a className="empty right" href="#"></a>}
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
