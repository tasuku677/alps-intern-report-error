import {fetchVersionId} from './getVersionId.js';

const config = {
    imageUrl: "http://localhost:9081/image/SANSK5A001x", //need to be corrected later.
}

async function getImageUrl(){
  try{
    let versionId = await fetchVersionId();
    let url = config.imageUrl + '?' + versionId;
    let imageUrl = await fetch(url)
              .then(response => response.blob())
              .then(blob => URL.createObjectURL(blob))
              // .catch(error => {
              //     console.error('Error fetching image:', error);
              //     throw error; 
              // });
    console.log(imageUrl);
    return imageUrl;
  }catch(err){
    console.log('Error:', err);
  }
};

export{getImageUrl};