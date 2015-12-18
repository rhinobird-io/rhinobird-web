const React = require("react");

var Video =  React.createClass({
    propTypes: {
        url: React.PropTypes.string.isRequired,
        type: React.PropTypes.string,
        width: React.PropTypes.number,
        height: React.PropTypes.number
    },
    getInitialState(){
        return {
            hasVideo: true,
            loaded: false
        }
    },
    componentDidMount: function() {
        let document = window.document;
        let v = document.querySelector('video'),
          sources = v.querySelectorAll('source'),
          lastsource = sources[sources.length-1];

          lastsource.addEventListener('error', (ev) => {
            this.setState({
                hasVideo: false
            });
          }, false);

          v.addEventListener('loadstart', (ev) => {
            this.setState({
                loaded: true
            });
          }, false);
    },
    componentWillUnmount(){
        if(this.refs.video) {
            React.findDOMNode(this.refs.video).src = "";
        }
    },
    render: function(){
        if(this.state.hasVideo) {
            return <video style={{
                    display: this.state.loaded ? 'block' : 'none'
                }} ref='video' controls autoplay width={this.props.width} height={this.props.height}>
                        <source src={this.props.url} type={this.props.type}/>
                   </video>;
        } else {
            return <div>Video not found.</div>
        }
    }
});

module.exports = Video;
