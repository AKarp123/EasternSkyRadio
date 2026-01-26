import { Container, Separator } from "@radix-ui/themes";
import { useContext, useEffect, useReducer, useState } from "react";
import { SiteData } from "../../types/global";
import PageHeader from "../PageHeader";

import axios from "axios";
import ErrorContext from "../../providers/ErrorContext";
import { Form } from "radix-ui";
import Input from "../Util/Input";




type ReducerAction = "setShowDay" | "setShowHour" | "setShowLength" | "setOnBreak" | "toggleOnBreak";


const reducer = (state: SiteData, action: { type: ReducerAction; payload?: any }) => {

	switch (action.type) {
		case "setShowDay": {
			return { ...state, showDay: action.payload };
		}
		case "setShowHour": {
			return { ...state, showHour: action.payload };
		}
		case "setShowLength": {
			return { ...state, showLength: action.payload };
		}
		case "setOnBreak": {
			return { ...state, onBreak: action.payload };
		}
		case "toggleOnBreak": {
			return { ...state, onBreak: !state.onBreak };
		}
		default: {
			return state;
		}
	}
};

const SiteConfig = () => {
	const setError = useContext(ErrorContext)
	const [loading, setLoading] = useState(true);
	const [state, dispatch] = useReducer(reducer, {} as SiteData);



	useEffect(() => {
		axios.get<SiteData>("/api/siteInfo")
			.then((res) => {
				dispatch({ type: "setShowDay", payload: res.data.showDay });
				dispatch({ type: "setShowHour", payload: res.data.showHour });
				dispatch({ type: "setShowLength", payload: res.data.showLength });
				dispatch({ type: "setOnBreak", payload: res.data.onBreak });
				setLoading(false);
			})
			.catch((error) => {
				setError("Failed to load site configuration");
				console.error("Error fetching site data:", error);
				setLoading(false);
			});


	}, [])
	const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validate()) {
			setError("Please enter valid values for all fields");
			return;
		}

		const payload = {
			...state,
			showDay: Number(state.showDay),
			showHour: Number(state.showHour),
			showLength: Number(state.showLength),
		};
		const res = await axios.patch("/api/siteInfo", payload);
		if (res.data.success) {
			setError("Site configuration updated successfully", "success");
		} else {
			setError("Failed to update site configuration");
		}

	}

	const validate = () => {
		const day = Number(state.showDay);
		const hour = Number(state.showHour);
		const length = Number(state.showLength);

		if (!Number.isInteger(day) || day < 0 || day > 6) return false;
		if (!Number.isInteger(hour) || hour < 0 || hour > 23) return false;
		if (!Number.isInteger(length) || length < 0) return false;

		return true;
	};


	if (loading) {
		return (
			<Container size='4' className="min-h-screen mx-auto items-center max-w-[40%] justify-center text-center">
				<p className="font-pixel">Loading...</p>
			</Container>
		);
	}
	return (
		<Container size='4' className="min-h-screen mx-auto items-center max-w-[40%] justify-center">

			<PageHeader title="Site Configuration" />
			<Separator size='4' orientation="horizontal" className="w-full my-1"/>
			<Form.Root onSubmit={handleSubmit} className="w-full mt-4 flex flex-col gap-2">
				<Form.Field className="flex flex-col gap-1" name="showDay">
	
					<Form.Control asChild>
						<Input label="Show Day (0 = Sunday, 1 = Monday, etc.)" type="number" value={state.showDay} onChange={(e) => dispatch({ type: "setShowDay", payload: Number.parseInt(e.target.value) })} placeholder="Show Day" />
					</Form.Control>
					<Form.Message className="text-red-500 font-pixel" match="valueMissing">This field is required</Form.Message>
					<Form.Message className="text-red-500 font-pixel" match="typeMismatch">Please enter a valid number</Form.Message>
					
				</Form.Field>
				<Form.Field className="flex flex-col gap-1" name="showHour">

					<Form.Control asChild>
						<Input label="Show Hour (0-23)" type="number"  value={state.showHour} onChange={(e) => dispatch({ type: "setShowHour", payload: Number.parseInt(e.target.value) })} placeholder="Show Hour" />
					</Form.Control>
					<Form.Message className="text-red-500 font-pixel" match="valueMissing">This field is required</Form.Message>
					<Form.Message className="text-red-500 font-pixel" match="typeMismatch">Please enter a valid number</Form.Message>
				</Form.Field>
				<Form.Field className="flex flex-col gap-1" name="showLength">

					<Form.Control asChild>
						<Input label="Show Length (in hours)" type="number" value={state.showLength} onChange={(e) => dispatch({ type: "setShowLength", payload: Number.parseInt(e.target.value) })} placeholder="Show Length" />
					</Form.Control>
					<Form.Message className="text-red-500 font-pixel" match="valueMissing">This field is required</Form.Message>
					<Form.Message className="text-red-500 font-pixel" match="typeMismatch">Please enter a valid number</Form.Message>
				</Form.Field>
				<Form.Field className="flex items-center gap-2" name="onBreak">
					<Form.Control asChild>
						<input type="checkbox" checked={state.onBreak} onChange={() => dispatch({ type: "toggleOnBreak" })} className="w-4 h-4" />
					</Form.Control>
					<Form.Label className="font-pixel text-lg">On Break</Form.Label>
				</Form.Field>
				<button type="submit" className="text-white font-pixel  border p-1 rounded-md focus:outline-none focus:shadow-outline  cursor-pointer HoverButtonStyles">Save Configuration</button>
			</Form.Root>


		</Container>
	);
};



export default SiteConfig;