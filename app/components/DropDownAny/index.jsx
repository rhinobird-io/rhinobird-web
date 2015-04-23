"use strict";

const React = require("react");
const mui = require("material-ui"),
      Classable = mui.Mixins.Classable,
      ClickAwayable = mui.Mixins.ClickAwayable,
      Paper = mui.Paper;

require("./style.less");

export default React.createClass({
  mixins: [Classable, ClickAwayable],

  propTypes: {
    control: React.PropTypes.element.isRequired,
    menu: React.PropTypes.array.isRequired,
    controlClasses: React.PropTypes.string,
    menuClasses: React.PropTypes.string
  },

  getInitialState() {
    return { open: false };
  },

  componentClickAway() {
    this.setState({ open: false });
  },

  _onControlClick() {
    this.setState({ open: !this.state.open });
  },

  _getMenuItems(list) {
    return list.map(item => <div className="mui-menu-item">{item}</div>);
  },

  render() {
    let dropClasses = this.getClasses("mui-drop-down-menu", {
      "mui-open": this.state.open
    });
    let controlClasses = "mui-menu-control " + (this.props.controlClasses || "");
    let menuClasses = this.getClasses("mui-menu " +  (this.props.menuClasses || ""), {
      "mui-menu-hideable": true,
      "mui-visible": this.state.open,
      "dropdownany-hidden": !this.state.open
    });
    return (
      <div className={dropClasses}>
        <div className={controlClasses} onClick={this._onControlClick}>
          {this.props.control}
        </div>
        <Paper className={menuClasses}>
          {this._getMenuItems(this.props.menu)}
        </Paper>
      </div>
    );
  }
});
