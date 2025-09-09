import { useState, useContext } from "react";
import axios, { AxiosError } from "axios";
import ErrorContext from "../../providers/ErrorContext";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/UserProvider";
import { Container, Flex, Separator, Text, TextField } from "@radix-ui/themes";

const Login = () => {
	const [password, setPassword] = useState("");
	const setError = useContext(ErrorContext);
	const { user, setUser } = useAuth();
	const history = useHistory();
	const location = useLocation();

	const { from } = (location.state as { from?: { pathname: string } }) || { from: { pathname: "/admin" } };
	const login = () => {
		axios
			.post("/api/login", { username: "admin", password })
			.then((res) => {
				if (res.data.success) {
					setUser(res.data.user);
					setError(res.data.message, "success");
				} else {
					setError(res.data.message);
				}
			})
			.catch((error: AxiosError) => {
				if(error.response?.status === 401) {
					setError("Invalid username or password");
					return;
				}
				setError("Failed to login: " + error.message);
			});
	};

	if (user) {
		history.replace(from || "/admin");
	}
	return (
		<Container
			size="1"
			className="min-h-screen flex flex-row justify-center items-center">

			<form onSubmit={(e) => {
				e.preventDefault();
				login();
			}}>
				<Flex className="flex-col gap-4 text-center  py-8 px-4 rounded-xl ">
					<Text size="7" className="font-tiny mb-4"> Login</Text>
				
					
					<TextField.Root placeholder="Username" value={"admin"} disabled className="text-gray-500"/>
					<TextField.Root placeholder="Password" value={password} type="password" onChange={(e) => setPassword(e.target.value)}/>

					<Flex className="flex-row gap-4 ">
						<button
							type="submit"
							className=" text-white font-pixel text-2xl py-2 px-4 focus:outline-none focus:shadow-outline flex-1 cursor-pointer"
						>
							Login
						</button>
					</Flex>
					
				</Flex>
			</form>

		</Container>
	);
};

export default Login;
