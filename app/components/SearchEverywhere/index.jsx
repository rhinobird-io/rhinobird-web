const React = require('react');
const StyleSheet = require('react-style');
const MUI = require('material-ui');
const Flex = require('../Flex');

require('./style.less');

let SearchEverywhere = React.createClass({
    render() {
        let styles = {
            wrapper: {
                position: "fixed",
                top: "30%",
                width: 600,
                left: "50%",
                marginLeft: -300,
                background: "rgba(0,0,0,.7)",
                fontSize: "1.2em",
                color: "white",
                textAlign: "center"
            }
        };
        return (
            <MUI.Paper zDepth={2} style={styles.wrapper}>
                <MUI.TextField className="mui-text-search" style={{color: "white"}}/>
            </MUI.Paper>
        );
    }
});

module.exports = SearchEverywhere;