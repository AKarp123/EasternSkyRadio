import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useContext } from "react";
import UserContext, { useAuth } from "./providers/UserProvider";



type props = {
    component: React.ComponentType<any>;
    location?: Location;
    [key: string]: any; // Allow other props to be passed
}

const AuthRoute = ({ component: Component, location, ...rest }: props) => {
    const { user } = useAuth()!;
    if (user === "Loading") {
        return <></>;
    }

    return (
        <Route
            {...rest}
            render={(props) =>
                user ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }, // Save the original location
                        }}
                    />
                )
            }
        />
    );
};

export default AuthRoute;
