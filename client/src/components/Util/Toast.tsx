import * as Toast from "@radix-ui/react-toast";
import "./Toast.css";
import { CheckIcon, CircleAlertIcon, InfoIcon } from "raster-react";
import { useEffect, useState } from "react";



type ToastProps = {
	open: boolean;
	title: string;
	message?: string;
	type?: "success" | "warning" | "error" | "info";
	showClose?: boolean;
	onClose: () => void;
}


const iconDisplay = ({type} : { type: ToastProps["type"]}) => {
	console.log(type)
	switch (type) {
		case "success":
			return <CheckIcon size={35} color="" strokeWidth={0.25} radius={1} />;
		case "error":
			return <CircleAlertIcon size={35} color="" strokeWidth={0.25} radius={1} />;
		case "warning":
			return <CircleAlertIcon size={35} color="fef493" strokeWidth={0.25} radius={1} />;
		case "info":
			return <InfoIcon size={35} color="#fefefe" strokeWidth={0.25} radius={1} />;
		default:
			return null;
	}
}





const DisplayToast = ({ title, message, type = "error", onClose, open, showClose }: ToastProps) => {
	const [displayOpen, setDisplayOpen] = useState<boolean>(open);


	useEffect(() => {
		const timer = setTimeout(() => {
			setDisplayOpen(false);
			onClose();
		}, 3000);
		return () => clearTimeout(timer);
	}, []);
	console.log("Hello", displayOpen)
	return (
		<Toast.Provider swipeDirection="left">
			<Toast.Root open={displayOpen} className="font-pixel inline-flex items-center backdrop-blur-md border-1 p-2 rounded-md ToastRoot">
				{iconDisplay({type})}
				<Toast.Title>{title}</Toast.Title>
				{message && <Toast.Description>{message}</Toast.Description>}
				{showClose && <Toast.Action onClick={onClose} altText="Close notification">Close</Toast.Action>}
			</Toast.Root>
			<Toast.Viewport className="ToastViewport" />
		</Toast.Provider>
	);
};


export default DisplayToast;
