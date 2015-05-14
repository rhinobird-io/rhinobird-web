var React                = require("react"),
    SmartTimeDisplay     = require("../SmartTimeDisplay"),
    SmartEditor = require("../SmartEditor").SmartEditor,
    SmartPreview = require("../SmartEditor").SmartPreview,
    Selector = require("../Select").Selector,
    MaterialSelect = require("../Select").Select,
    SearchEverywhere = require("../SearchEverywhere");

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
                <SmartTimeDisplay start="2017-01-01" end="2017-01-02"/><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<SmartTimeDisplay start="2015-04-24" relative/>
                <br/>
                <br/>
                <br/>
                <br/>
                <div>{this.state.select1.toString()}</div>
                <MaterialSelect multiple valueLink={this.linkState("select1")}>
                    <div label="NBA">
                        <label></label>
                        <div value="Lakers" data="Lakers">Lakers</div>
                        <div value="Celtics" data="Celtics">Celtics</div>
                        <div value="Warriors" data="Warriors">Warriors</div>
                        <div value="Pacers" data="Pacers">Pacers</div>
                    </div>
                    <div label="CBA">
                        <div value="Guang Dong">Guang Dong</div>
                        <div value="Shang Hai">Shang Hai</div>
                        <div value="Bei Jing">Bei Jing</div>
                    </div>
                </MaterialSelect>

                <br/>

                {this.state.repeatedType}
                <Selector
                    onSelectChange={() => console.log("Selector is changed.")}
                    valueLink={this.linkState("repeatedType")}
                    selectedStyle={{color: "white", backgroundColor: "#3F51B5"}}>
                    <span className="item" name="Daily">Daily</span>
                    <span className="item" name="Weekly">Weekly</span>
                    <span className="item" name="Monthly">Monthly</span>
                    <span className="item" name="Yearly">Yearly</span>
                </Selector>

                <br/>

                {this.state.daysInWeek.toString()}
                <Selector
                    multiple
                    valueLink={this.linkState("daysInWeek")}
                    selectedStyle={{color: "white", backgroundColor: "#3F51B5"}}>
                    <span className="item" name="Sunday">Sun</span>
                    <span className="item" name="Monday">Mon</span>
                    <span className="item" name="Tuesday">Tue</span>
                    <span className="item" name="Wednesday">Wed</span>
                    <span className="item" name="Thursday">Thu</span>
                    <span className="item" name="Friday">Fri</span>
                    <span className="item" name="Saturday">Sat</span>
                </Selector>

                <br/>
                <SearchEverywhere />
                <br/>

                <SmartEditor valueLink={this.linkState("editorValue")} hintText="Linked to SmartPreview" />

                <SmartEditor nohr hintText="I have no underline" />
                <SmartEditor floatingLabelText="I have a Label" />
                <br/>
                <SmartPreview valueLink={this.linkState("editorValue")} />
            </div>
        );
    }
});
