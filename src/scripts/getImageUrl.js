const config = {
  assetUrl:"http://localhost:5500/assets/SANSK5A001x",
  // assetUrl:"http://127.0.0.1:9081/assets/SANSK5A002x",
  port:9081,
}

async function getImageUrl() {
  try {
      let response = await fetch(config.assetUrl, {
        // mode : 'no-cors', //deprecated
      });
      let data = await response.json();
      console.log("Url :", data['Url'].split('.').slice(0, -2).join('.'));
      return "http://localhost:" + config.port + data['Url'].split('.').slice(0, -2).join('.');
  } catch (error) {
      console.error('Error fetching version ID:', error);
      return null;
  }
}
// getImageUrl();
export{getImageUrl};