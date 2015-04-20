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
            <DefaultRoute handler={require("./components/Home")} />
            <NotFoundRoute handler={require("./components/NotFound")} />
        </Route>
    </Route>
);