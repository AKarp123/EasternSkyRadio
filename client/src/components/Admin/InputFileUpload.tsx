import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FileUploader } from "react-drag-drop-files";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});


type InputFileUploadProps = {
    uploadImage: (file: File) => void;
};
export default function InputFileUpload({ uploadImage }: InputFileUploadProps) {

    const fileTypes = ["JPG", "PNG", "GIF"];
    
  
    return (
        <FileUploader multiple={false} handleChange={uploadImage} name="filename">
            <div>
            <Button
                size="small"
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
            >
                Upload file
                <VisuallyHiddenInput type="file" />
            </Button>
            </div>
        </FileUploader>
    );
}
