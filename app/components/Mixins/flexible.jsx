const React = require('react');

module.exports = {
    propTypes: {
        hRestrict: React.PropTypes.bool,
        vRestrict: React.PropTypes.bool,
        relatedTo: React.PropTypes.func
    },

    position: "",

    getDefaultProps() {
        return {
            hRestrict: false,
            vRestrict: false
        };
    },

    componentDidMount() {
        this.updatePosition();
        window.addEventListener("resize", this._onWindowResize);
        //window.addEventListener("wheel", this._onWindowScroll)
    },

    componentDidUpdate() {
        this.updatePosition();
        //let height = this.getDOMNode().clientHeight;
        //this.getDOMNode().style.height = 0 + "px";
        //setTimeout(() => this.getDOMNode().style.height = height  + "px", 100);
    },

    componentWillUnmount() {
        window.removeEventListener("resize", this._onWindowResize);
        //window.removeEventListener("wheel", this._onWindowScroll)
    },

    updatePosition(callback) {
        let base = null;

        let {
            hRestrict,
            relatedTo
            } = this.props;

        if (relatedTo && typeof relatedTo === "function") {
            base = relatedTo();
        }

        if (base) {
            let self = this.getDOMNode();
            let baseRect = null;
            if (base.getDOMNode) {
                let baseDOM = base.getDOMNode();
                baseRect = baseDOM.getBoundingClientRect();
                console.log(baseRect);
            } else {
                if (isNaN(base.left) || isNaN(base.top) ||
                    (isNaN(base.right) && isNaN(base.width)) ||
                    (isNaN(base.bottom) && isNaN(base.height))) {
                    return;
                }
                if (isNaN(base.right)) {
                    base.right = base.left + base.width;
                } else if (isNaN(base.width)) {
                    base.width = base.right - base.left;
                }

                if (isNaN(base.bottom)) {
                    base.bottom = base.top + base.height;
                } else if (isNaN(base.height)) {
                    base.height = base.bottom - base.top;
                }
                baseRect = base;
            }
            // Window client size
            let innerWidth = window.innerWidth;
            let innerHeight = window.innerHeight;

            let baseTop = baseRect.top;
            let baseLeft = baseRect.left;
            let baseRight = baseRect.right;
            let baseBottom = baseRect.bottom;
            let baseHeight = baseRect.height;

            let selfWidth = self.offsetWidth;
            let selfHeight = self.offsetHeight;

            let selfTop = 0;
            let selfLeft = null;
            let selfRight = null;

            console.log(innerHeight - baseBottom - selfHeight);
            console.log("selfHeight: " + selfHeight);
            console.log("innerHeight: " + innerHeight);
            console.log("baseBottom: " + baseBottom);
            if (innerHeight - baseBottom - selfHeight >= 0) {
                selfTop = baseTop + baseHeight;
                this.position = "bottom";
            } else if (baseTop - selfHeight >= 0) {
                selfTop = baseTop - selfHeight;
                console.log("baseTop: " + baseTop);
                console.log("selfTop: " + selfTop);
                this.position = "top";
            }

            console.log(this.position);
            if (innerWidth - baseRight - selfWidth >= 0) {
                selfLeft = baseLeft;
                if (hRestrict) {
                    selfRight = innerWidth - baseRight;
                }
            } else if (baseRight - selfWidth >= 0) {
                selfRight = innerWidth - baseRight;
                if (hRestrict) {
                    selfLeft = baseLeft;
                }
            }

            self.style.position = "fixed";
            self.style.top = selfTop + "px";

            if (isNaN(selfLeft)) {
                self.style.left = "auto";
            } else {
                self.style.left = selfLeft + "px";
            }

            if (isNaN(selfRight)) {
                self.style.right = "auto";
            } else {
                self.style.right = selfRight + "px";
            }
        }

        if (callback && typeof callback === "function") {
            callback();
        }
    },

    _onWindowResize() {
        this.updatePosition();
    },

    _onWindowScroll() {
        this.updatePosition();
    }
};
