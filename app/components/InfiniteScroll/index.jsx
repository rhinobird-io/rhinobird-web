const React = require("react");


require('./style.less');

module.exports = React.createClass({
    propTypes: {
        scrollTarget: React.PropTypes.func.isRequired,
        upperThreshold: React.PropTypes.number,
        lowerThreshold: React.PropTypes.number,
        onUpperTrigger: React.PropTypes.func,
        onLowerTrigger: React.PropTypes.func
    },

    upperTriggered: false,
    lowerTriggered: false,

    getDefaultProps(){
        return {
            scrollTarget: null,
            upperThreshold: null,
            lowerThreshold: null,
            onUpperTrigger: null,
            onLowerTrigger: null
        }
    },
    _handleScroll(e){
        var top = e.target.scrollTop;
        if (!this.upperTriggered && this.props.upperThreshold !== null) {
            if (top < this.props.upperThreshold) {
                // No longer fire scroll events if there's no lower threshold or it
                // has been triggered.
                if (this.props.lowerThreshold === null || this.lowerTriggered) {
                    e.target.removeEventListener('scroll', this._handleScroll);
                }
                this.upperTriggered = true;
                this.props.onUpperTrigger();
            }
        }
        if (!this.lowerTriggered && this.props.lowerThreshold !== null) {
            var bottom = top + e.target.offsetHeight;
            var size = e.target.scrollHeight;
            if ((size - bottom) < this.props.lowerThreshold) {
                // No longer fire scroll events if there's no upper threshold or it
                // has been triggered.
                if (this.props.upperThreshold === null || this.upperTriggered) {
                    e.target.removeEventListener('scroll', this._handleScroll);
                }
                this.lowerTriggered = true;
                this.props.onLowerTrigger();
            }
        }
    },
    componentDidMount() {
        console.log(this.props.scrollTarget());
        this.upperTriggered = false;
        this.lowerTriggered = false;
        this.props.scrollTarget().addEventListener('scroll', this._handleScroll);
    },
    componentWillReceiveProps(nextProps){
        console.log("Received");
        console.log(this.props);
        console.log(nextProps);
        this.upperTriggered = false;
        this.lowerTriggered = false;
        this.props.scrollTarget().removeEventListener('scroll', this._handleScroll);
        nextProps.scrollTarget().addEventListener('scroll', this._handleScroll);

    },
    componentWillUnmount() {
        this.props.scrollTarget().removeEventListener('scroll', this._handleScroll);
    },
    render: function () {
        return null;
    }
});
