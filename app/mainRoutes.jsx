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
        <Route name="profile" path="profile" handler={require("react-proxy!./components/Profile")} />
        <Route name="signin" path="signin" handler={require("react-proxy!./components/Signin")}></Route>
        <Route name="team" path="team" handler={require("react-proxy!./components/Team")}></Route>
        <Route name="create-team" path="create-team" handler={require("react-proxy!./components/Team/CreateTeam")}></Route>
        <Route name="signup" path="signup" handler={require("react-proxy!./components/Signup")}></Route>
        <Route name="dashboard" path="dashboard" handler={require("./components/Dashboard")} />
        <Route name="calendar" path="calendar" handler={require("react-proxy!./components/Calendar")}>
            <Route name="create-event" path="create-event" handler={require("react-proxy!./components/Calendar/CreateEvent")} />
            <Route name="event-list" path="events" handler={require("react-proxy!./components/Calendar/EventList")} />
            <Route name="events" path="events_" handler={require("react-proxy!./components/Calendar/Events")} />
            <Route name="event-detail" path="events/:id/:repeatedNumber" handler={require("react-proxy!./components/Calendar/EventDetail")} />
            <DefaultRoute handler={require("react-proxy!./components/Calendar/EventList")} />
        </Route>
        <Route name="demo" path="demo" handler={require("react-proxy!./components/Demo")} />
        <Route name="im" path="im" handler={require("react-proxy!./components/InstantMessage")}>
          <Route name="talk" key="imTalk" path="talk/:backEndChannelId" handler={ require("react-router-proxy!./components/InstantMessage/ImMain/Main") }/>
          <Route name="setting" path="setting" handler={require("react-proxy!./components/InstantMessage/ImSetting")} />
        </Route>
        <Route name="post" path="post" handler={require("react-proxy!./components/Post")}>
        </Route>
        <Route name="create-post" path="create-post" handler={require("react-proxy!./components/Post/PostDetail")}/>
        <Redirect from="/platform" to="/platform/dashboard" />
        <Redirect from="/platform/" to="/platform/dashboard" />
        <Redirect from="/" to="/platform/dashboard" />
        <NotFoundRoute handler={require("./components/NotFound")} />
    </Route>
);
