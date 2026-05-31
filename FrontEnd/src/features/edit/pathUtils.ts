// Tiny get/set helpers for dot-path access into nested objects/arrays.
// Used by EditPanel so a schema field can target deep keys like
// "ctas.0.label" or "footer.title" without per-field custom code.

export function getPath(obj: unknown, path: string): unknown {
  if (obj == null) return undefined;
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const part of parts) {
    if (cur == null) return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

/**
 * Returns a new object with `path` set to `value`. Creates intermediate
 * objects ({}) or arrays ([]) as needed. Numeric path segments create arrays,
 * non-numeric segments create objects. Original input is not mutated.
 */
export function setPath<T>(obj: T, path: string, value: unknown): T {
  const parts = path.split(".");
  const root: any = Array.isArray(obj) ? [...(obj as unknown as unknown[])] : { ...(obj as object) };
  let cur: any = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const nextKey = parts[i + 1];
    const nextIsArrayIndex = /^\d+$/.test(nextKey);
    const existing = cur[key];
    if (existing == null) {
      cur[key] = nextIsArrayIndex ? [] : {};
    } else {
      cur[key] = Array.isArray(existing) ? [...existing] : { ...existing };
    }
    cur = cur[key];
  }
  cur[parts[parts.length - 1]] = value;
  return root;
}
