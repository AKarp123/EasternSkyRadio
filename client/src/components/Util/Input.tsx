import React from 'react';




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

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ type="text", label, placeholder, value, onChange, className, disabled = false }, ref) => (
	<div className="flex flex-col">
		{label && <label className=" font-pixel">{label}</label>}
		<input
			ref={ref}
			type={type}
			placeholder={placeholder}
			onChange={onChange}
			value={value}
			disabled={disabled}
			className={className || InputDefaultClasses}
		/>
	</div>
));

export default Input;