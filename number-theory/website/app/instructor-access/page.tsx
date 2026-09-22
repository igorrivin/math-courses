import type { Metadata } from "next";
import { ResourceShell } from "../resource-components";
import course from "../../content/course.json";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `Instructor access | ${course.title}`, robots: { index: false, follow: false } };

export default async function InstructorAccessPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const message = error === "password" ? "That password was not recognized. Please try again."
    : error === "unavailable" ? "Instructor access has not been enabled yet. Please contact the course instructor." : null;
  return <ResourceShell instructor>
    <section className="instructor-login">
      <a className="resource-back" href="/assessments">← Student problem sets & quizzes</a>
      <p className="eyebrow">For instructors</p><h1>A little space<br />for the solutions.</h1>
      <p>Enter the shared instructor password to download worked solutions and grading notes.</p>
      <form action="/instructors/login" method="post">
        <label htmlFor="instructor-password">Instructor password</label>
        <input id="instructor-password" name="password" type="password" autoComplete="current-password" required maxLength={256} aria-describedby={message ? "instructor-error" : undefined} />
        {message && <p className="instructor-error" id="instructor-error" role="alert">{message}</p>}
        <button className="assessment-download" type="submit">Open instructor editions <span aria-hidden="true">→</span></button>
      </form>
      <p className="instructor-session-note">Access lasts 8 hours in this browser. Students can download their editions without a password.</p>
    </section>
  </ResourceShell>;
}
