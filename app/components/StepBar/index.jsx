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
        vertical: React.PropTypes.bool,
        right: React.PropTypes.bool,
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
            activeStep,
            ...other
        } = this.props;

        let activeColor = this.context.muiTheme.palette.primary1Color;

        let disabledColor = 'silver';

        let styles = {
            list: {
                margin: 0,
                padding: 0,
                listStyleType: 'none',
                display: 'flex',
                flexDirection: 'column'
            },
            item: {flex: 1},
            span: {
                display:'block',
                position: 'absolute',
                lineHeight: '20px',
                height: 20,
                width: 20,
                borderRadius: '50%',
            },
            itemTitle:{}
        }
        if(!this.props.vertical) {
            Object.assign(styles.item, {
                display: 'inline-block',
                textAlign: 'center',
                lineHeight: '3em',
                position: 'relative'
            });
            Object.assign(styles.span, {
                bottom: '-12px',
                left: '50%',
                marginLeft: -10
            });
            styles.activeItem = Object.assign({}, styles.item);

            Object.assign(styles.item, {
                color: disabledColor,
                borderBottom: `4px solid ${disabledColor}`
            });

            Object.assign(styles.activeItem, {
                color: activeColor,
                borderBottom: `4px solid ${activeColor}`
            });
        } else {
            if (!this.props.right){
                styles.itemTitle = {
                    position: 'absolute',
                    top: '50%',
                    marginTop: -10,
                    left: 20
                };
                Object.assign(styles.item, {
                    position: 'relative'
                });
                Object.assign(styles.span, {
                    left: '-12px',
                    top: '50%',
                    marginTop: -10,
                    textAlign: 'center'
                });
                styles.activeItem = Object.assign({}, styles.item);
                Object.assign(styles.item, {
                    color: disabledColor,
                    borderLeft: `4px solid ${disabledColor}`
                });

                Object.assign(styles.activeItem, {
                    color: activeColor,
                    borderLeft: `4px solid ${activeColor}`
                });
            } else{
                styles.itemTitle = {
                    position: 'absolute',
                    top: '50%',
                    marginTop: -10,
                    right: 20
                };
                Object.assign(styles.item, {
                    position: 'relative'
                });
                Object.assign(styles.span, {
                    right: '-12px',
                    top: '50%',
                    marginTop: -10,
                    textAlign: 'center'
                });
                styles.activeItem = Object.assign({}, styles.item);
                Object.assign(styles.item, {
                    color: disabledColor,
                    borderRight: `4px solid ${disabledColor}`
                });

                Object.assign(styles.activeItem, {
                    color: activeColor,
                    borderRight: `4px solid ${activeColor}`
                });
            }
        }
        let activeSpan = <span className='icon-done' style={Object.assign({}, styles.span, {
                backgroundColor: activeColor,
                color: this.context.muiTheme.palette.canvasColor
            })}></span>;
        let todoSpan = <span style={Object.assign({}, styles.span, {
                backgroundColor: disabledColor
            })}></span>;
        return (
            <ol style={Object.assign(styles.list, style)}>
                {stepTitles.map((t, i) => <li style={i < activeStep ? styles.activeItem : styles.item}>
                    <span style={styles.itemTitle}>{t}</span>
                    {i < activeStep ? activeSpan : todoSpan}
                </li>)}
            </ol>
        );
    }
});
