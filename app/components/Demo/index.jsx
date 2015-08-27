const React = require("react");
const StepBar = require("../StepBar");

require("./style.less");

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    componentDidMount() {
        this.props.setTitle("Demo");
    },

    getInitialState() {
        return {
        }
    },

    render: function() {
        return (
            <div>
                <div style={{height: 40}}></div>
                <StepBar style={{width: 800, marginLeft: 20}} stepTitles={["Draft", "Submitted", "Finished"]}/>
            </div>
        );
    }
});
