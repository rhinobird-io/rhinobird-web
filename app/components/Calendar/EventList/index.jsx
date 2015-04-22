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
                        <option>Lakers</option>
                        <option>Celtics</option>
                    </optgroup>
                    <option selected="selected">China</option>
                    <option>Japan</option>
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
