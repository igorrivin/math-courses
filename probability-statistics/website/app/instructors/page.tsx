import type { Metadata } from "next";
import { AssessmentGroups, ResourceShell } from "../resource-components";
import course from "../../content/course.json";

// worker/instructor-access.mjs checks the signed session before any page or RSC render.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `Instructor editions | ${course.title}`, robots: { index: false, follow: false } };

export default function InstructorsPage() {
  return <ResourceShell instructor>
    <header className="resource-hero"><div><p className="eyebrow">{course.subject} · Instructor editions</p><h1>Behind<br /><span>the problems.</span></h1><p className="resource-lede">Worked solutions, answer keys, and grading guidance for the course assessments.</p><form action="/instructors/logout" method="post"><button className="instructor-signout" type="submit">Sign out of instructor access</button></form></div></header>
    <AssessmentGroups instructor />
  </ResourceShell>;
}
