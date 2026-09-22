import type { ReactNode } from "react";
import Link from "next/link";
import assessments from "../content/assessments.json";
import course from "../content/course.json";

export function ResourceShell({ children, instructor = false }: { children: ReactNode; instructor?: boolean }) {
  return <main className="resources-page">
    <a className="resource-skip" href="#resource-content">Skip to content</a>
    <header className="topbar resource-topbar">
      <Link className="brand" href="/" prefetch={false} aria-label={`${course.title} home`}><span>{course.monogram}</span><b>{course.firstLine}<br />{course.secondLine}</b></Link>
      <nav className="resource-nav" aria-label="Course navigation">
        <Link href="/" prefetch={false}>Course & labs</Link>
        <a href="/assessments" aria-current={instructor ? undefined : "page"}>Problem sets & quizzes</a>
      </nav>
    </header>
    <div id="resource-content">{children}</div>
    <footer><p>{course.title}</p><a href="/course-packet.pdf">Course book PDF</a></footer>
  </main>;
}

export function AssessmentGroups({ instructor = false }: { instructor?: boolean }) {
  return <div className="assessment-collection">
    <nav className="assessment-jumps" aria-label="Assessment categories">
      <a href="#problem-sets">Problem sets <span>{assessments.filter(item => item.kind === "problem-set").length}</span></a>
      <a href="#quizzes">Quizzes <span>{assessments.filter(item => item.kind === "quiz").length}</span></a>
    </nav>
    {(["problem-set", "quiz"] as const).map(kind => <section className="assessment-section" id={kind === "quiz" ? "quizzes" : "problem-sets"} key={kind}>
      <div className="assessment-heading"><p className="eyebrow">{kind === "quiz" ? "Check your understanding" : "Develop the argument"}</p><h2>{kind === "quiz" ? "Quizzes" : "Problem sets"}</h2></div>
      <div className="assessment-grid">{assessments.filter(item => item.kind === kind).map(item => <article className="assessment-card" key={item.id}>
        <p className="assessment-label">{item.label}</p>
        <h3>{item.title}</h3>
        <p className="assessment-description">{item.description}</p>
        <p className="assessment-details">{item.details}</p>
        <div className="assessment-downloads">
          <a className="assessment-download" href={instructor ? `/instructors/files/${item.id}.pdf` : `/${item.studentFile}`} download aria-label={`Download ${instructor ? "instructor" : "student"} PDF: ${item.label}, ${item.title}`}>{instructor ? "Instructor PDF" : "Student PDF"} <span aria-hidden="true">↓</span></a>
          {instructor && <a className="assessment-student-link" href={`/${item.studentFile}`} download>Student edition</a>}
        </div>
      </article>)}</div>
    </section>)}
  </div>;
}
