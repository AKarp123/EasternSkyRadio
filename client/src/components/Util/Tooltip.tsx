import * as Tooltip from "@radix-ui/react-tooltip";
import "./Tooltip.css";

interface TooltipProps {
	content: string | null;
	children: React.ReactNode;

}
const DisplayTooltip = ({ content, children }: TooltipProps) => {
	if(!content || content.length === 0) {
		return children;
	}
	return (
		<Tooltip.Provider delayDuration={0}>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content forceMount className=" text-white font-pixel m-2 p-1 rounded-md Tooltip">{content}</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
};

export default DisplayTooltip;
