import { DeleteIcon } from "raster-react";
import DisplayTooltip from "./Tooltip";

type ChipProps = {
	label: string;
	onDelete?: () => void;
	removeLabel?: string;
}	


const Chip = ({ label, onDelete, removeLabel }: ChipProps) => {
	return (
		<div className="inline-flex items-center px-3 py-1 gap-1 rounded-xl border-[1px] border-gray-300 text-white text-sm font-pixel">
			<span>{label}</span>
			{onDelete && (
				<DisplayTooltip content={removeLabel || "Delete"}>
					<button onClick={onDelete} type="button" className="cursor-pointer">
						<DeleteIcon size={16} color="" strokeWidth={5} radius={0} />
					</button>
				</DisplayTooltip>
			)}
		</div>
	);
}

export default Chip;