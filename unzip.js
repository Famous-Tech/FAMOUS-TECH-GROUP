// unzip.js
const AdmZip = require("adm-zip");
const path = require("path");
const fs = require("fs");

const zipFilePath = path.join(__dirname, "archive.zip"); // Nom du fichier ZIP
const outputDir = path.join(__dirname); // Décompression dans la base du dépôt

// Vérifie si le fichier ZIP existe
if (!fs.existsSync(zipFilePath)) {
    console.error("Le fichier ZIP est introuvable !");
    process.exit(1);
}

try {
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(outputDir, true);
    console.log("Décompression réussie !");
} catch (err) {
    console.error("Erreur lors de la décompression :", err);
