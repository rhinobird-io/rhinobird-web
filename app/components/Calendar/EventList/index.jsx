var React                = require("react"),
    mui                  = require('material-ui'),
    Link                 = require("react-router").Link,
    FloatingActionButton = mui.FloatingActionButton,
    Select = require('../../Select').Select,
    MaterialSelect = require('../../Select').MaterialSelect;

require("./style.less");

export default React.createClass({
    render: function() {
        return (
            <div>
                <br/>
                <MaterialSelect multiple>
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
                </MaterialSelect>

                <MaterialSelect>
                    <option value="Guang Dong">Guang Dong</option>
                    <option value="Shang Hai">Shang Hai</option>
                </MaterialSelect>

                <Link to="create-event">
                    <FloatingActionButton
                        className="add-event"
                        iconClassName="muidocs-icon-action-grade"/>
                </Link>
            </div>
        );
    }
});
