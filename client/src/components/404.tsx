import { Container } from "@radix-ui/themes"
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Text } from "@radix-ui/themes";


const NotFound = ({auth}: {auth: boolean}) => {
	const history = useHistory();
	useEffect(() => {
		setTimeout(() => {
			// Redirect to home after 5 seconds
			if(auth) {
				history.push("/admin");
			}
			else {
				history.push("/");
			}
		}, 5000);
	}, []);

	return (<Container className="min-h-screen flex flex-col justify-center items-center text-pixel text-center">
		<Text size="9" className="font-tiny text-center w-full inline-block mb-4">404 - Page Not Found</Text>

	</Container>);
}

export default NotFound;