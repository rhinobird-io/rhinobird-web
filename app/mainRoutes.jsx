var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

// polyfill
if(!Object.assign)
	Object.assign = React.__spread;

// export routes
module.exports = (
    <Route>
        <Route name="app" handler={require("./components/Application")}>
            <Route name="signin" path="/signin" handler={require("react-proxy!./components/Signin")}></Route>
            <Route name="home" path="/" handler={require("./components/Home")} />
            <Route name="calendar" path="/calendar" handler={require("react-proxy!./components/Calendar")}>
                <Route name="create-event" path="create-event" handler={require("./components/Calendar/CreateEvent")} />
                <Route name="event-list" path="event-list" handler={require("./components/Calendar/EventList")} />
                <DefaultRoute handler={require("./components/Calendar/EventList")} />
            </Route>
            <DefaultRoute handler={require("./components/Home")} />
            <NotFoundRoute handler={require("./components/NotFound")} />
        </Route>
    </Route>
);