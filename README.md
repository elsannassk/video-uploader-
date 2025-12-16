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

