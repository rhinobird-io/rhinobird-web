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
                <StepBar style={{width: 600, marginLeft: 20}} activeStep={1} stepTitles={["Draft", "Submitted", "Finished"]}/>
            </div>
        );
    }
});
