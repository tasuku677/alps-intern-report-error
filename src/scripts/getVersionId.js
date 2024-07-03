const config = {
    assetUrl:"http://127.0.0.1:5500/assets/SANSK5A001x",
}

async function getVersionId() {
    try {
        let response = await fetch(config.assetUrl);
        let data = await response.json();
        console.log("VersionId :", data['VersionId']);
        return data['VersionId'];
    } catch (error) {
        console.error('Error fetching version ID:', error);
        return null;
    }
}
// getVersionId();
export {getVersionId};
