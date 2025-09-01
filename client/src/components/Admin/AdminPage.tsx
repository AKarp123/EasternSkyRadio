
import { useContext, useState } from "react";
import { useAuth } from "../../providers/UserProvider";
import HomeButton, { HomeButtonNoRoute } from "../Home/HomeButton";
import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import { Box, Container, Flex, Grid, Text } from "@radix-ui/themes";
import { showDateString } from "../Util/DateUtil";
import { SiteDataContext } from "../../providers/SiteDataProvider";

const AdminPage = () => {
	const { setUser } = useAuth()!;
	const setError = useContext(ErrorContext);
	const [changePasswordDialog, setChangePasswordDialog] = useState(false);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { siteData, loading} = useContext(SiteDataContext);

	const logout = (e : React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault();
		axios.post("/api/logout").then(() => {
			setError("Logged out successfully", "success");
		});
		setUser(null);
	};



	const updatePassword = () => {
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		axios.patch("/api/user/password", { password }).then((res) => {
			if (res.data.success) {
				setError(res.data.message, "success");
                
			} else {
				setError(res.data.message);
			}
		});
	};

	return (
		<Container size={{
			xs: "1",
			sm: "3"
		}}
		className="min-h-screen flex flex-col justify-center items-center pt-20 pb-8">
			<Box className="flex font-tiny text-6xl white flex-col text-center">
			</Box>
			<Grid columns={{ xs: "1", sm: "2" }} gap="16px" justify="center" align="center">
				<Flex className="items-center flex flex-col justify-center flex-1">
					<p className="text-lg font-pixel align-top flex justify-center transition-all duration-300">Next Show Date: {loading ? "..." :  showDateString(siteData!)}</p>
					<Text size="9" className="font-tiny text-center w-full inline-block mb-4">Admin</Text>
				</Flex>
				<Flex className="items-center flex flex-col justify-center flex-1">
					<HomeButton text="New Show Log" route="/admin/newshow" />
					<HomeButton text="Set Planner" route="/admin/setplanner" />
					<HomeButton text="Edit Log" route="/admin/editshow" />
					<HomeButton text="Edit Song" route="/admin/editsong" />
					<Box onClick={() => setChangePasswordDialog(true)}>
						<HomeButtonNoRoute text="Change Password" />
					</Box>
					<Box onClick={(e) => logout(e)}>
						<HomeButton text="Logout" route="/login" />
					</Box>
				</Flex>
			</Grid>
		</Container>
	);
};

export default AdminPage;
