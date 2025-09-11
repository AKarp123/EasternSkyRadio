


type InputProps = {
	type?: string,
	label?: string,
	placeholder: string,
	value: string,
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
	className?: string,
	disabled?: boolean,
}

export const InputDefaultClasses = "border border-gray-300 rounded px-2 py-1 font-pixel focus:outline-none w-full"
const Input = ({ type="text", label, placeholder, value, onChange, className, disabled = false }: InputProps) => (
	<div className="flex flex-col">
		{label && <label className="mb-0.5 font-pixel">{label}</label>}
		<input
			type={type}
			placeholder={placeholder}
			onChange={onChange}
			value={value}
			disabled={disabled}
			className={className ? className : InputDefaultClasses}

		/>
	</div>


				
);

export default Input;