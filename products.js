const komputersURL = "https://computer-api-production.up.railway.app/computers";
        
export const getKomputers = async () => {
    const response = await fetch(komputersURL);
    const data = await response.json();
    return data;
}


