import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import webpush, { PushSubscription } from "web-push";

type MetricPoint = { t: number; value: number };
type MetricSeries = { id: string; label: string; points: MetricPoint[] };
type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  incoming: number;
  updatedAt: number;
};

const PORT = Number(process.env.PORT) || 5050;
const DEFAULT_POINTS = 15;
const INTERVAL_MS = 5000;

const TRANSLATE_BASE =
  process.env.TRANSLATE_API ?? "https://lingva.ml/api/v1";
const TRANSLATE_SOURCE_LANG = process.env.TRANSLATE_SOURCE_LANG ?? "es";
const TRANSLATE_TARGET_LANG = process.env.TRANSLATE_TARGET_LANG ?? "en";
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT ?? "mailto:example@example.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

const ALLOWED_ORIGINS = new Set([
  "*",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:5001",
  "http://192.168.1.8:5001",
  "http://192.168.1.8:4173",
  "http://192.168.1.8:5050"
]);

const corsHeaders = (origin?: string) => {
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : "*";
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const withRandomDrift = (
  length: number,
  start: number,
  variation: number,
): number[] => {
  const result: number[] = [];
  let current = start;
  for (let i = 0; i < length; i += 1) {
    const drift = (Math.random() - 0.5) * variation;
    current = clamp(current + drift, 0, Number.MAX_SAFE_INTEGER);
    result.push(Math.round(current * 100) / 100);
  }
  return result;
};

const buildSeries = (
  length: number,
  base: number,
  label: string,
  variation: number,
): MetricSeries => {
  const values = withRandomDrift(length, base, variation);
  const now = Date.now();
  const points = values.map((value, idx) => ({
    t: now - (length - idx - 1) * INTERVAL_MS,
    value,
  }));

  return { id: randomUUID(), label, points };
};

const getMetrics = (points = DEFAULT_POINTS) => {
  const length = clamp(points, 5, 60);
  return {
    refreshedAt: Date.now(),
    series: [
      buildSeries(length, 120, "Tráfico", 18),
      buildSeries(length, 78, "Conversion", 9),
      buildSeries(length, 42, "Tickets", 6),
    ],
  };
};

const getInventory = (): InventoryItem[] => [
  {
    id: "SKU-9821",
    name: "Sneaker Nova",
    stock: Math.floor(20 + Math.random() * 40),
    incoming: Math.floor(Math.random() * 10),
    updatedAt: Date.now(),
  },
  {
    id: "SKU-7310",
    name: "Hoodie Nebula",
    stock: Math.floor(10 + Math.random() * 20),
    incoming: Math.floor(Math.random() * 6),
    updatedAt: Date.now(),
  },
  {
    id: "SKU-6623",
    name: "Backpack Vertex",
    stock: Math.floor(4 + Math.random() * 12),
    incoming: Math.floor(Math.random() * 4),
    updatedAt: Date.now(),
  },
];

const getAlerts = () => {
  const raw = [
    { id: "alert-1", message: "Stock crítico en Backpack Vertex", severity: "warning" },
    { id: "alert-2", message: "Nuevos arribos para Sneaker Nova", severity: "info" },
    { id: "alert-3", message: "Incremento de tráfico > 12% en la última hora", severity: "info" },
  ];
  return raw.slice(0, 1 + Math.floor(Math.random() * raw.length));
};

const subscriptions: PushSubscription[] = [];

const sendPush = async (payload: unknown, delaySeconds = 0) => {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error("VAPID keys missing in env");
  }
  await Promise.all(
    subscriptions.map(async (sub) => {
      await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
      await webpush.sendNotification(sub, JSON.stringify(payload));
    }),
  );
};

const translate = async (text: string) => {
  const targetLang = TRANSLATE_TARGET_LANG;
  const encoded = encodeURIComponent(text);
  const url = `${TRANSLATE_BASE}/${TRANSLATE_SOURCE_LANG}/${targetLang}/${encoded}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Lingva ${res.status}: ${res.statusText}`);
    }
    const data = (await res.json()) as { translation: string; info?: unknown };
    return { lang: targetLang, translated: data.translation };
  } catch (err) {
    // Fallback en caso de que el servicio de traducción falle.
    const message = err instanceof Error ? err.message : String(err);
    return { lang: targetLang, translated: `[fallback] ${text} (${message})` };
  }
};

const send = (
  req: IncomingMessage,
  res: ServerResponse,
  status: number,
  payload: unknown,
) => {
  const headers = corsHeaders();
  res.writeHead(status, headers);
  res.end(JSON.stringify(payload));
};

const notFound = (req: IncomingMessage, res: ServerResponse) =>
  send(req, res, 404, { error: "Not found" });

const router = (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === "OPTIONS") {
    const headers = corsHeaders();
    res.writeHead(200, {
      ...headers,
      "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
      "Access-Control-Allow-Headers": "Content-Type, x-tunnel-id",
    });
    return res.end();
  }

  if (!req.url) return notFound(req, res);
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";

  switch (pathname) {
    case "/metrics":
    case "/api/metrics": {
      const pointsParam = Number(url.searchParams.get("points") ?? DEFAULT_POINTS);
      return send(
        req,
        res,
        200,
        getMetrics(Number.isNaN(pointsParam) ? DEFAULT_POINTS : pointsParam),
      );
    }
    case "/inventory":
      return send(req, res, 200, {
        refreshedAt: Date.now(),
        items: getInventory(),
      });
    case "/alerts":
      return send(req, res, 200, { refreshedAt: Date.now(), alerts: getAlerts() });
    case "/push/subscribe": {
      if (req.method !== "POST") {
        return send(req, res, 405, { error: "Method not allowed" });
      }
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const sub = JSON.parse(body || "{}") as PushSubscription;
          if (!sub || !sub.endpoint) {
            return send(req, res, 400, { error: "subscription invalid" });
          }
          const exists = subscriptions.find((s) => s.endpoint === sub.endpoint);
          if (!exists) subscriptions.push(sub);
          return send(req, res, 200, { ok: true });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return send(req, res, 400, { error: message });
        }
      });
      return;
    }
    case "/push/send": {
      if (req.method !== "POST") {
        return send(req, res, 405, { error: "Method not allowed" });
      }
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const parsed = JSON.parse(body || "{}") as {
            title?: string;
            body?: string;
            target?: string;
            delaySeconds?: number;
          };
          const payload = {
            title: parsed.title ?? "Push desde mock",
            body: parsed.body ?? "Mensaje generado por api-mock",
            target: parsed.target,
          };
          await sendPush(payload, parsed.delaySeconds ?? 0);
          return send(req, res, 200, { ok: true });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return send(req, res, 500, { error: message });
        }
      });
      return;
    }
    case "/translate":
    case "/api/translate": {
      if (req.method !== "POST") {
        return send(req, res, 405, { error: "Method not allowed" });
      }
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        try {
          const parsed = JSON.parse(body || "{}") as { text?: string };
          if (!parsed.text) {
            return send(req, res, 400, { error: "text is required" });
          }
          const result = await translate(parsed.text);
          return send(req, res, 200, result);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return send(req, res, 500, { error: message });
        }
      });
      return;
    }
    default:
      if (req.method !== "GET") {
        return send(req, res, 405, { error: "Method not allowed" });
      }
      return notFound(req, res);
  }
};

createServer(router).listen(PORT, () => {
  console.log(`Mock API corriendo en http://localhost:${PORT}`);
  console.log("Rutas: /metrics, /inventory, /alerts");
});
