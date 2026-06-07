import { notFound } from "next/navigation";
import {
  getRefEndpoint,
  getAllRefSlugs,
  getRequestBodyProps,
  getResponseExamples,
} from "@/lib/reference";
import { getCommentary, applyAnnotations } from "@/lib/commentary";
import CommentaryMarkers from "@/components/CommentaryMarkers";
import CommentaryPopover from "@/components/CommentaryPopover";
import type { Metadata } from "next";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllRefSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const endpoint = getRefEndpoint(slug);
  if (!endpoint) return { title: "Not Found" };
  return {
    title: `${endpoint.title} | API Reference | Yellow Card Payments API`,
    description: endpoint.excerpt || endpoint.description,
  };
}

const METHOD_STYLES: Record<string, string> = {
  GET: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  POST: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  PUT: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  PATCH: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

function formatJson(value: unknown): string {
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default async function EndpointPage({ params }: Props) {
  const { slug } = await params;
  const endpoint = getRefEndpoint(slug);
  if (!endpoint) notFound();

  const method = (endpoint.method || "GET").toUpperCase();
  const methodStyle = METHOD_STYLES[method] || METHOD_STYLES.GET;
  const rbProps = getRequestBodyProps(endpoint);
  const responseExamples = getResponseExamples(endpoint);
  const serverUrl = endpoint.servers?.[0]?.url || "https://sandbox.api.yellowcard.io/business";

  // Load annotations for this endpoint and apply them to description +
  // bodyHtml. Anchors that don't land in either of those slots are reported
  // by applyAnnotations and ignored — author the anchor text to match.
  const annotations = await getCommentary(slug, "reference");
  const descriptionHtml = endpoint.description
    ? applyAnnotations(`<p>${escapeHtml(endpoint.description)}</p>`, annotations)
    : "";
  const annotatedBodyHtml = endpoint.bodyHtml
    ? applyAnnotations(endpoint.bodyHtml, annotations)
    : "";

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left: Documentation */}
      <div className="flex-1 min-w-0 p-6 lg:p-8 border-r border-gray-200 dark:border-gray-800">
        {/* Title + method badge */}
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-gray-900 dark:text-gray-100 mb-3">
            {endpoint.title}
          </h1>
          <div className="flex items-center gap-2 font-mono text-sm">
            <span className={`px-2 py-1 rounded font-bold text-xs uppercase ${methodStyle}`}>
              {method}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {serverUrl}
              <span className="text-gray-900 dark:text-gray-100 font-semibold">{endpoint.path}</span>
            </span>
          </div>
        </div>

        {/* Description (with commentary markers applied) */}
        {descriptionHtml && (
          <div
            className="reference-description text-[15px] text-gray-600 dark:text-gray-400 mb-6 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        )}

        {/* Supplementary body: callouts, disclaimers, notes pulled from
            the original ReadMe rendered HTML — also with commentary markers. */}
        {annotatedBodyHtml && (
          <div
            className="markdown-body mb-6"
            dangerouslySetInnerHTML={{ __html: annotatedBodyHtml }}
          />
        )}

        {/* Security */}
        <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="font-medium">Authorization</span>
            <span className="text-gray-400">|</span>
            <code className="text-[11px]">Authorization: YcHmacV1 &#123;apikey&#125;:&#123;signature&#125;</code>
            <span className="text-gray-400">+</span>
            <code className="text-[11px]">X-YC-Timestamp</code>
          </div>
        </div>

        {/* Query/Path Parameters */}
        {endpoint.parameters && endpoint.parameters.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">
              {endpoint.parameters.some((p) => p.in === "path") ? "Path" : "Query"} Parameters
            </h2>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {endpoint.parameters.map((param, i) => (
                <div
                  key={`${param.name}-${i}`}
                  className={`flex items-start gap-3 px-4 py-3 text-sm ${
                    i > 0 ? "border-t border-gray-200 dark:border-gray-700" : ""
                  }`}
                >
                  <div className="min-w-[120px]">
                    <code className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                      {param.name}
                    </code>
                    {param.required && (
                      <span className="ml-1 text-[10px] text-red-500 font-medium">required</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] text-gray-400 uppercase">{param.schema?.type || "string"}</span>
                    {param.description && (
                      <p className="text-[13px] text-gray-600 dark:text-gray-400 mt-0.5">
                        {param.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Request Body */}
        {rbProps && Object.keys(rbProps.properties).length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">
              Body Parameters
            </h2>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {Object.entries(rbProps.properties).map(([name, prop], i) => (
                <div
                  key={name}
                  className={`flex items-start gap-3 px-4 py-3 text-sm ${
                    i > 0 ? "border-t border-gray-200 dark:border-gray-700" : ""
                  }`}
                >
                  <div className="min-w-[140px]">
                    <code className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                      {name}
                    </code>
                    {rbProps.required.includes(name) && (
                      <span className="ml-1 text-[10px] text-red-500 font-medium">required</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] text-gray-400 uppercase">{prop.type || "object"}</span>
                    {prop.description && (
                      <p className="text-[13px] text-gray-600 dark:text-gray-400 mt-0.5">
                        {prop.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Responses */}
        {responseExamples.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">
              Responses
            </h2>
            <div className="space-y-2">
              {responseExamples.map((resp) => (
                <div
                  key={resp.status}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      resp.status.startsWith("2")
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {resp.status}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {resp.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Code examples */}
      <div className="lg:w-[440px] lg:min-w-[440px] bg-slate-900 text-slate-200 p-6 overflow-auto">
        {/* Request example */}
        {rbProps?.example !== null && rbProps?.example !== undefined && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Request Body
            </h3>
            <pre className="text-[12px] leading-relaxed overflow-x-auto bg-slate-800 rounded-lg p-4">
              <code>{formatJson(rbProps.example)}</code>
            </pre>
          </div>
        )}

        {/* Response examples */}
        {responseExamples.map(
          (resp) =>
            resp.example && (
              <div key={resp.status} className="mb-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Response{" "}
                  <span
                    className={
                      resp.status.startsWith("2")
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {resp.status}
                  </span>
                </h3>
                <pre className="text-[12px] leading-relaxed overflow-x-auto bg-slate-800 rounded-lg p-4">
                  <code>{formatJson(resp.example)}</code>
                </pre>
              </div>
            )
        )}

        {/* cURL example */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            cURL
          </h3>
          <pre className="text-[12px] leading-relaxed overflow-x-auto bg-slate-800 rounded-lg p-4">
            <code>
              {`curl --request ${method} \\
  --url ${serverUrl}${endpoint.path} \\
  --header 'Authorization: YcHmacV1 {apikey}:{signature}' \\
  --header 'X-YC-Timestamp: {timestamp}' \\
  --header 'Content-Type: application/json'`}
              {method !== "GET" && method !== "DELETE" && rbProps?.example
                ? ` \\\n  --data '${JSON.stringify(rbProps.example)}'`
                : ""}
            </code>
          </pre>
        </div>
      </div>

      {/* Marker hydration + popover (driven by the root-level provider). */}
      <CommentaryMarkers />
      <CommentaryPopover />
    </div>
  );
}
