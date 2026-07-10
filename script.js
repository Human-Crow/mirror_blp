const WORKER = "https://builderment-blp.reddit2611.workers.dev";

import {uploadBlp, downloadBlp, mirrorBlp} from `${WORKER}/api.js`;


const blp_id = document.getElementById("blp_id");
const mirror = document.getElementById("mirror");
const txt_id = document.getElementById("txt_id");
const link = document.getElementById("link");
const p_status = document.getElementById("status");




function get_id() {
    const value = blp_id.value.trim();
    let id;
    try {
        const url = new URL(value);
        id = url.searchParams.get("id") ?? "";
    } catch {
        id = value;
    }
    if (!/^[a-zA-Z0-9]{6}$/.test(id)) {
        throw new Error(`Invalid blueprint ID: '${id}'.`);
    }
    return id;
}


mirror.onclick = async function() {
    p_status.textContent = "Loading...";
    try {
        const current_id = get_id();
        const blp_buffer = await downloadBlp(WORKER, current_id);
        const new_buffer = await mirrorBlp(WORKER, blp_buffer);
        const result = await uploadBlp(WORKER, new_buffer);
        txt_id.textContent = result.id;
        link.href = result.url;
        link.textContent = result.url;
        p_status.innerHTML = "&nbsp;";
    } catch (err) {
        console.log(err);
        p_status.innerHTML = `Error!<br>${err.message}`;
    }

}