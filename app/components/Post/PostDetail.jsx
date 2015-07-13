const React = require('react/addons');

const Flex = require('../Flex');
const mui = require('material-ui');
const {SmartEditor, SmartDisplay} = require('../SmartEditor');
const PerfectScroll = require('../PerfectScroll');
const Common = require('../Common');
const {Tabs, Tab} = mui;
const LoginStore = require('../../stores/LoginStore');
const Thread = require('../Thread');
const UserStore = require('../../stores/UserStore');
const Member = require('../Member');
const SmartTimeDisplay = require('../SmartTimeDisplay');
const Select = require('../Select');
const Colors = Object.values({
    red50: '#ffebee',
    red100: '#ffcdd2',
    red200: '#ef9a9a',
    red300: '#e57373',
    red400: '#ef5350',
    red500: '#f44336',
    red600: '#e53935',
    red700: '#d32f2f',
    red800: '#c62828',
    red900: '#b71c1c',
    redA100: '#ff8a80',
    redA200: '#ff5252',
    redA400: '#ff1744',
    redA700: '#d50000',

    pink50: '#fce4ec',
    pink100: '#f8bbd0',
    pink200: '#f48fb1',
    pink300: '#f06292',
    pink400: '#ec407a',
    pink500: '#e91e63',
    pink600: '#d81b60',
    pink700: '#c2185b',
    pink800: '#ad1457',
    pink900: '#880e4f',
    pinkA100: '#ff80ab',
    pinkA200: '#ff4081',
    pinkA400: '#f50057',
    pinkA700: '#c51162',

    purple50: '#f3e5f5',
    purple100: '#e1bee7',
    purple200: '#ce93d8',
    purple300: '#ba68c8',
    purple400: '#ab47bc',
    purple500: '#9c27b0',
    purple600: '#8e24aa',
    purple700: '#7b1fa2',
    purple800: '#6a1b9a',
    purple900: '#4a148c',
    purpleA100: '#ea80fc',
    purpleA200: '#e040fb',
    purpleA400: '#d500f9',
    purpleA700: '#aa00ff',

    deepPurple50: '#ede7f6',
    deepPurple100: '#d1c4e9',
    deepPurple200: '#b39ddb',
    deepPurple300: '#9575cd',
    deepPurple400: '#7e57c2',
    deepPurple500: '#673ab7',
    deepPurple600: '#5e35b1',
    deepPurple700: '#512da8',
    deepPurple800: '#4527a0',
    deepPurple900: '#311b92',
    deepPurpleA100: '#b388ff',
    deepPurpleA200: '#7c4dff',
    deepPurpleA400: '#651fff',
    deepPurpleA700: '#6200ea',

    indigo50: '#e8eaf6',
    indigo100: '#c5cae9',
    indigo200: '#9fa8da',
    indigo300: '#7986cb',
    indigo400: '#5c6bc0',
    indigo500: '#3f51b5',
    indigo600: '#3949ab',
    indigo700: '#303f9f',
    indigo800: '#283593',
    indigo900: '#1a237e',
    indigoA100: '#8c9eff',
    indigoA200: '#536dfe',
    indigoA400: '#3d5afe',
    indigoA700: '#304ffe',

    blue50: '#e3f2fd',
    blue100: '#bbdefb',
    blue200: '#90caf9',
    blue300: '#64b5f6',
    blue400: '#42a5f5',
    blue500: '#2196f3',
    blue600: '#1e88e5',
    blue700: '#1976d2',
    blue800: '#1565c0',
    blue900: '#0d47a1',
    blueA100: '#82b1ff',
    blueA200: '#448aff',
    blueA400: '#2979ff',
    blueA700: '#2962ff',

    lightBlue50: '#e1f5fe',
    lightBlue100: '#b3e5fc',
    lightBlue200: '#81d4fa',
    lightBlue300: '#4fc3f7',
    lightBlue400: '#29b6f6',
    lightBlue500: '#03a9f4',
    lightBlue600: '#039be5',
    lightBlue700: '#0288d1',
    lightBlue800: '#0277bd',
    lightBlue900: '#01579b',
    lightBlueA100: '#80d8ff',
    lightBlueA200: '#40c4ff',
    lightBlueA400: '#00b0ff',
    lightBlueA700: '#0091ea',

    cyan50: '#e0f7fa',
    cyan100: '#b2ebf2',
    cyan200: '#80deea',
    cyan300: '#4dd0e1',
    cyan400: '#26c6da',
    cyan500: '#00bcd4',
    cyan600: '#00acc1',
    cyan700: '#0097a7',
    cyan800: '#00838f',
    cyan900: '#006064',
    cyanA100: '#84ffff',
    cyanA200: '#18ffff',
    cyanA400: '#00e5ff',
    cyanA700: '#00b8d4',

    teal50: '#e0f2f1',
    teal100: '#b2dfdb',
    teal200: '#80cbc4',
    teal300: '#4db6ac',
    teal400: '#26a69a',
    teal500: '#009688',
    teal600: '#00897b',
    teal700: '#00796b',
    teal800: '#00695c',
    teal900: '#004d40',
    tealA100: '#a7ffeb',
    tealA200: '#64ffda',
    tealA400: '#1de9b6',
    tealA700: '#00bfa5',

    green50: '#e8f5e9',
    green100: '#c8e6c9',
    green200: '#a5d6a7',
    green300: '#81c784',
    green400: '#66bb6a',
    green500: '#4caf50',
    green600: '#43a047',
    green700: '#388e3c',
    green800: '#2e7d32',
    green900: '#1b5e20',
    greenA100: '#b9f6ca',
    greenA200: '#69f0ae',
    greenA400: '#00e676',
    greenA700: '#00c853',

    lightGreen50: '#f1f8e9',
    lightGreen100: '#dcedc8',
    lightGreen200: '#c5e1a5',
    lightGreen300: '#aed581',
    lightGreen400: '#9ccc65',
    lightGreen500: '#8bc34a',
    lightGreen600: '#7cb342',
    lightGreen700: '#689f38',
    lightGreen800: '#558b2f',
    lightGreen900: '#33691e',
    lightGreenA100: '#ccff90',
    lightGreenA200: '#b2ff59',
    lightGreenA400: '#76ff03',
    lightGreenA700: '#64dd17',

    lime50: '#f9fbe7',
    lime100: '#f0f4c3',
    lime200: '#e6ee9c',
    lime300: '#dce775',
    lime400: '#d4e157',
    lime500: '#cddc39',
    lime600: '#c0ca33',
    lime700: '#afb42b',
    lime800: '#9e9d24',
    lime900: '#827717',
    limeA100: '#f4ff81',
    limeA200: '#eeff41',
    limeA400: '#c6ff00',
    limeA700: '#aeea00',

    yellow50: '#fffde7',
    yellow100: '#fff9c4',
    yellow200: '#fff59d',
    yellow300: '#fff176',
    yellow400: '#ffee58',
    yellow500: '#ffeb3b',
    yellow600: '#fdd835',
    yellow700: '#fbc02d',
    yellow800: '#f9a825',
    yellow900: '#f57f17',
    yellowA100: '#ffff8d',
    yellowA200: '#ffff00',
    yellowA400: '#ffea00',
    yellowA700: '#ffd600',

    amber50: '#fff8e1',
    amber100: '#ffecb3',
    amber200: '#ffe082',
    amber300: '#ffd54f',
    amber400: '#ffca28',
    amber500: '#ffc107',
    amber600: '#ffb300',
    amber700: '#ffa000',
    amber800: '#ff8f00',
    amber900: '#ff6f00',
    amberA100: '#ffe57f',
    amberA200: '#ffd740',
    amberA400: '#ffc400',
    amberA700: '#ffab00',

    orange50: '#fff3e0',
    orange100: '#ffe0b2',
    orange200: '#ffcc80',
    orange300: '#ffb74d',
    orange400: '#ffa726',
    orange500: '#ff9800',
    orange600: '#fb8c00',
    orange700: '#f57c00',
    orange800: '#ef6c00',
    orange900: '#e65100',
    orangeA100: '#ffd180',
    orangeA200: '#ffab40',
    orangeA400: '#ff9100',
    orangeA700: '#ff6d00',

    deepOrange50: '#fbe9e7',
    deepOrange100: '#ffccbc',
    deepOrange200: '#ffab91',
    deepOrange300: '#ff8a65',
    deepOrange400: '#ff7043',
    deepOrange500: '#ff5722',
    deepOrange600: '#f4511e',
    deepOrange700: '#e64a19',
    deepOrange800: '#d84315',
    deepOrange900: '#bf360c',
    deepOrangeA100: '#ff9e80',
    deepOrangeA200: '#ff6e40',
    deepOrangeA400: '#ff3d00',
    deepOrangeA700: '#dd2c00',

    brown50: '#efebe9',
    brown100: '#d7ccc8',
    brown200: '#bcaaa4',
    brown300: '#a1887f',
    brown400: '#8d6e63',
    brown500: '#795548',
    brown600: '#6d4c41',
    brown700: '#5d4037',
    brown800: '#4e342e',
    brown900: '#3e2723',

    blueGrey50: '#eceff1',
    blueGrey100: '#cfd8dc',
    blueGrey200: '#b0bec5',
    blueGrey300: '#90a4ae',
    blueGrey400: '#78909c',
    blueGrey500: '#607d8b',
    blueGrey600: '#546e7a',
    blueGrey700: '#455a64',
    blueGrey800: '#37474f',
    blueGrey900: '#263238',

    grey50: '#fafafa',
    grey100: '#f5f5f5',
    grey200: '#eeeeee',
    grey300: '#e0e0e0',
    grey400: '#bdbdbd',
    grey500: '#9e9e9e',
    grey600: '#757575',
    grey700: '#616161',
    grey800: '#424242',
    grey900: '#212121'
});




const CreateTagDialog = React.createClass({
    mixins:[React.addons.PureRenderMixin, React.addons.LinkedStateMixin],
    getInitialState(){
        return {
            color: Colors[Math.floor(Math.random() * Colors.length)],
            name: ''
        }
    },
    _handleDialogCancel(){
        this.refs.dialog.dismiss();
    },
    _handleDialogSubmit(){
        this.setState({
            errorText: ''
        });
        if(this.state.name.trim().length === 0){
            this.setState({
                errorText: 'Name should not be empty'
            });
            return;
        }
        $.post('/post/v1/tags', this.state).then((data)=>{
            if (this.props.onCreate) {
                this.props.onCreate(data);
            }
            this.dismiss();
        }).fail((response, a ,b)=>{
            if(response.status === 400){
                this.setState({
                    errorText: 'Name has already been taken'
                });
            }
        });
    },
    show(){
        this.refs.dialog.show();
        this.refs.name.focus();
    },
    dismiss(){
        this.refs.dialog.dismiss();
    },
    render(){
        let dialogActions = [
            <mui.FlatButton key={0}
                label="Cancel"
                secondary={true}
                onTouchTap={this._handleDialogCancel} />,
            <mui.FlatButton key={1}
                label="Create tag"
                primary={true}
                onTouchTap={this._handleDialogSubmit} />
        ];

        return <mui.Dialog
            ref='dialog'
            title="Create tag"
            actions={dialogActions}
            contentStyle={{width:400}}>
            <mui.TextField ref='name' floatingLabelText='Name' style={{width: '100%'}} valueLink={this.linkState('name')}
                errorText={this.state.errorText}/>
            <Flex.Layout center style={{marginTop: 12}}>
                <label style={{fontSize: 14, color: 'rgba(0,0,0,0.54)'}}>Color</label>
                <span style={{marginLeft: 12, width:50, height:14, backgroundColor: this.state.color, marginRight:4}}></span>
                <mui.IconButton iconClassName='icon-autorenew' onClick={()=>{
                    let newColor = this.state.color;
                    while(newColor === this.state.color){
                        newColor = Colors[Math.floor(Math.random() * Colors.length)];
                    }
                    this.setState({
                        color: newColor
                    });
                }}/>
            </Flex.Layout>
        </mui.Dialog>;
    }
});

const Editor = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    getInitialState(){
        $.get('/post/v1/tags').then((data)=>{
            this.setState({
                tags: data
            });
            if(this.props.tags){
                this.props.tags.forEach((t)=>{
                    this.refs.select._addSelectedOption(this.state.tags.find(tag=>tag.id===t.id).id);
                });
            }
        });
        return {
            title: this.props.title,
            body: this.props.body
        };
    },
    componentDidMount() {
        if(this.state.tags && this.props.tags){
            this.props.tags.forEach((t)=>{
                this.refs.select._addSelectedOption(this.state.tags.find(tag=>tag.id===t.id).id);
            });
        }
    },
    getValue(){
        let tags = [], selected = this.refs.select.getSelected();
        for (let key in selected){
            if(selected[key]) {
                tags.push(this.state.tags.find(tag=>tag.id===parseInt(key)));
            }
        }
        return {
            title: this.state.title,
            body: this.state.body,
            tags: tags
        }
    },
    mixins: [React.addons.LinkedStateMixin, React.addons.PureRenderMixin],
    _addTag(tag){
        this.state.tags.push(tag);
        this.refs.select._addSelectedOption(tag.id);
        this.forceUpdate();
    },
    render(){
        if(!this.state.tags){
            return null;
        }
        let tags =
            this.state.tags.length > 0 ?
                this.state.tags.map((t, idx) => {
                    return <Flex.Layout center key={t.id} value={t.id} index={t.name}>
                        <span style={{width:14, height:14, backgroundColor: t.color, marginRight:12}}></span><span>{t.name}</span>
                    </Flex.Layout>;
                }) : null;
        return <div
            style={{maxWidth: 1024, padding:24, margin:'0 auto'}}>
            <label style={{fontSize: 16, color: 'rgba(0,0,0,0.54)'}}>Title</label>
            <mui.TextField ref='textField' valueLink={this.linkState('title')} style={{width: '100%'}}/>
            <Flex.Layout center style={{fontSize: 16, marginTop: 12, color: 'rgba(0,0,0,0.54)'}}>
                <span>Tags</span>
                <mui.IconButton onClick={()=>{this.refs.dialog.show()}}
                    iconStyle={{color: muiTheme.palette.accent3Color}} iconClassName='icon-add-circle-outline'/>
                <CreateTagDialog ref='dialog' onCreate={this._addTag}/>
            </Flex.Layout>
            <Select.Select ref='select'
                           multiple
                           token={(v) => {
                           let t = this.state.tags.find(tag=>tag.id === parseInt(v));
                           return <Flex.Layout center><span style={{width:14, height:14, backgroundColor: t.color, marginRight:4}}></span><span>{t.name}</span></Flex.Layout>
                    }}
                style={{width:'100%'}}>
                {tags}
            </Select.Select>
            <label style={{fontSize: 16, marginTop: 12,display:'block', color: 'rgba(0,0,0,0.54)'}}>Body</label>
            <SmartEditor ref="editor" valueLink={this.linkState('body')} multiLine/>
        </div>;
    }
});
const PostDetail = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired,
        muiTheme: React.PropTypes.object
    },
    mixins: [React.addons.LinkedStateMixin],
    componentDidMount() {
        this.props.setTitle("Post");
    },
    shouldComponentUpdate(){
        return false;
    },
    getInitialState(){
        let path = this.context.router.getCurrentPathname(), mode = 'view';
        if (path.endsWith('create-post')) {
            mode = 'create';
        } else {
            $.get(`/post/v1/posts/${this.props.params.id}`).then((data)=>{
                data.body = data.body || '';
                this.setState(data);
                this.forceUpdate();
            })
        }
        return {
            mode: mode,
            body: '',
            title: ''
        }
    },
    _preview() {
        let value = this.refs.editor.getValue();
        this.setState(value);
        this.forceUpdate();
    },
    render() {
        let user = UserStore.getUser(this.state.creator_id);
        let tagsBlock = undefined;
        if (this.state.tags){
            tagsBlock = this.state.tags.map(t=><Flex.Layout center style={{marginRight: 8}}>
                <span style={{width:12, height:12, backgroundColor: t.color, marginRight:4}}></span><span>{t.name}</span>
            </Flex.Layout>);
        }
        let dialogActions = [
            <mui.FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this._handleDeleteDialogCancel} />,
            <mui.FlatButton
                label="Delete"
                primary={true}
                onTouchTap={this._handleDeleteDialogSubmit} />
        ];
        switch (this.state.mode) {
            case 'view':
                return <PerfectScroll noScrollX style={{position:'relative', height:'100%', maxWidth: 1024, padding:24, margin:'0 auto'}}>
                        <mui.Paper zDepth={1} style={{margin:4}}>
                            <div style={{backgroundColor:muiTheme.palette.primary1Color, width:'100%', padding:24}}>
                                {LoginStore.getUser().id === this.state.creator_id? <Flex.Layout endJustified style={{backgroundColor:muiTheme.palette.primary1Color}}>
                                    <mui.IconButton onClick={this._editPost} iconStyle={{color: muiTheme.palette.canvasColor}} iconClassName="icon-edit" tooltip="Edit this post"/>
                                    <mui.IconButton onClick={this._deletePost} iconStyle={{color: muiTheme.palette.canvasColor}} iconClassName="icon-delete" tooltip="Delete this post"/>
                                    <mui.Dialog actions={dialogActions} title="Deleting post" ref='dialog'>
                                        Are you sure to delete this post?
                                    </mui.Dialog>
                                </Flex.Layout> : undefined}
                                <Common.Display style={{color: muiTheme.palette.canvasColor}} type='headline'>{this.state.title}</Common.Display>
                            </div>
                            <div style={{padding:24, width:'100%'}}>
                                <SmartDisplay value={this.state.body}/>
                                <Common.Display type='caption' style={{display:'flex', alignItems:'center', justifyContent:'space-between', margin:'24px 0'}}>
                                    <Flex.Layout>
                                        {tagsBlock}
                                    </Flex.Layout>
                                    <Flex.Layout endJustified>
                                        <Member.Avatar scale={0.5} member={user}/>
                                        <Member.Name member={user} style={{marginLeft: 4}}/>
                                        <span style={{marginLeft: 4}}>created at <SmartTimeDisplay start={this.state.created_at} format='MMM Do YYYY' /></span>
                                        {this.state.created_at !== this.state.updated_at? <span>, updated at <SmartTimeDisplay start={this.state.updated_at} format='MMM Do YYYY' /></span>:undefined}
                                    </Flex.Layout>
                                </Common.Display>
                                <Common.Display type='title' style={{marginTop:24}}>Comments</Common.Display>
                                <Thread threadKey={this.context.router.getCurrentPathname()} threadTitle={`Post ${this.state.title}`}
                                            participants={{users: [user]}}/>
                            </div>
                            </mui.Paper>
                </PerfectScroll>;
            case 'create':
            case 'edit':
                user = UserStore.getUser(LoginStore.getUser().id);
                return <PerfectScroll style={{position:'absolute', bottom:0, left:0, right:0, top: 0,  maxWidth: 1024, padding:24, margin:'0 auto'}}>
                    <Tabs style={{width:'100%'}}>
                        <Tab label="EDIT">
                            <Editor ref='editor' title={this.state.title} body={this.state.body} tags={this.state.tags}/>
                        </Tab>
                        <Tab label="PREVIEW" onActive={this._preview}>
                            <div
                                >
                                <Common.Display type='headline' style={{marginBottom:12}}>{this.state.title}</Common.Display>
                                <SmartDisplay value={this.state.body}/>
                                <Common.Display type='caption' style={{display:'flex', alignItems:'center', justifyContent:'space-between', margin:'24px 0'}}>
                                    <Flex.Layout>
                                        {tagsBlock}
                                    </Flex.Layout>
                                    <Flex.Layout endJustified>
                                        <Member.Avatar scale={0.5} member={user}/>
                                        <Member.Name member={user} style={{marginLeft: 4}}/>
                                        <span style={{marginLeft: 4}}>created at <SmartTimeDisplay start={new Date()} format='MMM Do YYYY' /></span>
                                    </Flex.Layout>
                                </Common.Display>
                            </div>
                        </Tab>
                    </Tabs>

                    <div style={{position:'fixed', left:0, right: 0, bottom: 0, zIndex:100}}>
                        <div style={{position:'relative',margin:'0 auto', maxWidth: 1024}}>
                            <mui.FloatingActionButton onClick={this._savePost}
                                                      style={{position:'absolute', right: 24, bottom: 24}}
                                                      iconClassName="icon-save"/>
                        </div>
                    </div>
                </PerfectScroll>;
            default:
                return null;
        }
    },
    _savePost(){
        let post;
        if(this.refs.editor){
            post = this.refs.editor.getValue();
        } else{
            post = $.extend({}, this.state);
        }
        let dataToSend = $.extend({}, post);
        dataToSend.tags = dataToSend.tags.map(t=>t.id);
        if(this.state.mode === 'edit'){
            $.ajax({
                url: `/post/v1/posts/${this.state.id}`,
                method: 'PUT',
                data: dataToSend
            }).then(()=>{
                post.mode = 'view';
                this.setState(post);
                this.forceUpdate();
            })
        } else {
            $.post(`/post/v1/posts`,dataToSend).then((data)=>{
                this.context.router.transitionTo(`/platform/post/${data.id}`);
                data.mode = 'view';
                data.body = data.body || '';
                this.setState(data);
                this.forceUpdate();
            });
        }
    },
    _editPost(){
        this.setState({mode: 'edit'});
        this.forceUpdate();
    },
    _deletePost(){
        this.refs.dialog.show();
    },
    _handleDeleteDialogCancel(){
        this.refs.dialog.dismiss();
    },
    _handleDeleteDialogSubmit(){
        $.ajax({
            type: 'DELETE',
            url: `/post/v1/posts/${this.state.id}`
        }).then(()=>{
            this.context.router.transitionTo('/platform/post');
        });
    }
});

module.exports = PostDetail;
