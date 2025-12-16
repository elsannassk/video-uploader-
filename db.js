const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
app.use("/uploads", express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "video/mp4",
      "video/quicktime", // MOV
      "video/webm",
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only MP4, MOV, WebM allowed"));
    }
    cb(null, true);
  },
});

app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const { variants, profile } = req.body;
    const parsedVariants = JSON.parse(variants);

    const videoResult = await pool.query(
      "INSERT INTO videos (filename, filepath) VALUES ($1,$2) RETURNING *",
      [req.file.filename, req.file.path]
    );

    const video = videoResult.rows[0];

    for (const variant of parsedVariants) {
      const task = await pool.query(
        `INSERT INTO tasks
         (video_id, output_format, profile, status)
         VALUES ($1,$2,$3,'QUEUED')
         RETURNING *`,
        [video.id, variant, profile]
      );

      simulateTask(task.rows[0].id);
    }

    res.json({ message: "Upload successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ---------- TASK SIMULATION ---------- */
function simulateTask(taskId) {
  setTimeout(async () => {
    await pool.query(
      "UPDATE tasks SET status='PROCESSING', started_at=NOW() WHERE id=$1",
      [taskId]
    );
  }, 2000);

  setTimeout(async () => {
    const failed = Math.random() < 0.2;

    if (failed) {
      await pool.query(
        `UPDATE tasks
         SET status='FAILED',
             completed_at=NOW(),
             error_message='Transcoding failed'
         WHERE id=$1`,
        [taskId]
      );
    } else {
      await pool.query(
        `UPDATE tasks
         SET status='COMPLETED',
             completed_at=NOW()
         WHERE id=$1`,
        [taskId]
      );
    }
  }, 7000);
}

app.get("/tasks", async (req, res) => {
  const result = await pool.query(`
    SELECT t.*, v.filename
    FROM tasks t
    JOIN videos v ON t.video_id = v.id
    ORDER BY t.created_at DESC
  `);
  res.json(result.rows);
});

app.get("/download/:videoId", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM videos WHERE id=$1",
    [req.params.videoId]
  );
  if (!result.rows.length) return res.sendStatus(404);

  const file = result.rows[0];
  res.download(path.join(__dirname, file.filepath), file.filename);
});

app.delete("/videos/:videoId", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM videos WHERE id=$1",
    [req.params.videoId]
  );

  if (result.rows.length) {
    fs.unlinkSync(result.rows[0].filepath);
    await pool.query("DELETE FROM videos WHERE id=$1", [req.params.videoId]);
  }
  res.json({ message: "Deleted" });
});

app.listen(3001, () =>
  console.log("Backend running on port 3001")
);
