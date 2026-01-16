
const form = document.getElementById("contractForm");
const tbody = document.getElementById("contractsTable");



async function initSelects() {
  const bienSelect = document.getElementById("bienSelect");
  const clientSelect = document.getElementById("clientSelect");
  const agentSelect = document.getElementById("agentSelect");

  try {
  
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
// AFFICHER LES CONTRATS
// ================================
function afficherContrats() {
  tbody.innerHTML = "";

  contrats.forEach((contrat, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${contrat.id}</td>
        <td>${contrat.bien}</td>
        <td>${contrat.client}</td>
        <td>${contrat.agent}</td>
        <td>${contrat.type}</td>
        <td>${contrat.montant}</td>
        <td>${contrat.date}</td>
        <td>
          <button class="btn btn-danger btn-sm"
                  onclick="supprimerContrat(${index})">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const contrat = {
        bienid: bienSelect.value,
        clientid: clientSelect.value,
        agentid: agentSelect.value,
        type: type.value,
        montant: montant.value,
        date: dateContrat.value
    };
    
    addContrat(contrat)
    .then(() => {
        afficherContrats();
        form.reset();
    });
});

// ================================
// SUPPRIMER CONTRAT
// ================================
function supprimerContrat(index) {
    deleteContratById(contrats[index].id)
    .then(() => {
        afficherContrats();
    });
}

// ================================
// AU CHARGEMENT
// ================================
getContrats().then(() => {
    afficherContrats();
});


initSelects();
