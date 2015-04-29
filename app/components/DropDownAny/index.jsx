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
    right: React.PropTypes.number,
    bottom: React.PropTypes.number,
    top: React.PropTypes.number,
    left: React.PropTypes.number,
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
    let key = 0;
    return list.map(item => <div key={key += 1} className="mui-menu-item">{item}</div>);
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
    let style = {};
    if(this.props.right) {
      style.right = this.props.right;
    }
    if(this.props.bottom) {
      style.bottom = this.props.bottom;
    }
    if(this.props.left) {
      style.left = this.props.left;
    }
    if(this.props.top) {
      style.top = this.props.top;
    }
    return (
      <div className={dropClasses}>
        <div className={controlClasses} onClick={this._onControlClick}>
          {this.props.control}
        </div>
        <Paper className={menuClasses} style={style}>
          <PerfectScroll className={this.props.menuClasses}>
            {this._getMenuItems(this.props.menu)}
          </PerfectScroll>
        </Paper>
      </div>
    );
  }
});
