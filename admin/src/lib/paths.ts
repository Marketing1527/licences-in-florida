/** Public asset / API prefix when app is mounted at /admin */
export const BASE_PATH = "/admin";

export function asset(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${p}`;
}
