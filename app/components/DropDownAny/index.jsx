"use strict";

const React = require("react");
const mui = require("material-ui"),
      Classable = mui.Mixins.Classable,
      ClickAwayable = mui.Mixins.ClickAwayable,
      Paper = mui.Paper;
const PerfectScroll = require('../PerfectScroll');

require("./style.less");

export default React.createClass({
  mixins: [Classable, ClickAwayable],

  propTypes: {
    control: React.PropTypes.element.isRequired,
    menu: React.PropTypes.array.isRequired,
    controlClasses: React.PropTypes.string,
    menuClasses: React.PropTypes.string,
    onClickAway: React.PropTypes.func
  },

  getInitialState() {
    return { open: false };
  },

  componentClickAway() {
    this.setState({ open: false });
    if (this.props.onClickAway) this.props.onClickAway();
  },

  _onControlClick() {
    this.setState({ open: !this.state.open });
  },

  render() {
    let dropClasses = this.getClasses("mui-drop-down-menu", {
      "mui-open": this.state.open
    });
    let controlClasses = "mui-menu-control " + (this.props.controlClasses || "");
    let menuClasses = this.getClasses("mui-menu ", {
      "mui-menu-hideable": true,
      "mui-visible": this.state.open,
      "dropdownany-hidden": !this.state.open
    });
    return (
      <div className={dropClasses}>
        <div className={controlClasses} onClick={this._onControlClick}>
          {this.props.control}
        </div>
        <Paper className={menuClasses} style={this.props.style}>
          <PerfectScroll ref="scroll" noScrollX className={this.props.menuClasses}>
            {this.props.menu}
          </PerfectScroll>
        </Paper>
      </div>
    );
  }
});
