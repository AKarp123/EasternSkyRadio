import ReactDOM from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.querySelector("#root") as HTMLElement);
root.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
    
);

