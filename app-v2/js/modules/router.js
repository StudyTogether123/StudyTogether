// =======================================
// PUBLIC MINI ROUTER
// =======================================

import { loadPostDetail } from "./postDetail.js";
import { loadHome } from "./data.js"; // hoặc trang chủ của bạn

export function initRouter() {
    window.addEventListener("hashchange", handleRoute);
    handleRoute();
}

function handleRoute() {

    const hash = window.location.hash;

    // #post-5
    if (hash.startsWith("#post-")) {
        const id = hash.replace("#post-", "");
        loadPostDetail(id);
        return;
    }

    // default → home
    loadHome();
}