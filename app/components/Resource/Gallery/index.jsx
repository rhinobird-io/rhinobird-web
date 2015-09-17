const React = require("react");
const MUI = require('material-ui');
const Picture = require('./../../Picture/index');
const Flex = require("../../Flex/index");
require('./style.less');

let picWidth = 40,
    border = 1,
    margin = 2,
    times = 0;
let Gallery = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            current: 0,
            view: 0,
            ready: false,
            width: 0
        };
    },
    componentDidMount: function () {
        this.setState({
            ready: true,
            width: this.refs.thumbsContainer.getDOMNode().offsetWidth
        });
    },
    render: function () {
        var images = this.props.images,
            content = null,
            thumbnails = [],
            showPrevious = true,
            showNext = true,
            _this = this,
            hasImage = images && images.length > 0;

        if (hasImage){
            content = <Picture src={images[this.state.current]}/>;
            thumbnails = images.map((image) => (
                <Picture style={{height: 40, width: picWidth,
                            border: `${border}px solid ${image === images[this.state.current] ? '#E4393C' : this.context.muiTheme.palette.borderColor}`,
                            margin: `0 ${margin}px`}}
                         src={image} onClick={{}} onHover={_this.hoverThumbnail}/>
            ));
        }

        if (this.state.view <= 0)
            showPrevious = false;
        if (this.state.ready) {
            let width = this.state.width;
            let count = Math.floor(width / (picWidth + 2 * border + margin));
            if (!images || images.length === 0 || this.state.view >= images.length - count)
                showNext = false;
        }

        let showSwitch = showPrevious || showNext;
        let styles = {
            content: {
                height: 200,
                width: '100%',
                display: 'flex',
                paddingBottom: 5,
                cursor: 'pointer',
                backgroundColor: hasImage ? 'transparent' : this.context.muiTheme.palette.primary3Color
            },
            thumbsStyles: {
                height: 40,
                width: '100%',
                display: 'flex',
                overflow: 'hidden',
                cursor: hasImage ? '' : 'pointer',
                backgroundColor: hasImage ? 'transparent' : this.context.muiTheme.palette.primary3Color,
                paddingLeft: showSwitch ? 0 : 12
            },
            thumbsContainer: {
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            }
        };
        return (
            <div>
                <div style={styles.content} onClick={_this.clickImage}>
                    {content}
                </div>
                <div style={styles.thumbsStyles} onClick={hasImage ? undefined : _this.clickImage}>
                    {showSwitch ?
                        <MUI.IconButton className='icon' onClick={this.movePrevious} iconStyle={{fontSize: 40}}
                                        iconClassName="icon-chevron-left" disabled={!showPrevious}/>
                        : undefined}
                    <div ref="thumbsContainer" style={styles.thumbsContainer}>
                        <div style={{width: '100%', position: 'relative', left: `${- this.state.view * (picWidth + 2 * border + margin)}px`, transition: 'left 1s'}}>
                            {thumbnails}
                        </div>
                    </div>
                    {showSwitch ?
                        <MUI.IconButton className='icon' onClick={this.moveNext} iconStyle={{fontSize: 40}}
                                        iconClassName="icon-chevron-right" disabled={!showNext}/>
                        : undefined}
                </div>
            </div>
        );
    },
    previous: function (){
        let current = this.state.current;
        current -= 1;
        if (current < 0)
            current = 0;
        this.setState({
            current: current,
            width: this.refs.thumbsContainer.getDOMNode().offsetWidth
        });
    },
    next: function (){
        let current = this.state.current;
        current += 1;
        if (current >= this.props.images.length)
            current = this.props.images.length - 1;
        this.setState({
            current: current,
            width: this.refs.thumbsContainer.getDOMNode().offsetWidth
        });
    },
    hoverThumbnail: function (url) {
        var images = this.props.images;

        if (images && images.length > 0){
            for (var index = 0, max = images.length; index < max; index += 1) {
                if (images[index] === url) {
                    if (this.state.current != index) {
                        this.setState({
                            current: index,
                            width: this.refs.thumbsContainer.getDOMNode().offsetWidth
                        });
                    }
                    return;
                }
            }
        }
    },
    movePrevious: function () {
        let width = this.refs.thumbsContainer.getDOMNode().offsetWidth;
        let view = this.state.view;
        let count = Math.floor(width / (picWidth + 2 * border + margin));
        view -= count;
        if (view < 0)
            view = 0;
        this.setState({
            view: view,
            width: this.refs.thumbsContainer.getDOMNode().offsetWidth
        });
    },
    moveNext: function () {
        let width = this.refs.thumbsContainer.getDOMNode().offsetWidth;
        let view = this.state.view;
        let count = Math.floor(width / (picWidth + 2 * border + margin));
        view += count;
        if (view > parseInt(this.props.images.length - count))
            view = parseInt(this.props.images.length - count);
        this.setState({
            view: view,
            width: this.refs.thumbsContainer.getDOMNode().offsetWidth
        });
    },
    clickImage: function () {
        this.props.onClick && this.props.onClick();
    }

});

module.exports = Gallery;
