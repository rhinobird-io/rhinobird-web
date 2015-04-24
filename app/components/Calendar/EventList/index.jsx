var React                = require("react"),
    MUI                  = require("material-ui"),
    Link                 = require("react-router").Link,
    FloatingActionButton = MUI.FloatingActionButton,
    SmartTimeDisplay     = require("../../SmartTimeDisplay"),
    Select = require("../../Select").Select;

require("./style.less");

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    getInitialState() {
        return {
            select1: [],
            select2: []
        }
    },

    render: function() {
        return (
            <div>
                <SmartTimeDisplay start="2017-01-01" end="2017-01-02"/><br/>
                <SmartTimeDisplay start="2015-04-26" relative/><br/>
                <SmartTimeDisplay start="2015-04-24" relative/>
                <br/>
                <br/>
                <br/>
                <br/>
                <div>{this.state.select1.toString()}</div>
                <Select multiple valueLink={this.linkState("select1")} placeholder="Select a team">
                    <optgroup label="NBA">
                        <label></label>
                        <option value="Lakers" data="Lakers">Lakers</option>
                        <option value="Celtics" data="Celtics">Celtics</option>
                        <option value="Warriors" data="Warriors">Warriors</option>
                        <option value="Pacers" data="Pacers">Pacers</option>
                    </optgroup>
                    <optgroup label="CBA">
                        <option value="Guang Dong">Guang Dong</option>
                        <option value="Shang Hai">Shang Hai</option>
                        <option value="Bei Jing">Bei Jing</option>
                    </optgroup>
                </Select>

                <div>{this.state.select2}</div>
                <Select valueLink={this.linkState("select2")}>
                    <option value="Guang Dong">Guang Dong</option>
                    <option value="Shang Hai">Shang Hai</option>
                </Select>
                <Link to="create-event">
                    <FloatingActionButton
                        className="add-event"
                        iconClassName="muidocs-icon-action-grade"/>
                </Link>
            </div>
        );
    }
});
