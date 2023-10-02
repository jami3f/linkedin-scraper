import { useState } from "react";
import "./App.css";

function App() {
	const [linkedInURL, setLinkedInURL] = useState<string>("");

	interface Person {
		name: string;
		email?: string;
		linkedInURL: string;
		photoURL?: string;
		bio?: string;
	}

	function onSubmit() {}

	return (
		<div className="w-screen flex justify-center items-center gap-1">
			<input
				className="border-2 border-gray-300 bg-white h-10 w-96 px-2 rounded-lg text-sm focus:outline-none"
				title="linkedInURL"
				type="text"
				onChange={e => setLinkedInURL(e.target.value)}
			/>
			<button
				type="submit"
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 h-8 rounded"
			>
				Submit
			</button>
		</div>
	);
}

export default App;
