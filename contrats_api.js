const SUPABASE_URL = "https://fqyagydplfewjdnmzhxc.supabase.co";
const API_KEY = "sb_publishable_kqUzQjRwlPnQKgaaDM8_YA_hY9JlECZ";
const JSON_CONTENT = "application/json";
const REPRESENTATION = "return=representation";

let contrats = [];

async function getContrats() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/v_contrats`, {
        method: "GET",
        headers: {
            "apikey": API_KEY,
            "Content-Type": JSON_CONTENT
        }
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    contrats = await response.json();

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function getContratById(id) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/v_contrats?id=eq.${id}`, {
        method: "GET",
        headers: {
            "apikey": API_KEY,
            "Content-Type": JSON_CONTENT
        }
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function addContrat(contrat) {
    try {

        const response = await fetch(`${SUPABASE_URL}/rest/v1/contrats`,
            {
                method: "POST",
                headers: {
                "apikey": API_KEY,
                "Content-Type": JSON_CONTENT,
                "Prefer": REPRESENTATION
                },
                body: JSON.stringify(contrat)
            }
        );

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout du contrat");
        }

        const newContrat = await response.json();

        await getContratById(newContrat[0].id).then(data => {
            contrats.push(data[0]);
        });
    } catch (error) {
        console.error(error);
        alert("Impossible d'ajouter le contrat");
    }
}

async function deleteContratById(id) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/contrats?id=eq.${id}`,
            {
                method: "DELETE",
                headers: {
                "apikey": API_KEY,
                }
            }
        );
        if (!response.ok) {
            throw new Error("Erreur lors de la suppression de la contrat");
        }
        contrats = contrats.filter(c => c.id !== id);
    } catch (error) {
        console.error(error);
        alert("Impossible de supprimer le contrat");
    }
}

async function getShortClients() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/clients?select=id,nom`, {
            method: "GET",
            headers: {
                "apikey": API_KEY,
                "Content-Type": JSON_CONTENT
            }
        });

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function getShortBiens() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/biens?select=id,titre`, {
            method: "GET",
            headers: {
                "apikey": API_KEY,
                "Content-Type": JSON_CONTENT
            }
        });
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function getShortAgents() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/agents?select=id,nom`, {
            method: "GET",
            headers: {
                "apikey": API_KEY,
                "Content-Type": JSON_CONTENT
            }
        });
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}