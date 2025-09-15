import { Container, Typography } from "@mui/material";
import BackButton from "./BackButton";

const PageHeader = ({title} : {title: string}) => {
	return (
		<Container
			sx={{
				textDecoration: "none",
				color: "white",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				position: "relative",
				gap: 2
			}}
		>
			<BackButton />

			<Typography
				variant="h3"
				sx={{
					fontFamily: "Tiny5, Roboto",
				}}
			>
				{title}
			</Typography>
		</Container>
	);
}

export default PageHeader;
