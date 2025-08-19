import { Link } from "react-router-dom";
import {
	Container,
	Typography,
	SvgIcon,
	Link as MUILink,
} from "@mui/material";
import { Box } from "@radix-ui/themes";
import { memo } from "react";

// const CustomButton = styled(Button)({
// 	width: "75%",
// 	color: "white",
// 	fontSize: "1.5rem",
// });

type HomeButtonProperties = 
    | { route: string; text: string; link?: never }
    | { route?: never; text: string; link: string };


const HomeButton = memo(({ route, text, link } : HomeButtonProperties) => {
	return (
		<Box
			className="home-button"
		>
			{link ? (
				<MUILink
					href={link}
					target="_blank"
					rel="noreferrer"
					sx={{
						textDecoration: "none",
						color: "white",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Typography
						variant="h3"
						align="left"
						sx={{
							fontFamily: "Tiny5, Roboto",
						}}
					>
						{text}
					</Typography>
					<SvgIcon
						sx={{
							fontSize: "3.5rem",
							transition: "transform 300ms ease-in-out",
						}}
						className="svgIcon"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2zm10-4h2v2h-2zm0 0h-2V5h2zm0 10h2v-2h-2zm0 0h-2v2h2z"
							></path>
						</svg>
					</SvgIcon>
				</MUILink>
			) : (
				<Link
					to={route!}
					style={{
						textDecoration: "none",
						color: "white",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Typography
						variant="h3"
						align="left"
						sx={{
							fontFamily: "Tiny5, Roboto",
						}}
					>
						{text}
					</Typography>
					<SvgIcon
						sx={{
							fontSize: "3.5rem",
							transition: "transform 300ms ease-in-out",
						}}
						className="svgIcon"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2zm10-4h2v2h-2zm0 0h-2V5h2zm0 10h2v-2h-2zm0 0h-2v2h2z"
							></path>
						</svg>
					</SvgIcon>
				</Link>
			)}
		</Box>
	);
});

export const HomeButtonNoRoute = memo(({ text } : { text: string }) => {
	return (
		<Container
			sx={{
				"&:after": {
					display: "block",
					content: "''",
					borderBottom: "0.5px solid white",
					transform: "scaleX(0)",
					transition: "transform 300ms ease-in-out",
				},
				"&:hover:after": {
					transform: "scaleX(1)",
				},
				"&:hover .svgIcon": {
					transform: "translateX(20px)",
					transition: "transform 300ms ease-in-out",
				},
				"&:hover": {
					cursor: "pointer",
				},
			}}
		>
			<Box
				className="no-underline text-white items-center justify-between"
			>
				<Typography
					variant="h3"
					align="left"
					sx={{
						fontFamily: "Tiny5, Roboto",
					}}
				>
					{text}
				</Typography>
				<SvgIcon
					sx={{
						fontSize: "3.5rem",
						transition: "transform 300ms ease-in-out",
					}}
					className="svgIcon"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2zm10-4h2v2h-2zm0 0h-2V5h2zm0 10h2v-2h-2zm0 0h-2v2h2z"
						></path>
					</svg>
				</SvgIcon>
			</Box>
		</Container>
	);
});

export default HomeButton;
