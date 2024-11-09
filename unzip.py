import zipfile
import os

# Nom du fichier ZIP et répertoire de sortie
zip_file_path = "archive.zip"  # Nom de votre fichier ZIP
output_dir = "."  # Répertoire de sortie, ici la base du dépôt

# Liste des fichiers à conserver (ici uniquement ce script)
keep_files = ["unzip.py"]

# Fonction pour supprimer tous les fichiers sauf ceux à conserver
def clean_directory(directory):
    for item in os.listdir(directory):
        if item not in keep_files:
            item_path = os.path.join(directory, item)
            if os.path.isdir(item_path):
                os.rmdir(item_path)
            else:
                os.remove(item_path)

# Vérification de l'existence du fichier ZIP
if not os.path.exists(zip_file_path):
    print("Le fichier ZIP est introuvable !")
else:
    # Nettoyage du répertoire
    clean_directory(output_dir)
    print("Répertoire nettoyé avec succès !")

    # Décompression du fichier ZIP
    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        zip_ref.extractall(output_dir)
    print("Décompression réussie !")
