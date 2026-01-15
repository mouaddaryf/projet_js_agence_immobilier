const SUPABASE_URL = "https://fqyagydplfewjdnmzhxc.supabase.co";
const API_KEY = "sb_publishable_kqUzQjRwlPnQKgaaDM8_YA_hY9JlECZ";
const JSON_CONTENT = "application/json";

async function fetchTable(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: "GET",
    headers: {
      apikey: API_KEY,
      "Content-Type": JSON_CONTENT
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Erreur API (${path}): ${res.status} ${text}`);
  }
  return await res.json();
}

// Données nécessaires au dashboard
async function getDashboardData() {
  const [agents, clients, biens, contrats, visites] = await Promise.all([
    fetchTable("agents"),
    fetchTable("clients"),
    fetchTable("biens"),
    fetchTable("v_contrats"),
    fetchTable("v_visites")
  ]);

  return { agents, clients, biens, contrats, visites };
}
