// ================================
// GESTION DES BIENS IMMOBILIERS
// ================================

// Index du bien en cours de modification
let indexEnCours = null;

// Sélection des éléments
const form = document.getElementById("bienForm");
const tbody = document.getElementById("biensTable");

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
// AFFICHER LES BIENS
// ================================
function afficherBiens() {
  tbody.innerHTML = "";

  biens.forEach((bien, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${bien.id}</td>
        <td>${bien.titre}</td>
        <td>${bien.type}</td>
        <td>${bien.prix} DH</td>
        <td>${bien.statut}</td>
        <td>
          <button class="btn btn-warning btn-sm me-1"
                  onclick="modifierBien(${index})">
            <i class="fa fa-pen"></i>
          </button>

          <button class="btn btn-danger btn-sm"
                  onclick="supprimerBien(${index})">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

// ================================
// AJOUTER / MODIFIER UN BIEN
// ================================
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const bien = {
    titre: document.getElementById("titre").value,
    type: document.getElementById("type").value,
    prix: document.getElementById("prix").value,
    statut: document.getElementById("statut").value
  };

  if (!modify) {
    // ➕ AJOUT
    await addBien(bien);
  } else {
    // ✏️ MODIFICATION
    await modifyBien(biens[indexEnCours].id, bien);
    changeBtnState(false);
    indexEnCours = null;
  }
  form.reset();
  afficherBiens();
});

// ================================
// REMPLIR LE FORMULAIRE (MODIFIER)
// ================================
function modifierBien(index) {
  const bien = biens[index];

  document.getElementById("titre").value = bien.titre;
  document.getElementById("type").value = bien.type;
  document.getElementById("prix").value = bien.prix;
  document.getElementById("statut").value = bien.statut;

  changeBtnState(true);

  indexEnCours = index;
}

// ================================
// SUPPRIMER UN BIEN
// ================================
function supprimerBien(index) {
  deleteBienById(biens[index].id)
  .then(() => {
    afficherBiens();
  });
}

// ================================
// AFFICHAGE AU CHARGEMENT
// ================================
getBiens().then(() => {
  afficherBiens();
});
