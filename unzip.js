// unzip.js
const AdmZip = require("adm-zip");
const path = require("path");
const fs = require("fs");

// Nom du fichier ZIP et répertoire de sortie
const zipFilePath = path.join(__dirname, "archive.zip");
const outputDir = path.join(__dirname);

// Liste des fichiers à conserver
const keepFiles = ["unzip.js", "package.json"];

// Fonction pour supprimer tous les fichiers sauf ceux à conserver
function cleanDirectory(directory) {
    fs.readdirSync(directory).forEach(file => {
        if (!keepFiles.includes(file)) {
            const filePath = path.join(directory, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                fs.rmSync(filePath, { recursive: true, force: true });
            } else {
                fs.unlinkSync(filePath);
            }
        }
    });
}

// Vérifie si le fichier ZIP existe
if (!fs.existsSync(zipFilePath)) {
    console.error("Le fichier ZIP est introuvable !");
    process.exit(1);
}

try {
    // Nettoie le répertoire
    cleanDirectory(outputDir);
    console.log("Répertoire nettoyé avec succès !");

    // Décompression du ZIP
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(outputDir, true);
    console.log("Décompression réussie !");
} catch (err) {
    console.error("Erreur lors de la décompression :", err);
    }
