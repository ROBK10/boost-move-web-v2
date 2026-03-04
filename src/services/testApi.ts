import { apiFetch } from "./api"

export async function testHealth() {
  return apiFetch("/health")
}