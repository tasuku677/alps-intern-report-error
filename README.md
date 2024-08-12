# visual-problem-vue
# visual-problem-vue

## Overview
This Vue.js-based application allows users to tap on defective parts of a component and record the faulty areas. The tapped area data is submitted to a parent component along with the version ID and image URL.

## Getting started

### Backend
Launch the backend server in advance by running the following command.

    docker run --rm -p 9081:8080 -v $(pwd):/app/static -e S3_ACCESS_KEY=YOUR_ACCESS_KEY -e S3_SECRET_KEY=YOUR_SECRET_KEY -e S3_BUCKET_NAME=YOUR_BUCKET_NAME gitext.alps.cz:5000/mantra/services/image-store:latest
    

### Frontend
1. Install dependencies.
    ```
    npm install
    ```
2. Compile and hot-reload for development
    ```
    npm run serve
    ```
<!-- 3. Compile and minify for production
    ```
    npm run build
    ```
4. Lint and fix files
    ```
    npm run lint -->
    

## Accessing the Defective Part Selection

To access the defective part selection, follow the URL format below:

```
http://{frontend-server-address}:{port-number-by-frontend}/{asset-ID}?port={port-number-used-by-backend}
```

Replace `{frontend-server-address}` with the address of the development server provided by the Vue CLI, `{port-number-used-by-frontend}` with the desired port number, `{asset-ID}` with the ID of the asset you want to access, and `{port-number-used-by-backend}` with the port number used by the backend server.

For example, if the server address is `localhost`, the frontend port number is `5500`, the asset ID is `car-dodge`, and the backend port number is `9081`, the URL would be:

```
http:/localhost:5500/car-dodge?port=9081
```