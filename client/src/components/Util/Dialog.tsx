import { Dialog as RadixDialog} from "radix-ui";



type DialogProps = {
	open: boolean;

	children: React.ReactNode;
	title?: string;
	description?: string;
	buttons?: React.ReactNode;
	close?: boolean;
	onClose?: () => void;
}

const Dialog = ({ open, children, title, description, buttons, close, onClose }: DialogProps) => {
	return (

		<RadixDialog.Root open={open}>
			<RadixDialog.Portal>
				<RadixDialog.Overlay className="bg-black/50 fixed inset-0" />
				<RadixDialog.Content className="backdrop-blur-md rounded-md p-4 shadow-lg w-[90vw] max-w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none border-[1px] ">
					<RadixDialog.Title className="font-pixel text-lg pb-3">{title}</RadixDialog.Title>
					<RadixDialog.Description>{description}</RadixDialog.Description>
					<div className="flex flex-col gap-3">
						{children}
					</div>
					<RadixDialog.Close asChild>
						<div className="flex flex-row justify-end gap-2 mt-4">
							{close && <button className="font-pixel HoverButtonStyles rounded-md p-2 cursor-pointer" onClick={() => onClose && onClose()}>Close</button>}
							{buttons}
						</div>
					</RadixDialog.Close>
				</RadixDialog.Content>
			</RadixDialog.Portal>
		</RadixDialog.Root>
	);
};



export default Dialog;
