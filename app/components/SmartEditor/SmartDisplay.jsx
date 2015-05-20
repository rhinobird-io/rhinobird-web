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
                        this._showUrlPreviews(previews.filter(p=>p));
                    }
                }).fail(()=> {
                    count--;
                    if (count == 0) {
                        this._showUrlPreviews(previews.filter(p=>p));
                    }
                });
            }
        }
    },
    _showUrlPreviews(previews){
        let processedPreviews = previews.map(p => this._analysePreview(p));
        let imagePreviews = [];
        processedPreviews.forEach((p) => {
            if(!p.videoURL && p.urlImage){
                imagePreviews.push(p);
            }
        });
        let count = imagePreviews.length;
        if(count === 0){
            this.setState({
                urlPreviews: processedPreviews
            });
            return;
        }
        imagePreviews.forEach(p =>{
            p.img = new Image();
            p.img.src= p.urlImage;
            p.img.onload = () => {
                count --;
                if(count === 0){
                    this.setState({
                        urlPreviews: processedPreviews
                    });
                }
            }
        });
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

    _renderOg(p, idx) {
        let maxWidth = 580;
        return <Flex.Layout className='linkPreview' key={idx}>
            <div className='vertical-line'></div>
            <div style={{flexGrow: 1}} className='content'>
                {p.urlSiteName ? <div className='site-name'>{p.urlSiteName}</div> : undefined}
                {p.urlDescription ? <a target='_blank' style={{display:'block', color:'black'}} href={p.url} className='description'>{p.urlDescription}</a> : undefined}
                {p.urlTitle ? <a target='_blank' style={{display:'block'}} href={p.url} className='title'>{p.urlTitle}</a> : undefined}
                {p.videoURL ? <div style={{width: Math.min(p.videoWidth, maxWidth) ,maxWidth: '100%'}}><div style={{position: 'relative',
                                            width: '100%',
                                            height: 0,
                                            paddingBottom:`${100*p.videoHeight / p.videoWidth}%`}}>
                    <iframe style={{ position:'absolute', width: '100%', height:'100%', left:0, top: 0}} src={p.videoURL[0]}></iframe>
                    </div></div>: undefined}
                {!p.videoURL && p.urlImage?<div style={{width: Math.min(p.img.width, maxWidth) ,maxWidth: '100%'}}><div style={{position: 'relative',
                                            width: '100%',
                                            height: 0,
                                            paddingBottom:`${100*p.img.height / p.img.width}%`}}>
                    <img   style={{position:'absolute',width: '100%', height:'100%', left:0, top: 0}} src={p.urlImage}/>
                    </div></div>:undefined}
            </div>
        </Flex.Layout>;
    },

    render() {
        let value = markdown.render(this.props.value);
        value = this.removeNewline(value);
        return (
            <div className="smart-display" style={this.props.style}>
                <span className='markdown-body' dangerouslySetInnerHTML={{__html: value}}></span>
                {this.state.urlPreviews.map((p, idx) => {
                    return this._renderOg(p, idx);
                })}
            </div>
        );
    }
});

export default SmartDisplay;
