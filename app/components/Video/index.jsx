const React = require("react");

var Video =  React.createClass({
    propTypes: {
        url: React.PropTypes.string.isRequired,
        type: React.PropTypes.string,
        width: React.PropTypes.number,
        height: React.PropTypes.number
    },
    componentDidMount: function() {
        let document = window.document;
        let v = document.querySelector('video'),
          sources = v.querySelectorAll('source'),
          lastsource = sources[sources.length-1];

          lastsource.addEventListener('error', function(ev) {
            let d = document.createElement('div');
            d.innerHTML = v.innerHTML;
            v.parentNode.replaceChild(d, v);
          }, false);
    },
    componentWillUnmount(){
        if(this.refs.video) {
            React.findDOMNode(this.refs.video).src = "";
        }
    },
    render: function(){
        return <video ref='video' controls autoplay width={this.props.width} height={this.props.height}>
                    <source src={this.props.url} type={this.props.type}/>
                    Video Not Found
               </video>;
    }
});

module.exports = Video;
