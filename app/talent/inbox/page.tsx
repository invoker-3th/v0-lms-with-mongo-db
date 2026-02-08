"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TalentSidebar from "@/app/components/talent-sidebar";

type MessageItem = {
  _id: string;
  message: string;
  senderRole: string;
  senderName?: string;
  senderEmail?: string;
  createdAt: string;
  jobId?: string;
  applicationId?: string;
};

export default function TalentInboxPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/talent/messages");
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        } else {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Failed to load messages.");
        }
      } catch (err) {
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] relative flex">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: "url('/noise.png')",
          backgroundRepeat: "repeat",
        }}
      />

      <TalentSidebar />

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-16 pb-8 sm:px-6 sm:pt-20 sm:pb-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-heading text-(--text-primary) mb-2">
            Inbox
          </h1>
          <p className="text-sm font-body text-(--text-secondary)">
            Messages from casting directors and admins. Reply via email.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-(--text-secondary) font-body">Loading messages...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-white/5 border border-red-500/30 rounded text-sm text-red-400">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[var(--text-secondary)] font-body">
              No messages yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.25 }}
                className="bg-[var(--bg-surface)] border border-white/10 rounded-xl p-5"
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div>
                    <p className="text-white text-sm font-medium">
                      From {msg.senderName || msg.senderEmail || msg.senderRole}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {msg.senderEmail && (
                    <a
                      href={`mailto:${msg.senderEmail}?subject=Reply%20to%20your%20message`}
                      className="px-3 py-2 border border-white/20 text-white text-xs hover:border-white/40 transition"
                    >
                      Reply by Email
                    </a>
                  )}
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {msg.message}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
