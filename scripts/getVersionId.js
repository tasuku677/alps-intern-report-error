const config = {
    assetUrl:"http://127.0.0.1:9081/assets/SANSK5A001x",
}


async function fetchVersionId() {
    try {
        let response = await fetch(config.assetUrl);
        let data = await response.json();
        // console.log(data);
        return data['VersionId'];
    } catch (error) {
        console.error('Error fetching version ID:', error);
        return null;
    }
}
// fetchVersionId()
export {fetchVersionId};
