
const blp_id = document.getElementById("blp_id");
const mirror = document.getElementById("mirror");
const txt_id = document.getElementById("txt_id");
const link = document.getElementById("link");
const p_status = document.getElementById("status");




async function downloadBlp(id) {
    const res = await fetch(
        `https://builderment-server.reddit2611.workers.dev/downloadBlp?id=${id}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.arrayBuffer();
}

async function uploadBlp(data) {
    const res = await fetch(
        "https://builderment-server.reddit2611.workers.dev/uploadBlp", 
        { method: "POST", body: data }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}


async function mirror_blp(data) {
    const res = await fetch(
        "https://builderment-blp.reddit2611.workers.dev",
        { method: "POST", body: data }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.arrayBuffer();
}


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
    const current_id = get_id();
    const blp_buffer = await downloadBlp(current_id);
    const new_buffer = await mirror_blp(blp_buffer);
    const result = await uploadBlp(new_buffer);
    txt_id.textContent = result.id;
    link.href = result.url;
    link.textContent = result.url;
    p_status.innerHTML = "&nbsp;";
}