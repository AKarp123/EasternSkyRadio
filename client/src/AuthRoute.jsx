import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useContext } from "react";
import UserContext, { useAuth } from "./providers/UserProvider";

const AuthRoute = ({ component: Component, isAuthenticated, ...rest }) => {
    const { user } = useAuth();
    if(user === "Loading") {
        return <></>
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
