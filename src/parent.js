window.addEventListener("message", (event) => {
    const data = event.data;
    console.log("data", data);
    let { clickedPositions, versionId, imageUrl, space } = data;
    console.log(clickedPositions, typeof (clickedPositions));
    clickedPositions = JSON.parse(clickedPositions);
    positionList = clickedPositions.map(item => {
        return [item.xFromLeft, item.yFromTop];
    });
    // console.log(positionList);

    let url = imageUrl.replace( "image", "points");
    fetch(url, {
        method: 'POST', // POSTメソッドを指定
        headers: {
            'Content-Type': 'application/json' // 送信するデータのタイプをJSONとして指定
        },
        body: JSON.stringify({
            points:positionList,
            version: "testversion"
        })
    })
        .then(response => {
            // レスポンスが成功した場合
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // レスポンスをJSON形式で解析して返す
            return response.json();
        })
        .then(data => {
            // POSTリクエストが成功した場合の処理
            console.log('POSTリクエスト成功:', data);
        })
        .catch(error => {
            // エラー処理
            console.error('Fetch Error :-S', error);
        });

}
);
