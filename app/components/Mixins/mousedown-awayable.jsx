var React = require('react');
var Events = require('material-ui/lib/utils/events');
var Dom = require('material-ui/lib/utils/dom');

module.exports = {

    //When the component mounts, listen to MouseDown events and check if we need to
    //Call the componentMouseDownAway function.
    componentDidMount: function() {
        if (!this.manuallyBindMouseDownAway) this._bindMouseDownAway();
    },

    componentWillUnmount: function() {
        this._unbindMouseDownAway();
    },

    _checkMouseDownAway: function(e) {
        var el = React.findDOMNode(this);

        var awayExceptions = this.props.awayExceptions ? this.props.awayExceptions() : null;

        var isException = false;

        if (awayExceptions && (e.target == awayExceptions || Dom.isDescendant(awayExceptions, e.target))) {
            isException = true;
        }
        // Check if the target is inside the current component
        if (!isException && e.target != el &&
            !Dom.isDescendant(el, e.target) &&
            document.documentElement.contains(e.target)) {
            if (this.componentMouseDownAway) this.componentMouseDownAway();
        }
    },

    _bindMouseDownAway: function() {
        Events.on(document, 'mousedown', this._checkMouseDownAway);
    },

    _unbindMouseDownAway: function() {
        Events.off(document, 'mousedown', this._checkMouseDownAway);
    }

};
