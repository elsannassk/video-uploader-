# video-uploader-
# 🎬 Asynchronous Video Processing System

This project is a full-stack asynchronous video upload and processing system built using **React**, **Node.js**, **Express**, and **PostgreSQL**.

It simulates real-world video platforms (like YouTube or cloud media services) where uploading a video and processing it are treated as separate responsibilities.

---

## Features

- Upload video files (max 200 MB)
- Supported input formats:
  - MP4
  - MOV
  - WebM
- Automatic creation of multiple output variants per video
- Asynchronous task processing
- Task lifecycle tracking:
  - QUEUED
  - PROCESSING
  - COMPLETED
  - FAILED
- Real-time task status updates
- Download processed videos
- Delete videos and associated tasks
- Backend-enforced validation and security

---

## Tech Stack

### Frontend
- React
- HTML, CSS
- Fetch API

### Backend
- Node.js
- Express.js
- Multer (file uploads)
- PostgreSQL
- pg (Postgres client)

---

## 📁 Project Structure
video-uploader/
│
├── backend/
│ ├── server.js
│ ├── db.js
│ ├── uploads/
│ └── package.json
│
├── frontend/
│ └── src/
│ ├── App.js
│ ├── App.css
│ └── index.js
│
├── database.sql
├── README.md
└── DESIGN_NOTES.md


How the Application Works

This application is an asynchronous video upload and processing system designed to simulate how real-world video platforms handle large media files without blocking user interactions.

Video Upload
The user uploads a video file through the frontend interface.
Only video files of type MP4, MOV, or WebM are allowed.
The maximum file size is 200 MB.
File type restrictions are enforced at both frontend and backend levels to prevent invalid uploads.
Once the user selects a valid video and clicks Upload, the request is sent to the backend server.

Immediate Response & Task Creation
The backend performs the following actions:
Validates the file size and format.
Stores the uploaded video file on the server
Saves video metadata in the database.
Automatically creates multiple processing tasks for the uploaded video (one per output variant).
The upload request returns immediately after task creation, without waiting for processing to finish.
This ensures the application remains fast and responsive.
Each processing task runs independently and follows a defined lifecycle:

QUEUED → PROCESSING → COMPLETED / FAILED
Tasks start in the QUEUED state.
They move to PROCESSING after a short delay.
Tasks either COMPLETED successfully or FAILED due to simulated errors.
Processing is intentionally asynchronous to represent long-running video operations such as transcoding.

The frontend periodically requests task updates from the backend.
Task states are fetched every few seconds.
The UI updates automatically to reflect the latest status.
Users can see real-time progress without refreshing the page.
This allows multiple videos to be in different processing states at the same time.

Download and Delete Operations
Download is enabled only when a task reaches the COMPLETED state.
The backend securely serves the processed video file.
Delete removes both:
The video file from the server
Associated database records
This ensures data consistency and prevents unused files from remaining on the system.

Failure Handling
Some tasks may fail during processing.
Failed tasks store error information in the database.
The UI clearly indicates failed states.
Users can delete failed tasks and videos safely.
This models real-world scenarios where processing may not always succeed.
