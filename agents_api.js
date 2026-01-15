const SUPABASE_URL = "https://fqyagydplfewjdnmzhxc.supabase.co";
const API_KEY = "sb_publishable_kqUzQjRwlPnQKgaaDM8_YA_hY9JlECZ";
const JSON_CONTENT = "application/json";
const REPRESENTATION = "return=representation";

let agents = [];

async function getAgents() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/agents`, {
        method: "GET",
        headers: {
            "apikey": API_KEY,
            "Content-Type": JSON_CONTENT
        }
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    agents = await response.json();

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function getAgentById(id) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/agents?id=eq.${id}`, {
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

async function addAgent(agent) {
    try {

        const response = await fetch(`${SUPABASE_URL}/rest/v1/agents`,
            {
                method: "POST",
                headers: {
                "apikey": API_KEY,
                "Content-Type": JSON_CONTENT,
                "Prefer": REPRESENTATION
                },
                body: JSON.stringify(agent)
            }
        );

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout de l'agent");
        }

        const newAgent = await response.json();

        agents.push(newAgent[0]);
    } catch (error) {
        console.error(error);
        alert("Impossible d'ajouter l'agent");
    }
}

async function modifyAgent(id,agent) {
    // PUT AND PATCH Both are used to update resources.
    // The difference is that PUT is used to update the entire resource,
    // while PATCH is used to update a part of the resource.

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/agents?id=eq.${id}`,
            {
                method: "PATCH",
                headers: {
                "apikey": API_KEY,
                "Content-Type": JSON_CONTENT,
                "Prefer": REPRESENTATION
                },
                body: JSON.stringify(agent)
            }
        );

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout de l'agent");
        }

        const newAgent = await response.json();
        agents = agents.filter(c => c.id !== id);
        agents.push(newAgent[0]);
    } catch (error) {
        console.error(error);
        alert("Impossible d'ajouter l'agent");
    }
}

async function deleteAgentById(id) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/agents?id=eq.${id}`,
            {
                method: "DELETE",
                headers: {
                "apikey": API_KEY,
                }
            }
        );
        if (!response.ok) {
            throw new Error("Erreur lors de la suppression de l'agent");
        }
        agents = agents.filter(c => c.id !== id);
    } catch (error) {
        console.error(error);
        alert("Impossible de supprimer l'agent");
    }
}