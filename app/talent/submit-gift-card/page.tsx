"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubmitGiftCardPage() {
  const router = useRouter();
  const [method, setMethod] = useState<string>("APPLE");
  const [code, setCode] = useState("");
  const [jobId, setJobId] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_BYTES = 5 * 1024 * 1024; // 5MB

  function fileToBase64(file: File) {
    return new Promise<{ b64: string; mime: string }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const comma = result.indexOf(",");
        const mime = result.substring(5, result.indexOf(";"));
        const b64 = result.substring(comma + 1);
        resolve({ b64, mime });
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const { b64, mime } = await fileToBase64(f);
      // approximate decoded bytes
      const bytes = Math.floor((b64.length * 3) / 4);
      if (bytes > MAX_BYTES) {
        setError("Image too large (max 5MB)");
        return;
      }
      setImageBase64(b64);
      setImageMime(mime);
      setImagePreview(URL.createObjectURL(f));
    } catch (err) {
      setError("Failed to read file");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!code.trim()) return setError("Please enter gift card code");
    setSubmitting(true);
    try {
      const payload: any = { method, code: code.trim() };
      if (jobId.trim()) payload.jobId = jobId.trim();
      if (imageBase64 && imageMime) {
        payload.imageBase64 = imageBase64;
        payload.imageMime = imageMime;
      }

      const res = await fetch("/api/talent/submit-gift-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      router.push("/talent/profile?giftSubmitted=1");
    } catch (err: any) {
      setError(err.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit Gift Card</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm">Method</span>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full mt-1">
            <option value="APPLE">Apple</option>
            <option value="RAZAR">Razar Gold</option>
            <option value="STEAM">Steam</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm">Gift Card Code</span>
          <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full mt-1" />
        </label>

        <label className="block">
          <span className="text-sm">Related Job ID (optional)</span>
          <input value={jobId} onChange={(e) => setJobId(e.target.value)} className="w-full mt-1" />
        </label>

        <label className="block">
          <span className="text-sm">Upload Gift Card Image (optional, max 2MB)</span>
          <input type="file" accept="image/*" onChange={onFileChange} className="w-full mt-1" />
        </label>

        {imagePreview && (
          <div>
            <p className="text-sm">Preview</p>
            <img src={imagePreview} alt="preview" className="mt-2 max-h-48" />
          </div>
        )}

        {error && <div className="text-red-500">{error}</div>}

        <button disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded">
          {submitting ? "Submitting..." : "Submit Gift Card"}
        </button>
      </form>
    </div>
  );
}
