const handleSearch = async (event) => {
    
    const query = document.getElementById("query").value;
    if (!query) {
        alert("Please enter a search query.");
        return;
    }
    console.log("Search Query:", query);
    try {
        const response = await fetch(`/api/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:  JSON.stringify({query})
        });
        if (!response.ok) {
            throw new Error("Search failed");
        }
        const searchResults = await response.json();
        console.log("Search Results:", searchResults);

        const inferResponse = await fetch("/api/infer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ songs: searchResults, query })
        });
        console.log("Inference Response:", inferResponse);
        displayResults((await inferResponse.json()).suggestions);
    } catch (error) {
        console.error("Search error:", error);
        alert("Failed to perform search. Please try again later.");
    }
};

const displayResults = (results) => {
    //results = results.replace("\\n", "\n"); // Convert newlines to <br> for HTML display
    // remove leading and trainling "
    //results = results.replace(/^"|"$/g, "");
    // remove leading and trailing whitespace
    //results = results.trim();
    // remove leading and trailing newlines
    
    document.getElementById("suggestions").innerHTML = results;
    renderMarkdown();
    
}