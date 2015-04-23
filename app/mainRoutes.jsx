const React = require("react");
const Router = require("react-router");
const Route = Router.Route;
const DefaultRoute = Router.DefaultRoute;
const NotFoundRoute = Router.NotFoundRoute;
const Redirect = Router.Redirect;

// polyfill
if(!Object.assign)
	Object.assign = React.__spread;

// export routes
module.exports = (
    <Route name="app" path="/platform" handler={require("./components/Application")}>
        <Route name="profile" path="profile" handler={require("react-proxy!./components/Profile")} />
        <Route name="signin" path="signin" handler={require("react-proxy!./components/Signin")}></Route>
        <Route name="team" path="team" handler={require("react-proxy!./components/Team")}></Route>
        <Route name="signup" path="signup" handler={require("react-proxy!./components/Signup")}></Route>
        <Route name="dashboard" path="dashboard" handler={require("./components/Dashboard")} />
        <Route name="calendar" path="calendar" handler={require("react-proxy!./components/Calendar")}>
            <Route name="create-event" path="create-event" handler={require("./components/Calendar/CreateEvent")} />
            <Route name="event-list" path="event-list" handler={require("./components/Calendar/EventList")} />
            <DefaultRoute handler={require("./components/Calendar/EventList")} />
        </Route>
        <Route name="demo" path="demo" handler={require("react-proxy!./components/Demo")} />
        <Route name="im" path="/im" handler={require("react-proxy!./components/InstantMessage")}></Route>
        <Redirect from="/platform" to="/platform/dashboard" />
        <Redirect from="/platform/" to="/platform/dashboard" />
        <Redirect from="/" to="/platform/dashboard" />
        <NotFoundRoute handler={require("./components/NotFound")} />
    </Route>
);
