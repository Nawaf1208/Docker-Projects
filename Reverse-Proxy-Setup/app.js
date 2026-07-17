const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send(`
        <h1>Reverse Proxy Setup with Nginx</h1>
        <p><strong>Host:</strong> ${req.headers.host}</p>
        <p><strong>Client IP:</strong> ${req.headers["x-real-ip"]}</p>
        <p><strong>Protocol:</strong> ${req.headers["x-forwarded-proto"]}</p>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})