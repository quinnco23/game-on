export function createEngineResult(overrides = {}) {
    return {
      ok: true,
      state: null,
      events: [],
      errors: [],
      warnings: [],
      metadata: {},
      ...overrides,
    };
  }

 