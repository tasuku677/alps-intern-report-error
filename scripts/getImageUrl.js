const config = {
  assetUrl:"http://127.0.0.1:8080/assets/SANSK5A001x",
  // assetUrl:"http://127.0.0.1:9081/assets/SANSK5A002x",
  port:8080,
}

async function getImageUrl() {
  try {
      let response = await fetch(config.assetUrl);
      let data = await response.json();
      console.log("Url :", data['Url'].split('.').slice(0, -1).join('.'));
      return "http://localhost:" + config.port + data['Url'].split('.').slice(0, -1).join('.');
  } catch (error) {
      console.error('Error fetching version ID:', error);
      return null;
  }
}
// getImageUrl();
export{getImageUrl};