"use strict";

const React = require("react");
const mui = require("material-ui"),
      Classable = mui.Mixins.Classable,
      ClickAwayable = mui.Mixins.ClickAwayable,
      Paper = mui.Paper,
      MenuItem = mui.MenuItem;
const PerfectScroll = require('../PerfectScroll');
const Flexible = require('../Mixins').Flexible;
const PopupSelect = require('../Select').PopupSelect;

require("./style.less");

let DropDownPopup = React.createClass({
  mixins: [Flexible],

  render() {
    let {
      menu,
      menuClasses,
      ...other
    } = this.props;

    return <Paper {...other}>
      <PerfectScroll noScrollX className={menuClasses}>
        {this._getMenuItems(menu)}
      </PerfectScroll>
    </Paper>;
  },

  _getMenuItems(list) {
    let key = 0;
    return list.map(item => <MenuItem key={key += 1}>{item}</MenuItem>);
  }
});

const DropDownAny = React.createClass({
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
    if (this.state.open) {
      this.setState({ open: false });
      if (this.props.onClickAway) this.props.onClickAway();
    }
  },

  _onControlClick() {
    this.setState({ open: !this.state.open });
  },

  render() {
    let dropClasses = this.getClasses("mui-drop-down-menu", {
      "mui-open": this.state.open
    });
    let menuClasses = this.getClasses("mui-menu ", {
      "mui-menu-hideable": true,
      "mui-visible": this.state.open,
      "dropdownany-hidden": !this.state.open
    });
    return (
      <div>
        <div ref="control" onClick={this._onControlClick}>
          {this.props.control}
        </div>
        <DropDownPopup
            ref="scroll"
            relatedTo={() => this.refs.control}
            menu={this.props.menu} className={menuClasses} style={this.props.style} menuClasses={this.props.menuClasses}>
        </DropDownPopup>
      </div>
    );
  }
});

export default DropDownAny;