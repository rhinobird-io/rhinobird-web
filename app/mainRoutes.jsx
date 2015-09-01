const React = require("react");
const Router = require("react-router");
const Route = Router.Route;
const DefaultRoute = Router.DefaultRoute;
const NotFoundRoute = Router.NotFoundRoute;
const Redirect = Router.Redirect;

// polyfill
if(!Object.assign)
	Object.assign = React.__spread;

var Main = require("react-proxy!./components/InstantMessage/ImMain/Main");

// export routes
module.exports = (
    <Route name="app" path="/platform" handler={require("./components/Application")}>
        <Route name="test" path="test" handler={require("react-proxy!./components/Test")} />
        <Route name="profile" path="profile" handler={require("react-proxy!./components/Profile")} />
        <Route name="signin" path="signin" handler={require("react-proxy!./components/Signin")}></Route>
        <Route name="team" path="team" handler={require("react-proxy!./components/Team")}></Route>
        <Route name="create-team" path="create-team" handler={require("react-proxy!./components/Team/CreateTeam")}></Route>
        <Route name="signup" path="signup" handler={require("react-proxy!./components/Signup")}></Route>
        <Route name="dashboard" path="dashboard" handler={require("./components/Dashboard")} />
        <Route name="calendar" path="calendar" handler={require("react-proxy!./components/Calendar")}>
            <Route name="create-event" path="create-event" handler={require("react-proxy!./components/Calendar/CreateEvent")} />
            <Route name="event-list" path="events" handler={require("react-proxy!./components/Calendar/AllEvents")} />
            <Route name="all-events" path="all_events" handler={require("react-proxy!./components/Calendar/AllEvents")} />
            <Route name="event-detail" path="events/:id/:repeatedNumber" handler={require("react-proxy!./components/Calendar/EventDetail")} />
            <DefaultRoute handler={require("react-proxy!./components/Calendar/AllEvents")} />
        </Route>
        <Route name="demo" path="demo" handler={require("react-proxy!./components/Demo")} />
        <Route name="im" path="im" handler={require("react-proxy!./components/InstantMessage")}>
          <Route name="talk" key="imTalk" path="talk/:backEndChannelId" handler={ require("react-router-proxy!./components/InstantMessage/ImMain/Main") }/>
          <Route name="setting" path="setting" handler={require("react-proxy!./components/InstantMessage/ImSetting")} />
        </Route>
        <Route name="resource" path="resource" handler={require("react-proxy!./components/Resource")}>
            <Route name="create-resource" path="create-resource" handler={require("react-proxy!./components/Resource/CreateResource")} />
            <Route name="edit-resource" path="edit-resource/:id" handler={require("react-proxy!./components/Resource/CreateResource")} />
            <Route name="resources" path="resources" handler={require("react-proxy!./components/Resource/ResourceList")} />
            <Route name="resource-detail" path="resources/:id" handler={require("react-proxy!./components/Resource/ResourceDetail")} />
            <DefaultRoute handler={require("react-proxy!./components/Resource/ResourceList")} />
        </Route>
        <Route name="post" path="post" handler={require("react-proxy!./components/Post")}>
        </Route>
        <Route name="post-detail" path="post/:id" handler={require("react-router-proxy!./components/Post/PostDetail")}>
        </Route>
        <Route name="create-post" path="create-post" handler={require("react-router-proxy!./components/Post/PostDetail")}/>
        <Route name="activity" path="activity" handler={require("react-router-proxy!./components/Activity")}>
            <Route name="speech-detail" path="speeches/:id" handler={require("react-proxy!./components/Activity/SpeechDetail")} />
            <Route name="create-speech" path="create-speech" handler={require("react-proxy!./components/Activity/CreateSpeech")} />
            <Route name="personal-home" path="my" handler={require("react-proxy!./components/Activity/PersonalHome")} />
            <DefaultRoute handler={require("react-proxy!./components/Activity/Activity")} />
        </Route>
        <Redirect from="/platform" to="/platform/dashboard" />
        <Redirect from="/platform/" to="/platform/dashboard" />
        <Redirect from="/" to="/platform/dashboard" />
        <NotFoundRoute handler={require("./components/NotFound")} />
    </Route>
);
