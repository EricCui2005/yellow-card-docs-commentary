import fs from "fs";
import path from "path";

const refDirectory = path.join(process.cwd(), "content/reference");

export interface RefParam {
  name: string;
  in: string;
  description?: string;
  required?: boolean;
  schema?: { type?: string; example?: unknown };
}

export interface RefEndpoint {
  title: string;
  slug: string;
  method: string;
  path: string;
  description: string;
  excerpt: string;
  parameters: RefParam[];
  requestBody: Record<string, unknown> | null;
  responses: Record<string, unknown>;
  servers: { url: string }[];
  security: Record<string, unknown>[];
  bodyHtml: string;
}

export interface RefNavPage {
  slug: string;
  title: string;
  method: string;
}

export interface RefNavSubsection {
  title: string;
  pages: RefNavPage[];
}

export interface RefNavSection {
  title: string;
  pages?: RefNavPage[];
  subsections?: RefNavSubsection[];
}

export function getRefNavigation(): RefNavSection[] {
  try {
    const filePath = path.join(refDirectory, "navigation.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);
    return data.sections || [];
  } catch {
    return [];
  }
}

export function getRefEndpoint(slug: string): RefEndpoint | null {
  try {
    const filePath = path.join(refDirectory, `${slug}.json`);
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAllRefSlugs(): string[] {
  const nav = getRefNavigation();
  const slugs: string[] = [];
  for (const section of nav) {
    if (section.pages) {
      for (const page of section.pages) {
        slugs.push(page.slug);
      }
    }
    if (section.subsections) {
      for (const sub of section.subsections) {
        for (const page of sub.pages) {
          slugs.push(page.slug);
        }
      }
    }
  }
  return [...new Set(slugs)];
}

export function getRequestBodyProps(endpoint: RefEndpoint): {
  properties: Record<string, { type?: string; description?: string; example?: unknown; required?: boolean }>;
  required: string[];
  example: Record<string, unknown> | null;
} | null {
  const rb = endpoint.requestBody as Record<string, unknown> | null;
  if (!rb) return null;

  const content = rb.content as Record<string, unknown> | undefined;
  if (!content) return null;

  const jsonContent = (content["application/json"] || Object.values(content)[0]) as Record<string, unknown> | undefined;
  if (!jsonContent) return null;

  const schema = jsonContent.schema as Record<string, unknown> | undefined;
  const examples = jsonContent.examples as Record<string, { value?: unknown }> | undefined;

  const properties = (schema?.properties || {}) as Record<string, { type?: string; description?: string; example?: unknown }>;
  const required = (schema?.required || []) as string[];

  let example: Record<string, unknown> | null = null;
  if (examples) {
    const firstExample = Object.values(examples)[0];
    if (firstExample?.value && typeof firstExample.value === "object") {
      example = firstExample.value as Record<string, unknown>;
    }
  }

  return { properties, required, example };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getResponseExamples(endpoint: RefEndpoint): {
  status: string;
  description: string;
  example: any;
}[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results: { status: string; description: string; example: any }[] = [];
  const responses = endpoint.responses as Record<string, Record<string, unknown>>;

  for (const [status, resp] of Object.entries(responses)) {
    const description = (resp.description as string) || status;
    const content = resp.content as Record<string, Record<string, unknown>> | undefined;

    let example: Record<string, unknown> | string | null = null;
    if (content) {
      const jsonContent = content["application/json"] || Object.values(content)[0];
      if (jsonContent) {
        const examples = jsonContent.examples as Record<string, { value?: unknown }> | undefined;
        if (examples) {
          const firstExample = Object.values(examples)[0];
          if (firstExample?.value) {
            example = firstExample.value as Record<string, unknown> | string;
          }
        }
      }
    }
    results.push({ status, description, example });
  }

  return results;
}
