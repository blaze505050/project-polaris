/**
 * PUBLIC ARTIFACT PERSISTENCE ADAPTER SYSTEM (HARDENED)
 * Provides Local vs Cloud server-backed retrieval for public shareable artifacts.
 */

export interface PublicArtifactPayload {
  id: string;
  name: string;
  pillar: "aerolab" | "mechlab" | "astrolab";
  module: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  notes?: string;
  timestamp: number;
  author?: string;
  version?: string;
  visibility?: "PUBLIC" | "PRIVATE" | "LOCAL";
}

const API_BASE = (import.meta as any).env?.VITE_PHYSICS_AI_API_URL || "http://localhost:8000";
const SAFE_ID_REGEX = /^[a-zA-Z0-9_\-\.]{3,64}$/;

/**
 * Sanitize object keys against prototype pollution
 */
function sanitizeObject<T>(obj: any): T {
  if (typeof obj !== "object" || obj === null) return obj;
  const clean: any = Array.isArray(obj) ? [] : {};
  for (const key of Object.keys(obj)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue;
    }
    clean[key] =
      typeof obj[key] === "object" && obj[key] !== null ? sanitizeObject(obj[key]) : obj[key];
  }
  return clean;
}

export class LocalPersistenceAdapter {
  async fetch(id: string): Promise<PublicArtifactPayload | null> {
    if (!SAFE_ID_REGEX.test(id)) return null;
    try {
      const raw = localStorage.getItem(`aeroforge_pub_artifact_${id}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return sanitizeObject<PublicArtifactPayload>(parsed);
    } catch {
      return null;
    }
  }

  async save(artifact: PublicArtifactPayload): Promise<boolean> {
    if (!SAFE_ID_REGEX.test(artifact.id)) return false;
    try {
      const safe = sanitizeObject<PublicArtifactPayload>(artifact);
      localStorage.setItem(`aeroforge_pub_artifact_${artifact.id}`, JSON.stringify(safe));
      return true;
    } catch (err) {
      console.warn("Local artifact save quota warning:", err);
      return false;
    }
  }
}

export class CloudPersistenceAdapter {
  async fetch(id: string): Promise<PublicArtifactPayload | null> {
    if (!SAFE_ID_REGEX.test(id)) return null;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s fetch timeout

      const res = await fetch(`${API_BASE}/api/public-artifacts/${encodeURIComponent(id)}`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) return null;
      const data = await res.json();
      return sanitizeObject<PublicArtifactPayload>(data);
    } catch (err) {
      console.warn("Cloud artifact fetch fallback:", err);
      return null;
    }
  }

  async save(artifact: PublicArtifactPayload): Promise<boolean> {
    if (!SAFE_ID_REGEX.test(artifact.id)) return false;
    try {
      const safe = sanitizeObject<PublicArtifactPayload>(artifact);
      const res = await fetch(`${API_BASE}/api/public-artifacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safe),
      });

      return res.ok;
    } catch (err) {
      console.warn("Cloud artifact publish fallback:", err);
      return false;
    }
  }
}

class PublicArtifactService {
  private localAdapter = new LocalPersistenceAdapter();
  private cloudAdapter = new CloudPersistenceAdapter();

  /**
   * Fetch public artifact trying Cloud API first, then LocalStorage fallback
   */
  async getArtifact(id: string): Promise<PublicArtifactPayload | null> {
    if (!SAFE_ID_REGEX.test(id)) return null;

    // 1. Try Cloud Server Endpoint first
    const cloudArtifact = await this.cloudAdapter.fetch(id);
    if (cloudArtifact) return cloudArtifact;

    // 2. Try Local Adapter fallback
    const localArtifact = await this.localAdapter.fetch(id);
    if (localArtifact) return localArtifact;

    return null;
  }

  /**
   * Publish artifact to both Cloud API and Local storage
   */
  async publishArtifact(artifact: PublicArtifactPayload): Promise<boolean> {
    if (!SAFE_ID_REGEX.test(artifact.id)) return false;
    const cleanPayload: PublicArtifactPayload = {
      ...artifact,
      visibility: "PUBLIC",
    };
    await this.localAdapter.save(cleanPayload);
    const cloudSaved = await this.cloudAdapter.save(cleanPayload);
    return cloudSaved;
  }
}

export const publicArtifactService = new PublicArtifactService();
