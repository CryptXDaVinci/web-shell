const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Daftar perintah berbahaya yang diblokir
const blockedCommands = [
    "rm -rf", "rm --no-preserve-root -rf", "dd if=", "mkfs", "wipefs",
    "shutdown", "reboot", "poweroff", "halt", "init 0", "init 6",
    "killall", "pkill -9", "pkill --signal 9", "kill -9", "kill -SIGKILL",
    "echo > /dev/sd", "echo > /dev/mmcblk", "mv /", "cp /", "dd if=/dev/zero",
    ":(){ :|:& };:", ">:()", "echo $(sudo", "chmod 000 /", "chown root:root /",
    "mv /bin /tmp", "rm -rf /*"
];

// Fungsi untuk mengecek apakah perintah mengandung yang berbahaya
function isCommandBlocked(command) {
    return blockedCommands.some(blocked => command.includes(blocked));
}

// Endpoint untuk menjalankan perintah
app.post("/run", (req, res) => {
    const command = req.body.command;
    if (!command) return res.status(400).json({ error: "Command is required" });

    // Cek apakah perintah berbahaya
    if (isCommandBlocked(command)) {
        return res.status(403).json({ output: "⚠️ PERINTAH DIBLOKIR: Perintah ini dianggap berbahaya!" });
    }

    exec(command, (error, stdout, stderr) => {
        res.json({ output: error ? stderr || error.message : stdout });
    });
});

// Jalankan server
app.listen(3000, () => {
    console.log("Server berjalan di http://localhost:3000");
});
