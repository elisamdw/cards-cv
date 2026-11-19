"use client";

import { useState } from "react";

export default function Page() {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");

  const handleFile = async (file: File) => {
    setImgUrl(URL.createObjectURL(file));
    setOutput("detecting…");

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });

    const res = await fetch("/api/detect", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ image: dataUrl }),
    });
    const data = await res.json();
    setOutput(JSON.stringify(data.cards ?? data, null, 2));
  };

  return (
    <main>
      <label
        className="drop"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </label>

      {imgUrl && <img src={imgUrl} alt="" />}
      {output && <pre>{output}</pre>}
    </main>
  );
}
