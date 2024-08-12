async function getAssetInfo() {
  try {
    const baseUrl = window.location.href.match(/^[^/]+\/\/[^/]+/)[0];
    console.log('baseUrl:', baseUrl);
    const [assetId, query] = window.location.href.substring(baseUrl.length + 1).split('?');
    const portNumber = query.replace('port=', '');
    console.log('assetId:', assetId, 'query:', query, 'portNumber:', portNumber);
    console.log(`${baseUrl}/assets/${assetId}`);

    const response = await fetch(`${baseUrl}/assets/${assetId}`);
    const data = await response.json();
    let objectData = {
      imageUrl: `${baseUrl.replace(/:\d+$/, '')}:${portNumber}/image/${assetId}`,
      assetId: assetId,
      versionId: data["VersionId"],
    }
    return JSON.stringify(objectData);
  } catch (error) {
    console.error('Error fetching version ID:', error);
    return null;
  }
}

// function extractId(url) {
//   let parts = url.split('/');
//   let filename = parts[parts.length - 1];

//   let lastIndex = filename.lastIndexOf('.');
//   if (lastIndex !== -1) {
//     filename = filename.substring(0, lastIndex);
//   }

//   return filename;
// }
// getAssetInfo();
export { getAssetInfo };