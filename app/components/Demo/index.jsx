var React                = require("react"),
    MUI = require('material-ui'),
    SmartTimeDisplay     = require("../SmartTimeDisplay"),
    SmartEditor = require("../SmartEditor").SmartEditor,
    SmartPreview = require("../SmartEditor").SmartPreview,
    Selector = require("../Select").Selector,
    MaterialSelect = require("../Select").Select,
    MemberSelect = require('../Member').MemberSelect,
    SearchEverywhere = require("../SearchEverywhere"),
    Popup = require('../Popup');

require("./style.less");

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    componentDidMount() {
        this.props.setTitle("Demo");
    },

    getInitialState() {
        return {
            editorValue: "",
            select1: [],
            select2: [],
            repeatedType: null,
            daysInWeek: []
        }
    },

    render: function() {
        return (
            <div>
                <MUI.TextField ref="text" onFocus={() => this.refs.popup.show()} onBlur={() => this.refs.popup.dismiss()}/>

                <Popup hRestrict ref="popup" relatedTo={() => this.refs.text}>
                    <div value="1">1 Oh my god</div>
                    <div value="2">2 Oh my god</div>
                    <div value="1">1 Oh my god</div>
                    <div value="2">2 Oh my god</div>
                    <div value="1">1 Oh my god</div>
                    <div value="2">2 Oh my god</div>
                    <div value="1">1 Oh my god</div>
                    <div value="2">2 Oh my god</div>
                    <div value="1">1 Oh my god</div>
                    <div value="2">2 Oh my god</div>
                </Popup>
            </div>
        );
    }
});
