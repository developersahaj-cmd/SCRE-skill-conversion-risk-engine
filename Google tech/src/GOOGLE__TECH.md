# Google Technologies Integration - SCRE

This project leverages the Google ecosystem to provide a scalable, AI-driven risk assessment experience.

### 1. Google Gemini AI (Gemini 1.5 Flash)
- **Role:** The core "Risk Engine."
- **Implementation:** Processes behavioral inputs and maps them against skill demands to generate "Explainable Factors" as seen in our architecture.
- **Benefit:** Provides real-time, low-latency analysis without a dedicated backend server.

### 2. Firebase
- **Firestore:** Used as a NoSQL database to store and retrieve historical risk assessments.
- **Hosting:** Provides a globally fast CDN to serve the React/JSX frontend.
- **Authentication:** (Planned) To allow users to track their learning journey over time.

### 3. Google Cloud (Vertex AI Readiness)
- While using Gemini API for the MVP, the system is designed to scale into **Google Cloud Vertex AI** for more advanced "Risk Band Assignment" and custom model tuning.

