const SUPABASE_URL = "https://fqyagydplfewjdnmzhxc.supabase.co";
const API_KEY = "sb_publishable_kqUzQjRwlPnQKgaaDM8_YA_hY9JlECZ";
const JSON_CONTENT = "application/json";
const REPRESENTATION = "return=representation";

let visites = [];

async function getVisites() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/v_visites`, {
        method: "GET",
        headers: {
            "apikey": API_KEY,
            "Content-Type": JSON_CONTENT
        }
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    visites = await response.json();

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function getVisiteById(id) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/v_visites?id=eq.${id}`, {
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

async function addVisite(visite) {
    try {

        const response = await fetch(`${SUPABASE_URL}/rest/v1/visites`,
            {
                method: "POST",
                headers: {
                "apikey": API_KEY,
                "Content-Type": JSON_CONTENT,
                "Prefer": REPRESENTATION
                },
                body: JSON.stringify(visite)
            }
        );

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout de la visite");
        }

        const newVisite = await response.json();

        await getVisiteById(newVisite[0].id).then(data => {
            visites.push(data[0]);
        });
    } catch (error) {
        console.error(error);
        alert("Impossible d'ajouter la visite");
    }
}

async function deleteVisiteById(id) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/visites?id=eq.${id}`,
            {
                method: "DELETE",
                headers: {
                "apikey": API_KEY,
                }
            }
        );
        if (!response.ok) {
            throw new Error("Erreur lors de la suppression de la visite");
        }
        visites = visites.filter(c => c.id !== id);
    } catch (error) {
        console.error(error);
        alert("Impossible de supprimer la visite");
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