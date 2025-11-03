"use client";
import React from "react";

const container: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
  background: "linear-gradient(180deg, #0a0f1a, #111827)",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  color: "#e5e7eb",
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: 1100,
  background: "#1e293b",
  borderRadius: 18,
  boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
  padding: 36,
  textAlign: "center",
};

const title: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
  color: "#38bdf8",
  marginBottom: 10,
};

const subtitle: React.CSSProperties = {
  fontSize: 16,
  color: "#94a3b8",
  marginBottom: 26,
  lineHeight: 1.6,
  maxWidth: 800,
  marginLeft: "auto",
  marginRight: "auto",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  color: "#f1f5f9",
  marginBottom: 10,
  marginTop: 20,
};

const codeBlock: React.CSSProperties = {
  background: "#0f172a",
  color: "#e2e8f0",
  textAlign: "left",
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace",
  borderRadius: 8,
  padding: 16,
  fontSize: 13,
  overflowX: "auto",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
};

const row: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 24,
  justifyContent: "center",
  alignItems: "stretch",
  marginTop: 16,
};

const column: React.CSSProperties = {
  flex: "1 1 420px",
  minWidth: 320,
  maxWidth: 500,
  display: "flex",
  flexDirection: "column",
  justifyContent: "stretch",
};

const exampleJson: React.CSSProperties = {
  ...codeBlock,
  whiteSpace: "pre-wrap",
  lineHeight: 1.5,
};

const schemaText: React.CSSProperties = {
  textAlign: "left",
  maxWidth: 800,
  margin: "20px auto",
  color: "#cbd5e1",
  lineHeight: 1.7,
  fontSize: 15,
};

export default function HomePage() {
  const endpoint = "https://post-generator-api.vercel.app/api/generate-post";

  return (
    <main style={container}>
      <div style={card}>
        <h1 style={title}>Social Post Generator API</h1>

        <p style={subtitle}>
          Generate structured, platform-tailored post ideas using AI. Send a JSON
          POST request to the endpoint below<br></br>This page documents how to use it.
        </p>

        <div style={{ marginBottom: 18 }}>
          <div style={sectionTitle}>Endpoint</div>
          <div style={{ ...codeBlock, display: "inline-block" }}>{`POST ${endpoint}`}</div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={sectionTitle}>Example Request Body</div>
          <div style={exampleJson}>
            {`{
  "topic": "AI in education",
  "tone": "informative",
  "platform": "twitter",
  "count": 2,
  "audience": "students and professors",
  "postType": "thread",
  "goal": "drive engagement"
}`}
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={sectionTitle}>Request Schema</div>
          <div style={schemaText}>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <strong style={{ color: "#38bdf8" }}>topic</strong>: Required string. Must be at least 3 characters long. Represents
                the main idea or theme of the post.
              </li>
              <li style={{ marginTop: 10 }}>
                <strong style={{ color: "#38bdf8" }}>tone</strong>: Optional string. Describes the post’s mood or communication
                style.
              </li>
              <li style={{ marginTop: 10 }}>
                <strong style={{ color: "#38bdf8" }}>platform</strong>: Optional string. Defines where the post will be used.
              </li>
              <li style={{ marginTop: 10 }}>
                <strong style={{ color: "#38bdf8" }}>count</strong>: Optional integer between 1 and 5. Specifies how many post
                ideas to generate.
              </li>
              <li style={{ marginTop: 10 }}>
                <strong style={{ color: "#38bdf8" }}>audience</strong>: Optional string. Target audience of the post.
              </li>
              <li style={{ marginTop: 10 }}>
                <strong style={{ color: "#38bdf8" }}>postType</strong>: Optional string. Type of post such as “thread”, “story”,
                “announcement”, etc.
              </li>
              <li style={{ marginTop: 10 }}>
                <strong style={{ color: "#38bdf8" }}>goal</strong>: Optional string. The objective or purpose of the post.
              </li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={sectionTitle}>Using the API</div>

          <div style={row}>
            <div style={column}>
              <div style={{ fontWeight: 600, marginBottom: 8, color: "#38bdf8" }}>fetch()</div>
              <div style={codeBlock}>
                {`fetch("${endpoint}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    topic: "AI in education",
    tone: "informative",
    platform: "twitter",
    count: 2
  })
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`}
              </div>
            </div>

            <div style={column}>
              <div style={{ fontWeight: 600, marginBottom: 8, color: "#38bdf8" }}>cURL</div>
              <div style={codeBlock}>
                {`curl -X POST ${endpoint} \\
-H "Content-Type: application/json" \\
-d '{
  "topic": "AI in education",
  "tone": "informative",
  "platform": "twitter",
  "count": 2
}'`}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 26 }}>
          <div style={sectionTitle}>Example Response</div>
          <div style={exampleJson}>
            {`{
  "success": true,
  "topic": "AI in education",
  "tone": "informative",
  "platform": "twitter",
  "ideas": [
    {
      "caption": "AI is transforming classrooms!",
      "hashtags": ["#AI", "#Education", "#EdTech"],
      "image_keywords": ["AI classroom", "students learning", "digital education"]
    }
  ]
}`}
          </div>
        </div>
      </div>
    </main>
  );
}

