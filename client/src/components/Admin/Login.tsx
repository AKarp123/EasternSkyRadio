import { useState, useContext } from "react";
import axios, { AxiosError } from "axios";
import ErrorContext from "../../providers/ErrorContext";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/UserProvider";
import { Button, Container, Flex, Separator, Text, TextField } from "@radix-ui/themes";

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
				<Flex className="flex-col gap-4 text-center border-white border-[1px] py-8 px-4 rounded-xl backdrop-blur-[4px]">
					<Text size="9" className="font-tiny mb-4"> Login</Text>
					<Separator orientation="horizontal" className="my-1" size="4" />
					
					<TextField.Root placeholder="Username" value={"admin"} disabled className="text-gray-500"/>
					<TextField.Root placeholder="Password" value={password} type="password" onChange={(e) => setPassword(e.target.value)}/>

					<Button type="submit" className="cursor-pointer mt-2" color="gray">Login</Button>
				</Flex>
			</form>

		</Container>
	);
};

export default Login;
