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
                <Select>
                    <optgroup label="NBA">
                        <label></label>
                        <option value="Lake">Lakers</option>
                        <option>Celtics</option>
                        <option>a</option>
                        <option>b</option>
                        <option>c</option>
                        <option>d</option>
                        <option>e</option>
                        <option>f</option>
                    </optgroup>
                    <optgroup label="CBA">
                        <option>China</option>
                        <option>Japan</option>
                    </optgroup>
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
