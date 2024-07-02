<template>
    <div>
        <form action="/parent" method="post" id="submit">
            <input type="submit" value="Submit">
        </form>
        <div id="container"></div>
    </div>
</template>

<script setup>
// スクリプトセクションで必要な外部スクリプトやモジュールをインポートします
import Konva from 'konva';
import markCircle from '../scripts/markCircle.js';
import submit from '../scripts/submit.js';

markCircle(Konva);
submit();
</script>

<!-- スタイルシートやその他のリソースをインポートする場合は、ここに記述します -->
<style scoped>
/* 必要なスタイルを記述します */
</style>