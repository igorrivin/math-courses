import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

// Embed PDFs in the Worker module. Never emit an instructor PDF as a static asset.
export function privateAssessments(): Plugin {
  const virtualId = "virtual:instructor-pdfs";
  const resolvedId = "\0" + virtualId;
  let root = process.cwd();
  return {
    name: "private-assessments",
    configResolved(config) { root = config.root; },
    resolveId(id) { if (id === virtualId) return resolvedId; },
    async load(id) {
      if (id !== resolvedId) return;
      if (this.environment.name === "client") {
        throw new Error("Instructor PDFs must never be imported into client code.");
      }
      const catalogPath = resolve(root, "content/assessments.json");
      this.addWatchFile(catalogPath);
      const catalog = JSON.parse(await readFile(catalogPath, "utf8")) as { id: string }[];
      const files: Record<string, string> = {};
      for (const entry of catalog) {
        if (!/^[a-z0-9-]+$/.test(entry.id)) throw new Error("Invalid assessment ID");
        const path = resolve(root, "private", `${entry.id}.pdf`);
        this.addWatchFile(path);
        const pdf = await readFile(path);
        if (pdf.subarray(0, 5).toString() !== "%PDF-") throw new Error(`Invalid PDF: ${path}`);
        files[`${entry.id}.pdf`] = pdf.toString("base64");
      }
      return `export default ${JSON.stringify(files)};`;
    },
  };
}
