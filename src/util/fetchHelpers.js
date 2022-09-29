const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://uvp-express.onrender.com';
const apiKey = 'ingDLMRuGe9UKHRNjs7cYckS2yul4lc6';

export const fetchRest = async (request, setData, credentials, setError) => {
    let myHeaders = new Headers();
    myHeaders.append("X-API-KEY", apiKey);

    let formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
    return fetch(`${baseUrl}/${request}`, {
        crossDomain: true,
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setError();
                setData(data);
            }
            return data;
        });
};

export const publishStartList = (credentials, startList) => {
    let myHeaders = new Headers();
    myHeaders.append("X-API-KEY", apiKey);
    myHeaders.append("Content-Type", "application/json");

    let formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
    formData.append("startList", startList);
    return fetch(`${baseUrl}/xmlrpc_server`, {
        crossDomain: true,
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: startList,
    })
        .then(response => response.json())
        .then(data => {
            return data;
        });
}
