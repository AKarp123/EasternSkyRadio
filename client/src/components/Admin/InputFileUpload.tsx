import * as React from "react";
import { Button, Text } from "@radix-ui/themes";
import { FileUploader } from "react-drag-drop-files";

// const VisuallyHiddenInput = styled("input")({
// 	clip: "rect(0 0 0 0)",
// 	clipPath: "inset(50%)",
// 	height: 1,
// 	overflow: "hidden",
// 	position: "absolute",
// 	bottom: 0,
// 	left: 0,
// 	whiteSpace: "nowrap",
// 	width: 1,
// });

const VisuallyHiddenInput = ({...props}: React.InputHTMLAttributes<HTMLInputElement>) => (
	<input
		style={{
			clip: "rect(0 0 0 0)",
			clipPath: "inset(50%)",
			height: 1,
			overflow: "hidden",
			position: "absolute",
			bottom: 0,
			left: 0,
			whiteSpace: "nowrap",
			width: 1,
		}}
		onKeyDown={(e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				e.stopPropagation();
			}}}
		{...props}
	/>
);


type InputFileUploadProperties = {
	uploadImage: (file: File) => void;
};
export default function InputFileUpload({ uploadImage }: InputFileUploadProperties) {

	const fileTypes = ["jpg", "png", "gif"];


	return (
		<FileUploader multiple={false} handleChange={uploadImage} name="filename" types={fileTypes}>
			<div>
				<Button
					color="gray"
					type="button"
					className="cursor-pointer"
					tabIndex={-1}
				>
					<Text size="3" className="font-pixel">Upload file</Text>
					{/* <VisuallyHiddenInput type="file" /> */}

				</Button>
			</div>
		</FileUploader>
	);
}