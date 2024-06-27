import {getVersionId} from './getVersionId.js';

const config = {
    imageUrl: "http://localhost:9081/image/SANSK5A001x", //need to be corrected later.
    // imageUrl: "http://localhost:9081/image/SANSK5A002x",
}

async function getImageUrl(){
  try{
    let versionId = await getVersionId();
    console.log("versionId=",versionId);
    console.log("url", config.imageUrl);
    let responce = await fetch(config.imageUrl);
    let localImageUrl = URL.createObjectURL(await responce.blob());
    console.log("imageURL", localImageUrl);
    return localImageUrl;
  }catch(err){
    console.log('Error:', err);
  }
};

getImageUrl();
export{getImageUrl};