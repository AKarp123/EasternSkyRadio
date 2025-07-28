import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "./providers/UserProvider";



type properties = {
    component: React.ComponentType<any>;
    location?: Location;
    [key: string]: any; // Allow other props to be passed
}

const AuthRoute = ({ component: Component, location, ...rest }: properties) => {
	const { user } = useAuth()!;
	if (user === "Loading") {
		return <></>;
	}

	return (
		<Route
			{...rest}
			render={(properties) =>
				user ? (
					<Component {...properties} />
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: properties.location }, // Save the original location
						}}
					/>
				)
			}
		/>
	);
};

export default AuthRoute;
