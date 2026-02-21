"use client";

import Link from "next/link";

type ConnectionRow = {
  id: string;
  helpRequestTitle: string;
  studentName: string;
  studentEmail: string;
  studentImageUrl?: string;
  studentCenters?: string[];
};

export default function ConnectionListItem({ connection }: { connection: ConnectionRow }) {
  const { id, helpRequestTitle, studentName, studentEmail, studentImageUrl, studentCenters } = connection;
  return (
    <li>
      <Link
        href={`/dashboard/mentor/requests/${id}`}
        className="flex gap-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.12)]"
      >
        {studentImageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={studentImageUrl}
            alt=""
            className="h-12 w-12 shrink-0 rounded-full border border-[rgba(255,255,255,0.12)] object-cover"
          />
        ) : (
          <div className="h-12 w-12 shrink-0 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[rgba(244,244,242,0.4)] text-sm font-medium">
            {(studentName || "S").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
        <span className="font-medium text-[#F4F4F2]">{helpRequestTitle}</span>
        <p className="mt-1 text-sm text-[rgba(244,244,242,0.5)]">{studentName}{studentCenters?.length ? ` · ${studentCenters.join(", ")}` : ""}</p>
        <a
          href={`mailto:${encodeURIComponent(studentEmail)}`}
          className="mt-1 inline-block text-sm text-[#C6A75E] hover:text-[rgba(198,167,94,0.8)] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {studentEmail}
        </a>
        </div>
      </Link>
    </li>
  );
}
