async function getAssetInfo() {
  try {
    const baseUrl = window.location.href.match(/^[^/]+\/\/[^/]+/)[0];
    console.log('baseUrl:', baseUrl);
    const [assetId, query] = window.location.href.substring(baseUrl.length + 1).split('?');
    console.log('assetId:', assetId, 'query:', query);

    const response = await fetch(`/assets/${assetId}`);
    const data = await response.json();
    return {
      imageUrl: `/image/${assetId}`,
      assetId: assetId,
      versionId: data["VersionId"],
    }
  } catch (error) {
    console.error('Error fetching version ID:', error);
    return null;
  }
}

export { getAssetInfo };
