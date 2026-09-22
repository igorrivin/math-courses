import type { Metadata } from "next";
import { AssessmentGroups, ResourceShell } from "../resource-components";
import course from "../../content/course.json";

export const metadata: Metadata = {
  title: `Problem sets & quizzes | ${course.title}`,
  description: `Download student problem sets and quizzes for ${course.title}.`,
};

export default function AssessmentsPage() {
  return <ResourceShell>
    <header className="resource-hero"><div><p className="eyebrow">{course.subject} · Student editions</p><h1>Problem sets<br /><span>& quizzes.</span></h1><p className="resource-lede">A place to practice, put a proof together, and check what you understand. Download a handout and make the work your own.</p><p className="resource-format">Printable PDFs · Free to download</p></div></header>
    <AssessmentGroups />
    <aside className="instructor-callout"><div><p className="eyebrow">Teaching this course?</p><h2>Instructor editions</h2><p>Worked solutions and grading notes are available with the instructor password.</p></div><a href="/instructors">Instructor access <span aria-hidden="true">→</span></a></aside>
  </ResourceShell>;
}
