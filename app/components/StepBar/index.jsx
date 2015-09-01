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
            activeStep: 0,
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
            line: {
                position: "absolute",
                top: "50%",
                width: "100%",
                height: 4,
                borderRadius: 2,
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
                width: "200px",
                left: "-90px",
                textAlign: "center",
                color: Colors.grey600
            }
        };

        let steps = [];
        for (let i = 0; i < stepTitles.length; i++) {
            let step = {};
            Assign(step, styles.step);
            if (i <= this.props.activeStep) {
                step.background = Colors.green500;
            } else {
                step.background = Colors.grey500;
            }

            let title = {};
            Assign(title, styles.title);
            if (i <= this.props.activeStep) {
                title.color = Colors.green500;
            } else {
                title.color = Colors.grey500;
            }
            steps.push(<div key={`step${i}`} style={step}>
                <div style={title}>{`${stepTitles[i] || ''}`}</div>
            </div>);
        }

        let lines = [];
        for (let i = 0; i < stepTitles.length - 1; i++) {
            let line = {};
            Assign(line, styles.line);
            let width = 100 / (stepTitles.length - 1);
            line.width = `${width}%`;
            line.left = `${i * (100 / (stepTitles.length - 1))}%`;
            if (i >= this.props.activeStep) {
                line.background = Colors.grey500;
            }
            lines.push(<div style={line}></div>);
        }
        return (
            <Flex.Layout horizontal justified style={Assign({width: 600, position: "relative"}, style || {})} {...other}>
                {steps}
                {lines}
            </Flex.Layout>
        );
    }
});
