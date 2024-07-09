const config = {
  assetUrl:"http://localhost:5500/assets/SANSK5A001x",
  // assetUrl:"http://localhost:5500/assets/car-dodge",
  port:9081,
}

async function getAssetInfo() {
  try {
      const response = await fetch(config.assetUrl);
      const data = await response.json();
      const id = extractId(data['Url']);
      let objectData = {
        imageUrl:"http://localhost:" + config.port + '/image/' + id.replace('.', ''),
        assetId: id.replace('.', ''),
        versionId: data["VersionId"],
      }
      return JSON.stringify(objectData);
  } catch (error) {
      console.error('Error fetching version ID:', error);
      return null;
  }
}

function extractId(url) {
  // URLを"/"で分割し、最後の要素を取得
  let parts = url.split('/');
  let filename = parts[parts.length - 1];
  
  // 拡張子があれば取り除く
  let lastIndex = filename.lastIndexOf('.');
  if (lastIndex !== -1) {
      filename = filename.substring(0, lastIndex);
  }
  
  return filename;
}

// getAssetInfo();
export{getAssetInfo};