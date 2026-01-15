// ================================
// GESTION DES VISITES
// ================================
// Sélection DOM
const form = document.getElementById("visiteForm");
const tbody = document.getElementById("visitesTable");

// ================================
// INITIALISER LES LISTES DEROULANTES
// ================================


async function initSelects() {
  const bienSelect = document.getElementById("bienSelect");
  const clientSelect = document.getElementById("clientSelect");
  const agentSelect = document.getElementById("agentSelect");

  try {
    // optional: disable while loading
    bienSelect.disabled = clientSelect.disabled = agentSelect.disabled = true;

    const [biens, clients, agents] = await Promise.all([
      getShortBiens(),
      getShortClients(),
      getShortAgents()
    ]);

    populateSelect(bienSelect, biens, {
      valueKey: "id",
      labelKey: "titre",
      placeholder: "Choisir un bien..."
    });

    populateSelect(clientSelect, clients, {
      valueKey: "id",
      labelKey: "nom",
      placeholder: "Choisir un client..."
    });

    populateSelect(agentSelect, agents, {
      valueKey: "id",
      labelKey: "nom",
      placeholder: "Choisir un agent..."
    });

  } catch (err) {
    console.error(err);
    alert("Erreur: impossible de charger les listes (biens/clients/agents).");
  } finally {
    bienSelect.disabled = clientSelect.disabled = agentSelect.disabled = false;
  }
}

function populateSelect(selectEl, items, { valueKey, labelKey, placeholder }) {
  // Clear
  selectEl.innerHTML = "";

  // Placeholder option
  const opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = placeholder || "Choisir...";
  opt0.disabled = true;
  opt0.selected = true;
  selectEl.appendChild(opt0);

  // Items
  for (const item of items) {
    const opt = document.createElement("option");
    opt.value = item[valueKey];
    opt.textContent = item[labelKey];
    selectEl.appendChild(opt);
  }
}





// ================================
// AFFICHER LES VISITES
// ================================
function afficherVisites() {
  tbody.innerHTML = "";

  visites.forEach((visite, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${visite.id}</td>
        <td>${visite.bien_titre}</td>
        <td>${visite.client_nom}</td>
        <td>${visite.agent_nom}</td>
        <td>${visite.date}</td>
        <td>
          <button class="btn btn-danger btn-sm"
                  onclick="supprimerVisite(${index})">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

// ================================
// AJOUTER VISITE
// ================================
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const visite = {
        bienid: bienSelect.value,
        clientid: clientSelect.value,
        agentid: agentSelect.value,
        date: dateVisite.value
    };
    
    addVisite(visite)
    .then(() => {
        afficherVisites();
        form.reset();
    });
});

// ================================
// SUPPRIMER VISITE
// ================================
function supprimerVisite(index) {
    deleteVisiteById(visites[index].id)
    .then(() => {
        afficherVisites();
    });
}

// ================================
// AU CHARGEMENT
// ================================
getVisites().then(() => {
  afficherVisites();
});

initSelects();