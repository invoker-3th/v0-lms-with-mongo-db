"use client";

import { motion } from "framer-motion";

type Job = {
  id: string;
  title: string;
  type: string;
  location: string;
  budget: string;
  deadline: string;
  status: "open" | "closed";
  applicationCount: number;
};

type JobCardProps = {
  job: Job;
  onClick: () => void;
  onEdit?: () => void;
};

export default function JobCard({ job, onClick, onEdit }: JobCardProps) {
  // Select image based on job type for visual variety
  const getJobImage = (type: string) => {
    const images = {
      Actor: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
      Crew: "https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg?auto=compress&cs=tinysrgb&w=800",
      Model: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
      Voice: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800",
    };
    return images[type as keyof typeof images] || images.Actor;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      className="relative bg-white/5 border border-white/10 rounded overflow-hidden cursor-pointer hover:border-white/20 transition-all group"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-15 transition-opacity"
        style={{ backgroundImage: `url('${getJobImage(job.type)}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl text-white mb-2 group-hover:text-[var(--accent-gold)] transition break-words">
              {job.title}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] break-words">
              {job.type} · {job.location}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={`px-2 sm:px-3 py-1 text-xs rounded whitespace-nowrap ${
                job.status === "open"
                  ? "bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30"
                  : "bg-white/10 text-[var(--text-secondary)] border border-white/10"
              }`}
            >
              {job.status === "open" ? "Open" : "Closed"}
            </span>
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="px-2 py-1 text-xs border border-white/20 text-white rounded hover:bg-white/10 transition whitespace-nowrap"
                aria-label="Edit job"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm mb-4">
          <div>
            <p className="text-[var(--text-secondary)] mb-1">Budget</p>
            <p className="text-white break-words">{job.budget || "Not specified"}</p>
          </div>
          <div>
            <p className="text-[var(--text-secondary)] mb-1">Deadline</p>
            <p className="text-white break-words">{job.deadline || "Not specified"}</p>
          </div>
        </div>

        <div className="pt-3 sm:pt-4 border-t border-white/10">
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            <span className="text-white font-medium">{job.applicationCount}</span>{" "}
            {job.applicationCount === 1 ? "application" : "applications"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
