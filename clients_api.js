const SUPABASE_URL = "https://fqyagydplfewjdnmzhxc.supabase.co";
const API_KEY = "sb_publishable_kqUzQjRwlPnQKgaaDM8_YA_hY9JlECZ";
const JSON_CONTENT = "application/json";
const REPRESENTATION = "return=representation";

let clients = [];

async function getClients() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/clients`, {
        method: "GET",
        headers: {
            "apikey": API_KEY,
            "Content-Type": JSON_CONTENT
        }
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    clients = await response.json();

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function getClientById(id) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/clients?id=eq.${id}`, {
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

async function addClient(client) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/clients`,
            {
                method: "POST",
                headers: {
                "apikey": API_KEY,
                "Content-Type": JSON_CONTENT,
                "Prefer": REPRESENTATION
                },
                body: JSON.stringify(client)
            }
        );

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout du client");
        }

        const newClient = await response.json();

        clients.push(newClient[0]);
    } catch (error) {
        console.error(error);
        alert("Impossible d'ajouter le client");
    }
}

async function modifyClient(id,client) {
    // PUT AND PATCH Both are used to update resources.
    // The difference is that PUT is used to update the entire resource,
    // while PATCH is used to update a part of the resource.

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/clients?id=eq.${id}`,
            {
                method: "PATCH",
                headers: {
                "apikey": API_KEY,
                "Content-Type": JSON_CONTENT,
                "Prefer": REPRESENTATION
                },
                body: JSON.stringify(client)
            }
        );

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout du client");
        }

        const newClient = await response.json();
        clients = clients.filter(c => c.id !== id);
        clients.push(newClient[0]);
    } catch (error) {
        console.error(error);
        alert("Impossible d'ajouter le client");
    }
}

async function deleteClientById(id) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/clients?id=eq.${id}`,
            {
                method: "DELETE",
                headers: {
                "apikey": API_KEY,
                }
            }
        );
        if (!response.ok) {
            throw new Error("Erreur lors de la suppression du client");
        }
        clients = clients.filter(c => c.id !== id);
    } catch (error) {
        console.error(error);
        alert("Impossible de supprimer le client");
    }
}