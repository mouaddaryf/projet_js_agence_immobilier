// ================================
// GESTION DES CLIENTS
// ================================

let indexEnCours = null;

// Sélection des éléments
const form = document.getElementById("clientForm");
const tbody = document.getElementById("clientsTable");
const toggleFormBtn = document.getElementById("toggleFormBtn");

let modify = false;
toggleFormBtn.onclick = function() {
    changeBtnState(false);
};
function changeBtnState(state) {
    modify = state;
    toggleFormBtn.className = modify ? "btn btn-success btn-sm" : "btn btn-secondary btn-sm";
    toggleFormBtn.innerText = modify ? "Edit" : "Add new";
}


// ================================
// AFFICHER LES CLIENTS
// ================================
function afficherClients() {
  tbody.innerHTML = "";

  clients.forEach((client, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${client.id}</td>
        <td>${client.nom}</td>
        <td>${client.telephone}</td>
        <td>${client.email}</td>
        <td>${client.type}</td>
        <td>
          <button class="btn btn-warning btn-sm me-1"
                  onclick="modifierClient(${index})">
            <i class="fa fa-pen"></i>
          </button>

          <button class="btn btn-danger btn-sm"
                  onclick="supprimerClient(${index})">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

// ================================
// SUPPRIMER CLIENT
// ================================
function supprimerClient(index) {
    deleteClientById(clients[index].id)
    .then(() => {
        afficherClients();
    })
    .catch((error) => {
        console.error(error);
        alert("Impossible de supprimer le client");
    });
}

// ================================
// AJOUTER / MODIFIER CLIENT
// ================================
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const client = {
        nom: document.getElementById("nom").value,
        telephone: document.getElementById("telephone").value,
        email: document.getElementById("email").value,
        type: document.getElementById("type").value
    };

    if (!modify) {
        // ➕ AJOUT
        await addClient(client);
    } else {
        // ✏️ MODIFICATION
        await modifyClient(clients[indexEnCours].id,client);
        changeBtnState(false);
        indexEnCours = null;
    }
    afficherClients();
    form.reset();
});


// ================================
// MODIFIER CLIENT
// ================================
function modifierClient(index) {
    changeBtnState(true);

    const client = clients[index];

    document.getElementById("nom").value = client.nom;
    document.getElementById("telephone").value = client.telephone;
    document.getElementById("email").value = client.email;
    document.getElementById("type").value = client.type;

    indexEnCours = index;
}


getClients().then(() => {
    afficherClients();
});