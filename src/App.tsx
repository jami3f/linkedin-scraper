import { useState } from "react";
import "./App.css";

function App() {
	const [linkedInURL, setLinkedInURL] = useState<string>("");
	const [person, setPerson] = useState<Person | undefined>({
		name: "Zahid Din",
		linkedInURL: "https://www.linkedin.com/in/zahid-din-3787887/",
		bio: "Zahid is the technology evangelist at Computacenter and manager of the Solutions Center team. He is responsible for creating and demonstrating showcases along with the Solutions Center team. He is also responsible for the technical enablement of the sales team and customers. He has been working in the IT industry for over 20 years and has a wealth of experience in the design and implementation of IT solutions. He has worked in a variety of roles including pre-sales, consultancy, and support. He has a passion for technology and enjoys sharing his knowledge with others.",
		email: "zahid.din@computacenter.com",
		photoURL: "http://imageurl.com",
	});

	interface Person {
		name: string;
		email?: string;
		linkedInURL: string;
		photoURL?: string;
		bio?: string;
	}

	async function onSubmit() {
		const res = await fetch("/screenshot", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url: linkedInURL }),
		});
		// const data = await res.arrayBuffer();
		console.log(res.headers.get("Content-Type"));
		const data = await res.blob();
	}

	return (
		<div className="w-screen h-full flex items-center flex-col gap-6 py-2">
			<div className="w-96 flex items-center gap-1">
				<input
					className="border-2 border-gray-300 bg-white h-10 w-96 px-2 rounded-lg text-sm focus:outline-none"
					title="linkedInURL"
					type="text"
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
							src={"https://picsum.photos/300/300"}
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
