window.addEventListener("message", (event) => {
    const data = event.data;
    console.log("data", data);
    let { clickedPositions, versionId, imageUrl, space } = data;
    console.log(clickedPositions, typeof (clickedPositions));
    clickedPositions = JSON.parse(clickedPositions);
    positionList = clickedPositions.map(item => {
        return [item.xFromLeft, item.yFromTop];
    });
    
    let url = imageUrl.replace( "image", "points");
    fetch(url, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            points:positionList,
            version: "testversion"
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('POSTリクエスト成功:', data);
        })
        .catch(error => {
            console.error('Fetch Error :-S', error);
        });

}
);
