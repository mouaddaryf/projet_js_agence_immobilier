const SUPABASE_URL = "https://fqyagydplfewjdnmzhxc.supabase.co";
const API_KEY = "sb_publishable_kqUzQjRwlPnQKgaaDM8_YA_hY9JlECZ";
const JSON_CONTENT = "application/json";
const REPRESENTATION = "return=representation";

let biens = [];

async function getBiens() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/biens`, {
        method: "GET",
        headers: {
            "apikey": API_KEY,
            "Content-Type": JSON_CONTENT
        }
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    biens = await response.json();

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function getBienById(id) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/biens?id=eq.${id}`, {
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

async function addBien(bien) {
    try {
        console.log("Adding bien:", JSON.stringify(bien));

        const response = await fetch(`${SUPABASE_URL}/rest/v1/biens`,
            {
                method: "POST",
                headers: {
                "apikey": API_KEY,
                "Content-Type": JSON_CONTENT,
                "Prefer": REPRESENTATION
                },
                body: JSON.stringify(bien)
            }
        );

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout du bien");
        }

        const newBien = await response.json();

        biens.push(newBien[0]);
    } catch (error) {
        console.error(error);
        alert("Impossible d'ajouter le bien");
    }
}

async function modifyBien(id,bien) {
    // PUT AND PATCH Both are used to update resources.
    // The difference is that PUT is used to update the entire resource,
    // while PATCH is used to update a part of the resource.

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/biens?id=eq.${id}`,
            {
                method: "PATCH",
                headers: {
                "apikey": API_KEY,
                "Content-Type": JSON_CONTENT,
                "Prefer": REPRESENTATION
                },
                body: JSON.stringify(bien)
            }
        );

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout du bien");
        }

        const newBien = await response.json();
        biens = biens.filter(c => c.id !== id);
        biens.push(newBien[0]);
    } catch (error) {
        console.error(error);
        alert("Impossible d'ajouter le bien");
    }
}

async function deleteBienById(id) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/biens?id=eq.${id}`,
            {
                method: "DELETE",
                headers: {
                "apikey": API_KEY,
                }
            }
        );
        if (!response.ok) {
            throw new Error("Erreur lors de la suppression du bien");
        }
        biens = biens.filter(c => c.id !== id);
    } catch (error) {
        console.error(error);
        alert("Impossible de supprimer le bien");
    }
}