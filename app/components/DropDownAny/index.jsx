"use strict";

const React = require("react");
const mui = require("material-ui"),
      Classable = mui.Mixins.Classable,
      ClickAwayable = mui.Mixins.ClickAwayable,
      Paper = mui.Paper,
      MenuItem = mui.MenuItem;
const PerfectScroll = require('../PerfectScroll');
const Flexible = require('../Mixins').Flexible;
const Popup = require('../Popup');
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
    return {

    }
  },

  dismiss() {
    this.refs.scroll.dismiss();
  },

  componentClickAway() {
    if (this.refs.scroll.isShown()) {
      this.refs.scroll.dismiss();
      if (this.props.onClickAway) this.props.onClickAway();
    }
  },

  _onControlClick() {
    if (this.refs.scroll.isShown()) {
      this.refs.scroll.dismiss();
    } else {
      this.refs.scroll.show();
    }
  },

  render() {
    return (
        <div ref="control" onClick={this._onControlClick}>
          {this.props.control}
          <Popup
              selfAlignOrigin="rt"
              relatedAlignOrigin="rt"
              ref="scroll" style={{paddingTop: 5, paddingBottom: 5}}
              relatedTo={() => this.refs.control}>
            {this.props.menu}
          </Popup>
        </div>
    );
  }
});

export default DropDownAny;