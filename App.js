import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [variants, setVariants] = useState([]);
  const [profile, setProfile] = useState("P1");
  const [tasks, setTasks] = useState([]);

  const loadTasks = () =>
    fetch("http://localhost:3001/tasks")
      .then(res => res.json())
      .then(setTasks);

  useEffect(() => {
    loadTasks();
    const i = setInterval(loadTasks, 2000);
    return () => clearInterval(i);
  }, []);

  const upload = async () => {
    if (!file || variants.length === 0) {
      alert("Select video & format");
      return;
    }

    const fd = new FormData();
    fd.append("video", file);
    fd.append("variants", JSON.stringify(variants));
    fd.append("profile", profile);

    await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: fd,
    });

    setFile(null);
    loadTasks();
  };

  const deleteVideo = async (id) => {
    await fetch(`http://localhost:3001/videos/${id}`, {
      method: "DELETE",
    });
    loadTasks();
  };

  return (
    <div className="container">
      <h1>🎬 Video Processor</h1>

      <div className="card">
        {/* 🔒 ONLY VIDEO FILES CAN BE SELECTED */}
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          onChange={e => setFile(e.target.files[0])}
        />

        <label>
          <input
            type="checkbox"
            onChange={e =>
              setVariants(v =>
                e.target.checked ? [...v, "V1"] : v.filter(x => x !== "V1")
              )
            }
          /> MP4 (H.264)
        </label>

        <label>
          <input
            type="checkbox"
            onChange={e =>
              setVariants(v =>
                e.target.checked ? [...v, "V2"] : v.filter(x => x !== "V2")
              )
            }
          /> WebM (VP9)
        </label>

        <select onChange={e => setProfile(e.target.value)}>
          <option value="P1">480p</option>
          <option value="P2">720p</option>
          <option value="P3">1080p</option>
        </select>

        <button onClick={upload}>Upload</button>
      </div>

      <div className="card">
        <h2>Tasks</h2>

        {tasks.map(t => (
          <div key={t.id} className="task">
            <span>
              {t.filename} | {t.output_format} | {t.profile}
            </span>

            <span className={`status ${t.status}`}>
              {t.status}
            </span>

            {t.status === "COMPLETED" && (
              <a
                href={`http://localhost:3001/download/${t.video_id}`}
                style={{ marginLeft: "10px" }}
              >
                Download
              </a>
            )}

            <button
              onClick={() => deleteVideo(t.video_id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
