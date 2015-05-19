"use strict";


let React = require("react/addons");

let IconLink = require("../IconLink");
let Member = require("../Member");
let LoginStore = require("../../stores/LoginStore");
let UserStore = require("../../stores/UserStore");

let markdown = require('./markdown');

let Flex = require('../Flex');


const SmartDisplay = React.createClass({

    getInitialState(){
        return {
            urlPreviews: []
        }
    },
    getDefaultProps(){
        return {
            enableLinkPreview: true
        };
    },

    shouldComponentUpdate(nextProps, nextState){
        return nextProps.value !== this.props.value || nextState.urlPreviews !== this.state.urlPreviews;
    },
    componentWillUpdate(){
        if(this.state.urlPreviews.length !== 0 && this.props.onLinkPreviewWillUpdate) {
            this.props.onLinkPreviewWillUpdate();
        }
    },
    componentDidUpdate(){
        if(this.state.urlPreviews.length !== 0 && this.props.onLinkPreviewDidUpdate) {
            this.props.onLinkPreviewDidUpdate();
        }
    },
    componentDidMount() {
        let memberLinks = this.getDOMNode().querySelectorAll("a.member-at");
        for (let i = 0; i < memberLinks.length; i++) {
            memberLinks[i].addEventListener("click", this._onClick);
        }

        if (this.props.enableLinkPreview) {
            let linkifyLinks = this.getDOMNode().querySelectorAll('a[linkify]');
            let count = linkifyLinks.length;
            let previews = [];
            if (count === 0) {
                return;
            }
            for (let i = 0; i < count; i++) {
                let href = linkifyLinks[i].href;
                $.get(`/im/api/urlMetadata?url=${href}`).then((urlMetadata)=> {
                    previews[i] = urlMetadata;
                    count--;
                    if (count == 0) {
                        this._showUrlPreviews(previews);
                    }
                }).fail(()=> {
                    count--;
                    if (count == 0) {
                        this._showUrlPreviews(previews);
                    }
                });
            }
        }
    },
    _showUrlPreviews(previews){
        this.setState({
            urlPreviews: previews
        })
    },

    _onClick(e) {
        e.preventDefault();
        let user = UserStore.getUserByName(e.target.innerHTML.substr(1));
        if (user) Member.showMemberProfile(user.id);
    },

    removeNewline(value) {
        return value.replace(/\n?(<(p|pre|blockquote|ol|ul|li|(h\d))\n?>)/g, "$1")
            .replace(/\n?(<\/(blockquote|ol|ul|li)>)/g, "$1");
    },

    _analysePreview(preview){
        let result = {};
        if (preview.og && preview.og.url) {
            result.url = preview.og.url;
        }
        if (preview.og && preview.og.description) {
            result.urlDescription = preview.og.description;
        } else if (preview.description) {
            result.urlDescription = preview.description;
        }
        if (preview.og && preview.og.title) {
            result.urlTitle = preview.og.title;
        }
        if (preview.og && preview.og.image && preview.og.image.url) {
            result.urlImage = preview.og.image.url;
        }
        if (preview.og && preview.og.image && preview.og.image.width) {
            try {
                result.urlImageWidth = parseInt(preview.og.image.width);
            } catch (err) {
            }
        }
        if (preview.og && preview.og.image && preview.og.image.height) {
            try {
                result.urlImageHeight = parseInt(preview.og.image.height);
            } catch (err) {
            }
        }
        if (preview.og && preview.og.site_name) {
            result.urlSiteName = preview.og.site_name;
        }
        if (preview.og && preview.og.video && preview.og.video.url) {
            result.videoURL = preview.og.video.url;
        }
        if (preview.og && preview.og.video && preview.og.video.height) {
            try {
                result.videoHeight = parseInt(preview.og.video.height);
            } catch (err) {
            }
        }
        if (preview.og && preview.og.video && preview.og.video.width) {
            try {
                result.videoWidth = parseInt(preview.og.video.width);
            } catch (err) {
            }
        }
        return result;
    },

    _renderOg(og, idx) {
        let p = this._analysePreview(og);
        let maxWidth = 680, width, height;
        if (p.videoURL) {
            if (p.videoWidth > maxWidth) {
                width = maxWidth;
                height = width / p.videoWidth * p.videoHeight;
            } else {
                width = p.videoWidth;
                height = p.videoHeight;
            }
        }
        return <Flex.Layout className='linkPreview' key={idx}>
            <div className='vertical-line'></div>
            <div className='content'>
                {p.urlSiteName ? <div className='site-name'>{p.urlSiteName}</div> : undefined}
                {p.urlDescription ? <a style={{display:'block', color:'black'}} href={p.url} className='description'>{p.urlDescription}</a> : undefined}
                {p.urlTitle ? <a style={{display:'block'}} href={p.url} className='title'>{p.urlTitle}</a> : undefined}
                {p.videoURL ? <iframe style={{width:width, height:height}} src={p.videoURL[0]}></iframe>
                    : undefined}
                {!p.videoURL && p.urlImage? <img src={p.urlImage} width={p.urlImageWidth} height={p.urlImageHeight}/>:undefined}
            </div>
        </Flex.Layout>;
    },

    render() {
        let value = markdown.render(this.props.value);
        value = this.removeNewline(value);
        return (
            <div className="smart-display" style={this.props.style}>
                <span className='markdown-body' dangerouslySetInnerHTML={{__html: value}}></span>
                {this.state.urlPreviews.filter(p=> p).map((p, idx) => {
                    return this._renderOg(p, idx);
                })}
            </div>
        );
    }
});

export default SmartDisplay;
