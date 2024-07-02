const config = {
    assetUrl:"http://127.0.0.1:9081/assets/SANSK5A001x",
    // assetUrl:"http://127.0.0.1:9081/assets/SANSK5A002x",
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
