import { afterEach, describe, expect, it, vi } from "vitest";
import { storeName } from "@/lib/deploy";

describe("magasin de données par contexte", () => {
  afterEach(() => vi.unstubAllEnvs());
  const ctx = (CONTEXT: string, BRANCH = "") => {
    vi.stubEnv("CONTEXT", CONTEXT);
    vi.stubEnv("BRANCH", BRANCH);
    vi.stubEnv("NNH_STORE_NAME", "");
  };

  it("production, site-2 et aperçus ne partagent jamais leurs données", () => {
    ctx("production", "main");
    expect(storeName()).toBe("na-nah-nhair-production");
    ctx("branch-deploy", "site-2");
    expect(storeName()).toBe("na-nah-nhair-site-2");
    ctx("deploy-preview", "claude/x");
    expect(storeName()).toBe("na-nah-nhair-apercus");
  });

  it("contexte figé au build quand Netlify ne le fournit pas à l'exécution", () => {
    ctx("");
    vi.stubEnv("NNH_BUILD_CONTEXT", "production");
    expect(storeName()).toBe("na-nah-nhair-production");
  });
});
