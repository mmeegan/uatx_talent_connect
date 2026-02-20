"use client";

import Link from "next/link";

type ConnectionRow = {
  id: string;
  helpRequestTitle: string;
  studentName: string;
  studentEmail: string;
};

export default function ConnectionListItem({ connection }: { connection: ConnectionRow }) {
  const { id, helpRequestTitle, studentName, studentEmail } = connection;
  return (
    <li>
      <Link
        href={`/dashboard/mentor/requests/${id}`}
        className="block rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.12)]"
      >
        <span className="font-medium text-[#F4F4F2]">{helpRequestTitle}</span>
        <p className="mt-1 text-sm text-[rgba(244,244,242,0.5)]">{studentName}</p>
        <a
          href={`mailto:${encodeURIComponent(studentEmail)}`}
          className="mt-1 inline-block text-sm text-[#C6A75E] hover:text-[rgba(198,167,94,0.8)] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {studentEmail}
        </a>
      </Link>
    </li>
  );
}
