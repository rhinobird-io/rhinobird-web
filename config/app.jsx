require("babel/polyfill");
global.jQuery = require('jquery');
global.$ = global.jQuery;
$.ajaxSetup({
    contentType: 'application/json; charset=UTF-8;',
    beforeSend: function(jqXHR,options){
        if ( options.contentType == "application/json; charset=UTF-8;" && typeof options.data != "string" ) {
            options.data = JSON.stringify(options.data);
        }
    },
    processData: false
});
//require('jquery-mockjax');
require('../app/stores/UserStore');
const resBundle = require("i18next-resource-store-loader!../app/locales/index.js");

var async = require("async");
var React = require("react");
var Router = require("react-router");
var routes = require("../app/" + __resourceQuery.substr(1) + "Routes");
var ReactUpdates = require("react/lib/ReactUpdates");
const LoginAction = require('../app/actions/LoginAction');
const LoginStore = require('../app/stores/LoginStore');
import numeral from 'numeral';
numeral.language('ja', require('numeral/languages/ja'));
import moment from 'moment';
moment.locale('ja', require('moment/locale/ja'));
import i18n from 'i18next-client';

const FloatingContentAction = require('../app/actions/FloatingContentAction');

const languages = [
    {
        key: 'ja',
        display: '日本語'
    },
    {
        key: 'en-US',
        display: 'English'
    }
];

function setNumeralLocale(lng) {
    if(lng === "dev") {
        lng = 'en-US';
    }
    switch (lng) {
        case "en-US":
            numeral.language('en');
            break;
        default:
            numeral.language(lng);
            break;
    }
}

function setMomentLocale(lng){
    if(lng === "dev") {
        lng = 'en-US';
    }
    moment.locale(lng.toLowerCase());
}

if ($.mockjax) {
    $.mockjax({
        url: '/platform/api/login',
        type: 'GET',
        responseText: {"id" : 1 , "company": "Works Applications", "name":"tomcat", hash:"xx", "realname": "Tom Cat", role:'operator', "email": "tom@cat.pet"}
    });

    $.mockjax({
        url: '/platform/api/logout',
        type: 'POST',
        responseText: {}
    });
}


let loginLoaded = false, i18nLoaded = false;
let publicRoutes = ['/platform/signin', '/platform/signup'];
let render = function () {
    if (loginLoaded && i18nLoaded) {
        Router.run(routes, Router.HistoryLocation, function (Handler, state) {
            FloatingContentAction.updateFloatingContent({
                title: '',
                elementFactory: function(){
                    return null;
                },
                showFloatingContent: false
            })
            if (publicRoutes.indexOf(state.pathname) === -1) {
                if (!LoginStore.getUser()) {
                    this.transitionTo('/platform/signin', {}, {target: state.path});
                    return;
                }
            }
            React.render(<Handler />, document.getElementById("content"));
        });
    }
}
i18n.init({
    resStore: resBundle,
    lng: "en-US"
}, function (e) {
    let lng = i18n.lng();

    setMomentLocale(lng);
    setNumeralLocale(lng);
    i18nLoaded = true;
    render();
});


$.get('/platform/api/login').done(function (data) {
    LoginAction.updateLogin(data);
}).always(function () {
    loginLoaded = true;
    render();
});
