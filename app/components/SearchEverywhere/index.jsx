const React = require('react');
const StyleSheet = require('react-style');
const MUI = require('material-ui');
const Flex = require('../Flex');
const PopupSelect = require('../Select').PopupSelect;
const ClickAwayable = MUI.Mixins.ClickAwayable;
const SearchStore = require("../../stores/SearchStore");
const SearchAction = require("../../actions/SearchAction");

require('./style.less');

let SearchEverywhere = React.createClass({
    mixins: [ClickAwayable],

    getInitialState() {
        return {
            results: []
        };
    },

    componentClickAway() {
        this.refs.popup.dismiss();
    },

    componentDidMount() {
        SearchStore.addChangeListener(this._onChange);
    },

    componentWillUnmount() {
        SearchStore.removeChangeListener(this._onChange);
    },

    render() {
        let styles = {
            wrapper: {
                position: "fixed",
                top: "30%",
                width: 600,
                left: "50%",
                marginLeft: -300,
                background: "rgba(0,0,0,.7)",
                borderRadius: 0
            }
        };

        let results = this.state.results.map((result) => {
            return <div key={result._source.id} value={result._source.id}>
                {result._source.title}
            </div>;
        });

        return (
            <MUI.Paper ref="search" className="search-everywhere" zDepth={2} style={styles.wrapper}>
                <MUI.TextField
                    ref="keyword"
                    className="mui-text-search"
                    onFocus={() => this.refs.popup.show()}
                    onChange={() => SearchAction.search(this.refs.keyword.getValue())}
                    style={{color: "white", fontSize: "1.2em"}}/>
                <PopupSelect
                    hRestrict
                    ref="popup"
                    relatedTo={() => this.refs.search}>
                    {results}
                </PopupSelect>
            </MUI.Paper>
        );
    },

    _onChange() {
        this.setState({
            results: SearchStore.getSearchResults()
        })
    }
});

module.exports = SearchEverywhere;