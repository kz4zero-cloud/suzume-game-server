const ws = new WebSocket(`ws://${location.host}`);

ws.onopen = () => {
    addLog("�T�[�o�[�ɐڑ����܂���");
};

ws.onmessage = (event) => {
    addLog(`��M: ${event.data}`);
};

ws.onclose = () => {
    addLog("�T�[�o�[����ؒf����܂���");
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
