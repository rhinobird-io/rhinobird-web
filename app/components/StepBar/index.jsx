"use strict";

const React  = require("react/addons");
const Assign = require("object-assign");
const Flex   = require("../Flex");
const Moment = require("moment");
const MUI    = require("material-ui");
const Colors = require('material-ui/lib/styles/colors.js');
const StylePropable = require('material-ui/lib/mixins/style-propable');

export default React.createClass({
    mixins: [React.addons.PureRenderMixin, StylePropable],

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    propTypes: {
        activeStep: React.PropTypes.number,
        stepTitles: React.PropTypes.arrayOf(React.PropTypes.string)
    },

    getDefaultProps() {
        return {
            activeStep: 3,
            stepTitles: []
        }
    },

    getInitialState() {
        return {
        };
    },

    componentDidMount() {
    },

    render() {
        let {
            style,
            stepTitles,
            ...other
        } = this.props;

        let styles = {
            bin: {
                position: "absolute",
                top: "50%",
                width: "100%",
                height: 4,
                marginTop: -2,
                background: Colors.green500,
                zIndex: 0
            },
            step: {
                width: 20,
                height: 20,
                display: "inline-block",
                borderRadius: "50%",
                lineHeight: "60px",
                position: "relative",
                background: Colors.green200,
                //borderBottom: `6px solid ${Colors.green200}`,
                textAlign: "center",
                color: "white",
                fontSize: "28px",
                zIndex: 1
            },
            title: {
                position: "absolute",
                top: "100%",
                fontSize: "18px",
                lineHeight: "2em",
                width: "100px",
                left: "-40px",
                textAlign: "center",
                color: Colors.grey600
            }
        };

        let steps = [];
        for (let i = 0; i < stepTitles.length; i++) {
            let step = {};
            Assign(step, styles.step);
            if (i === this.props.activeStep) {
                //step.borderLeft = `4px solid ${Colors.green500}`;
            } else if (i < this.props.activeStep) {
                step.background = Colors.green500;
                //step.borderBottom = `6px solid ${Colors.green500}`;
            }
            //if (i === this.props.activeStep) {
            //    step.background = Colors.green400;
            //} else if (i < this.props.activeStep) {
            //    step.background = Colors.grey400;
            //} else {
            //    step.background = Colors.green200;
            //}
            steps.push(<div key={`step${i}`} style={step}>
                <div style={styles.title}>{`${stepTitles[i] || ''}`}</div>
            </div>);
        }
        return (
            <Flex.Layout horizontal justified style={Assign({width: 600, position: "relative"}, style || {})} {...other}>
                <div style={styles.bin}></div>
                {steps}
            </Flex.Layout>
        );
    }
});
