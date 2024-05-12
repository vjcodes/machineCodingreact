import { useEffect, useState } from "react";
import Notes from "./components/Notes";
import axios from "axios";

const App = () => {
  const [start, setStart] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [notes, setNotes] = useState([
    {
      id: 1,
      text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi, expedita?",
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum aperiam nihil ad magni perferendis modi sed consequatur sit hic dicta?",
    },
  ]);

  useEffect(() => {
    if (start === 1) {
      axios
        .get("https://hacker-news.firebaseio.com/v0/jobstories.json")
        .then((response) => setJobs(response.data));
    }
  }, []);

  console.log(jobs);

  return (
    <div>
      {/* <Notes notes={notes} setNotes={setNotes}/> */}
      {jobs.slice(6 * start - 6, 6 * start).map((job) => (
        <div key={job}>{job}</div>
      ))}
      <button onClick={() => setStart(jobs + 1)}>Get more</button>
    </div>
  );
};

export default App;
