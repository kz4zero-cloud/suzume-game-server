const ws = new WebSocket(`ws://${location.host}`);

ws.onopen = () => {
    addLog("サーバーに接続しました");
};

ws.onmessage = (event) => {
    addLog(`受信: ${event.data}`);
};

ws.onclose = () => {
    addLog("サーバーから切断されました");
};

function sendMessage() {
    const input = document.getElementById("msg");
    if (input.value) {
        ws.send(input.value);
        input.value = "";
    }
}

function addLog(message) {
    const log = document.getElementById("log");
    log.innerHTML += message + "<br>";
}
