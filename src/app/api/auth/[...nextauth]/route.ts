import type { NextRequest } from "next/server";
import { handlers } from "@/features/identity/server";

function normalizeAuthRequest(req: NextRequest): Request {
  const fHost = req.headers.get("x-forwarded-host");
  const host = req.headers.get("host") || "";
  const origin = req.headers.get("origin") || "";
  const referer = req.headers.get("referer") || "";

  let realHost = fHost || host;
  let proto = req.headers.get("x-forwarded-proto") || "http";

  if (!realHost || realHost.includes("0.0.0.0") || realHost.includes("fms-app")) {
    if (origin) {
      try {
        const u = new URL(origin);
        realHost = u.host;
        proto = u.protocol.replace(":", "");
      } catch {}
    } else if (referer) {
      try {
        const u = new URL(referer);
        realHost = u.host;
        proto = u.protocol.replace(":", "");
      } catch {}
    } else if (process.env.APP_URL) {
      try {
        const u = new URL(process.env.APP_URL);
        realHost = u.host;
        proto = u.protocol.replace(":", "");
      } catch {}
    }
  }

  if (realHost && !realHost.includes("localhost") && !realHost.includes("127.0.0.1")) {
    proto = "https";
  }

  const pathname = req.nextUrl?.pathname || new URL(req.url).pathname;
  const search = req.nextUrl?.search || new URL(req.url).search;
  const fullUrl = `${proto}://${realHost}${pathname}${search}`;

  const headers = new Headers(req.headers);
  headers.set("host", realHost);
  headers.set("x-forwarded-host", realHost);
  headers.set("x-forwarded-proto", proto);

  return new Request(fullUrl, {
    method: req.method,
    headers,
    body: req.method === "POST" ? req.body : undefined,
    // @ts-expect-error duplex is required for streaming request body in Node.js
    duplex: req.method === "POST" && req.body ? "half" : undefined,
  });
}

export async function GET(req: NextRequest) {
  return (handlers.GET as (r: Request) => Promise<Response>)(normalizeAuthRequest(req));
}

export async function POST(req: NextRequest) {
  return (handlers.POST as (r: Request) => Promise<Response>)(normalizeAuthRequest(req));
}
