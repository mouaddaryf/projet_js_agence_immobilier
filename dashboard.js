let chartInstance = null;

// --- Helpers ---
function toDateOnly(value) {
  // value peut être "YYYY-MM-DD" ou "YYYY-MM-DDTHH:mm:ss..."
  if (!value) return null;
  const s = String(value).slice(0, 10);
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function inRange(dateValue, fromValue, toValue) {
  const d = toDateOnly(dateValue);
  if (!d) return false;

  const from = fromValue ? new Date(fromValue + "T00:00:00") : null;
  const to = toValue ? new Date(toValue + "T23:59:59") : null;

  if (from && d < from) return false;
  if (to && d > to) return false;
  return true;
}

function formatDH(n) {
  const num = Number(n || 0);
  return `${num.toLocaleString("fr-FR")} DH`;
}

function monthKey(dateValue) {
  const d = toDateOnly(dateValue);
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

// --- UI refs ---
const elTypeContrat = document.getElementById("filterTypeContrat");
const elStatutBien = document.getElementById("filterStatutBien");
const elAgent = document.getElementById("filterAgent");
const elFrom = document.getElementById("filterDateFrom");
const elTo = document.getElementById("filterDateTo");

const btnApply = document.getElementById("btnApply");
const btnReset = document.getElementById("btnReset");

const kpiAgents = document.getElementById("kpiAgents");
const kpiClients = document.getElementById("kpiClients");
const kpiBiens = document.getElementById("kpiBiens");
const kpiContrats = document.getElementById("kpiContrats");
const kpiCA = document.getElementById("kpiCA");
const kpiVisites = document.getElementById("kpiVisites");
const kpiDispo = document.getElementById("kpiDispo");

// --- State ---
let DATA = {
  agents: [],
  clients: [],
  biens: [],
  contrats: [],
  visites: []
};

function fillAgentFilter(agents) {
  elAgent.innerHTML = `<option value="">Tous</option>`;
  agents
    .slice()
    .sort((a, b) => String(a.nom || "").localeCompare(String(b.nom || ""), "fr"))
    .forEach(a => {
      const opt = document.createElement("option");
      opt.value = String(a.nom || "").trim(); // filtre par nom (simple)
      opt.textContent = a.nom || `Agent #${a.id}`;
      elAgent.appendChild(opt);
    });
}

function applyFilters() {
  const typeContrat = elTypeContrat.value;     // vente/location/""
  const statutBien = elStatutBien.value;       // disponible/vendu/loué/""
  const agentNom = elAgent.value;              // nom agent ou ""
  const from = elFrom.value;                   // yyyy-mm-dd ou ""
  const to = elTo.value;                       // yyyy-mm-dd ou ""

  // --- Biens filtrés (par statut si choisi)
  let biensFiltres = DATA.biens.slice();
  if (statutBien) {
    biensFiltres = biensFiltres.filter(b => String(b.statut).toLowerCase() === statutBien);
  }

  // --- Contrats filtrés (type + agent + date)
  let contratsFiltres = DATA.contrats.slice();

  if (typeContrat) {
    contratsFiltres = contratsFiltres.filter(c => String(c.type).toLowerCase() === typeContrat);
  }

  // Dans v_contrats, tu as "agent" (string) d’après ton affichage contrats.js
  if (agentNom) {
    contratsFiltres = contratsFiltres.filter(c => String(c.agent || "").trim() === agentNom);
  }

  if (from || to) {
    contratsFiltres = contratsFiltres.filter(c => inRange(c.date, from, to));
  }

  // --- KPI fixes (sans filtres)
  kpiAgents.textContent = DATA.agents.length;
  kpiClients.textContent = DATA.clients.length;

  // --- KPI filtrés
  kpiBiens.textContent = biensFiltres.length;
  kpiContrats.textContent = contratsFiltres.length;

  const ca = contratsFiltres.reduce((sum, c) => sum + Number(c.montant || 0), 0);
  kpiCA.textContent = formatDH(ca);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // v_visites: tu utilises visite.date dans affichage => ok
  // Filtre agent si choisi (dans v_visites tu as agent_nom)
  let visites = DATA.visites.slice();
  if (agentNom) {
    visites = visites.filter(v => String(v.agent_nom || "").trim() === agentNom);
  }
  const visitesAVenir = visites.filter(v => {
    const d = toDateOnly(v.date);
    return d && d >= today;
  });
  kpiVisites.textContent = visitesAVenir.length;

  const biensDispo = (statutBien && statutBien !== "disponible")
    ? 0
    : DATA.biens.filter(b => String(b.statut).toLowerCase() === "disponible").length;
  kpiDispo.textContent = biensDispo;

  // --- Graph (contrats par mois)
  renderChart(contratsFiltres);
}

function renderChart(contratsFiltres) {
  const countsByMonth = new Map();

  for (const c of contratsFiltres) {
    const key = monthKey(c.date);
    if (!key) continue;
    countsByMonth.set(key, (countsByMonth.get(key) || 0) + 1);
  }

  const labels = Array.from(countsByMonth.keys()).sort(); // "YYYY-MM"
  const values = labels.map(l => countsByMonth.get(l));

  const ctx = document.getElementById("chartContrats");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Nombre de contrats",
          data: values
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}

function resetFilters() {
  elTypeContrat.value = "";
  elStatutBien.value = "";
  elAgent.value = "";
  elFrom.value = "";
  elTo.value = "";
  applyFilters();
}

// --- Events ---
btnApply.addEventListener("click", applyFilters);
btnReset.addEventListener("click", resetFilters);

//filtres “dynamiques” (update instantané)
[elTypeContrat, elStatutBien, elAgent, elFrom, elTo].forEach(el => {
  el.addEventListener("change", applyFilters);
});

// --- Init ---
(async function initDashboard() {
  try {
    DATA = await getDashboardData();
    fillAgentFilter(DATA.agents);
    applyFilters();
  } catch (e) {
    console.error(e);
    alert("Erreur: impossible de charger les données du dashboard.");
  }
})();

