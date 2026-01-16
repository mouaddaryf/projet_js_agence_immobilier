
let indexEnCours = null;


const form = document.getElementById("agentForm");
const tbody = document.getElementById("agentsTable");

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



function afficherAgents() {
  tbody.innerHTML = "";

  agents.forEach((agent, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${agent.id}</td>
        <td>${agent.nom}</td>
        <td>${agent.telephone}</td>
        <td>${agent.email}</td>
        <td>${agent.dateembauche}</td>
        <td>
          <button class="btn btn-warning btn-sm me-1"
                  onclick="modifierAgent(${index})">
            <i class="fa fa-pen"></i>
          </button>

          <button class="btn btn-danger btn-sm"
                  onclick="supprimerAgent(${index})">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}


form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const agent = {
    nom: document.getElementById("nom").value,
    telephone: document.getElementById("telephone").value,
    email: document.getElementById("email").value,
    dateembauche: document.getElementById("dateembauche").value
  };

  if (!modify) {

    await addAgent(agent);
  } else {
 
    await modifyAgent(agents[indexEnCours].id, agent);
    changeBtnState(false);
    indexEnCours = null;
  }
  form.reset();
  afficherAgents();
});


function modifierAgent(index) {
    const agent = agents[index];

    document.getElementById("nom").value = agent.nom;
    document.getElementById("telephone").value = agent.telephone;
    document.getElementById("email").value = agent.email;
    document.getElementById("dateembauche").value = agent.dateembauche;
    
    changeBtnState(true);
    
    indexEnCours = index;
}


function supprimerAgent(index) {
    deleteAgentById(agents[index].id)
    .then(() => {
        afficherAgents();
    });
}


getAgents().then(() => {
  afficherAgents();
});

