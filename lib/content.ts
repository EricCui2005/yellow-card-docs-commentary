import fs from "fs";
import path from "path";
import matter from "gray-matter";

const docsDirectory = path.join(process.cwd(), "content/docs");
const changelogDirectory = path.join(process.cwd(), "content/changelog");

export interface DocPage {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
}

export interface ChangelogEntry {
  slug: string;
  title: string;
  date: string;
  content: string;
}

export function getDocBySlug(slug: string): DocPage | null {
  try {
    const filePath = path.join(docsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || "",
      content,
    };
  } catch {
    return null;
  }
}

export function getAllDocSlugs(): string[] {
  try {
    const files = fs.readdirSync(docsDirectory);
    return files
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}

export function getChangelogEntry(slug: string): ChangelogEntry | null {
  try {
    const filePath = path.join(changelogDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      content,
    };
  } catch {
    return null;
  }
}

export function getAllChangelogSlugs(): string[] {
  try {
    const files = fs.readdirSync(changelogDirectory);
    return files
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

export function getAllChangelogEntries(): ChangelogEntry[] {
  const slugs = getAllChangelogSlugs();
  return slugs
    .map((slug) => getChangelogEntry(slug))
    .filter((entry): entry is ChangelogEntry => entry !== null);
}
