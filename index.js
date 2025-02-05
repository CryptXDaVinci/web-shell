const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Jalankan perintah shell dari request POST
app.post("/run", (req, res) => {
    const command = req.body.command;
    if (!command) {
        return res.status(400).json({ error: "Command is required" });
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.json({ output: stderr || error.message });
        }
        res.json({ output: stdout });
    });
});

// Jalankan server di port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
