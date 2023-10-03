import { useState } from "react";
import "./App.css";

function App() {
	const [linkedInURL, setLinkedInURL] = useState<string>("https://www.linkedin.com/in/zahid-din-3787887/");
	const [person, setPerson] = useState<Person | undefined>();

	interface Person {
		name: string;
		email?: string;
		linkedInURL: string;
		profilePic?: string;
		bio?: string;
	}

	async function onSubmit() {
		const res = await fetch("/scrape", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url: linkedInURL }),
		});
		if (!res.ok) throw new Error("Something went wrong");
		const data = await res.json();
		console.log(data);
		setPerson({ ...data, linkedInURL });
		console.log(person);
	}

	return (
		<div className="w-screen h-full flex items-center flex-col gap-6 py-2">
			<div className="w-96 flex items-center gap-1">
				<input
					className="border-2 border-gray-300 bg-white h-10 w-96 px-2 rounded-lg text-sm focus:outline-none"
					title="linkedInURL"
					type="text"
					placeholder={`https://www.linkedin.com/in/zahid-din-3787887/`}
					onChange={e => setLinkedInURL(e.target.value)}
				/>
				<button
					type="submit"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 h-8 rounded"
					onClick={onSubmit}
				>
					Submit
				</button>
			</div>
			{person && (
				<>
					<div className="w-96 flex flex-col items-center">
						<h1 className="font-bold">Name</h1>
						<p>{person.name}</p>
					</div>
					<div className="w-96 flex flex-col items-center">
						<h1 className="font-bold">Email</h1>
						<p>{person.email}</p>
					</div>
					<div className="w-96 flex flex-col items-center">
						<h1 className="font-bold">LinkedIn</h1>
						<p>{person.linkedInURL}</p>
					</div>
					<div className="w-96 flex flex-col items-center">
						<h1 className="font-bold">Photo</h1>
						<img
							alt="Profile pic"
							src={`data:image/png;base64, ${person.profilePic}`}
						/>
					</div>
					<div className="w-96 flex flex-col items-center">
						<h1 className="font-bold">Bio</h1>
						<textarea
							title="bio"
							className="border-2 border-gray-300 bg-white h-32 w-[50rem] px-2 rounded-lg text-sm focus:outline-none"
							value={person.bio}
						/>
					</div>
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 h-8 rounded"
						// onClick={onSubmit}
					>
						Complete
					</button>
				</>
			)}
		</div>
	);
}

export default App;
