import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import ErrorContext from "./ErrorContext";
// Create the user context
const UserContext = createContext();

export const useAuth = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState("Loading");
    const setError = useContext(ErrorContext);

    useEffect(() => {
        axios
            .get("/api/getUser")
            .then((res) => {
                if (res.data.user != null) {
                    setUser(res.data.user);
                }
                else {
                    setUser(null);
                }
            })
            .catch((err) => {
                setError("Failed to get user");

            });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
