const React        = require("react"),
      MUI          = require('material-ui'),
      Layout       = require("../../Flex").Layout;

require("./style.less");

export default React.createClass({
    show() {
        this.refs.dialog.show();
    },

    render() {
        let styles = {
          repeatedEvery: {
              textAlign: "center"
          }
        };

        return (
            <MUI.Dialog {...this.props} className="repeated-event-modal" ref="dialog" title="Repeated Information">
                <Layout vertical>
                    <Layout horizontal>
                        <label>Repeats:</label>
                    </Layout>
                    <Layout horizontal justified>
                        <Layout vertical selfCenter>
                            <label>Repeated Every:</label>
                        </Layout>
                        <div>
                            <MUI.TextField
                                type="text"
                                styles={styles.repeatedEvery}
                                className="cal-event-repeated-every" />
                            days
                        </div>
                    </Layout>
                    <Layout horizontal>
                        <label>Repeats:</label>
                    </Layout>
                </Layout>
            </MUI.Dialog>
        );
    }
});