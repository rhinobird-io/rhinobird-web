const React = require('react');

module.exports = {
    propTypes: {
        hRestrict: React.PropTypes.bool,
        vRestrict: React.PropTypes.bool,
        relatedTo: React.PropTypes.func,
        selfAlignOrigin: React.PropTypes.oneOf(['lt', 'rt', 'rb', 'lb']),
        relatedAlignOrigin: React.PropTypes.oneOf(['lt', 'rt', 'rb', 'lb'])
    },

    position: "",

    relatedTo: null,

    getDefaultProps() {
        return {
            hRestrict: false,
            vRestrict: false,
            selfAlignOrigin: null,
            relatedAlignOrigin: null
        };
    },

    componentDidMount() {
        this.updatePosition();
        window.addEventListener("resize", this._onWindowResize);
        //window.addEventListener("wheel", this._onWindowScroll)
    },

    componentDidUpdate() {
        this.updatePosition();
    },

    componentWillUnmount() {
        window.removeEventListener("resize", this._onWindowResize);
        //window.removeEventListener("wheel", this._onWindowScroll)
    },

    componentWillReceiveProps(nextProps) {
        this.relatedTo = nextProps.relatedTo;
    },

    setRelatedTo(relatedTo) {
        this.relatedTo = relatedTo;
    },

    updatePosition(callback) {
        let base = null;

        let {
            hRestrict
        } = this.props;

        let relatedTo = this.relatedTo;
        if (relatedTo && typeof relatedTo === "function") {
            base = relatedTo();
        } else {
            base = relatedTo;
        }

        if (base) {
            let self = this.getDOMNode();
            let baseRect = null;
            if (base.getDOMNode) {
                let baseDOM = base.getDOMNode();
                baseRect = baseDOM.getBoundingClientRect();
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
            let baseWidth = baseRect.width;
            let baseHeight = baseRect.height;

            let selfWidth = self.offsetWidth;
            let selfHeight = self.offsetHeight;

            let selfTop = 0;
            let selfLeft = null;
            let selfRight = null;

            if (this.props.relatedAlignOrigin && this.props.selfAlignOrigin) {
                let relatedAlignOriginX = this.props.relatedAlignOrigin.substring(0, 1);
                let relatedAlignOriginY = this.props.relatedAlignOrigin.substring(1);
                let selfAlignOriginX = this.props.selfAlignOrigin.substring(0, 1);
                let selfAlignOriginY = this.props.selfAlignOrigin.substring(1);

                let spaceX = 0;
                let spaceY = 0;

                if (selfAlignOriginX === 'l') {
                    if (relatedAlignOriginX === 'l') {
                        spaceX = innerWidth - baseLeft;
                        if (spaceX >= selfWidth) {
                            selfLeft = baseLeft;
                        } else {
                            selfLeft = baseRight - selfWidth;
                        }
                    } else if (relatedAlignOriginX === 'r') {
                        spaceX = innerWidth - baseRight;
                        if (spaceX >= selfWidth) {
                            selfLeft = baseRight;
                        } else {
                            selfLeft = baseRight - baseWidth - selfWidth;
                        }
                    }
                } else if (selfAlignOriginX === 'r') {
                    if (relatedAlignOriginX === 'r') {
                        spaceX = baseRight;
                        if (spaceX >= selfWidth) {
                            selfLeft = baseRight - selfWidth;
                        } else {
                            selfLeft = baseLeft;
                        }
                    } else if (relatedAlignOriginX === 'l') {
                        spaceX = baseLeft;
                        if (spaceX >= selfWidth) {
                            selfLeft = baseLeft - selfWidth;
                        } else {
                            selfLeft = baseRight;
                        }
                    }
                }

                if (selfAlignOriginY === 't') {
                    if (relatedAlignOriginY === 't') {
                        selfTop = baseTop;
                        spaceY = innerHeight - baseTop;
                    } else {
                        selfTop = baseBottom;
                        spaceY = innerHeight - baseBottom;
                    }
                } else {
                    if (relatedAlignOriginY === 'b') {
                        selfTop = baseBottom - selfHeight;
                        spaceY = baseBottom;
                    } else {
                        selfTop = baseTop - selfHeight;
                        spaceY = baseTop;
                    }
                }


            } else {
                if (innerHeight - baseBottom - selfHeight >= 0) {
                    selfTop = baseTop + baseHeight;
                    this.position = "bottom";
                } else if (baseTop - selfHeight >= 0) {
                    selfTop = baseTop - selfHeight;
                    this.position = "top";
                } else {
                    this.position = "top";
                }

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
            }
            self.style.position = "fixed";
            self.style.top = selfTop + "px";

            console.log(innerHeight - baseBottom - selfHeight);
            console.log("selfWidth: " + selfWidth);
            console.log("innerHeight: " + innerHeight);
            console.log("baseBottom: " + baseBottom);
            console.log("selfLeft: " + selfLeft);

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
