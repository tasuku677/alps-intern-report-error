import { getImageUrl } from "./getImageUrl.js";

async function showPicture(){
    let imageUrl = await getImageUrl();
    let container = document.getElementById("container");
    let imgElement = document.createElement("img");
    imgElement.src = imageUrl;
    imgElement.classList.add("max-width-100", "height-auto");
    container.appendChild(imgElement);
}

showPicture(); 