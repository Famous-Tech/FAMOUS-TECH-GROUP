import zipfile
import os
import shutil

# Recherche du fichier ZIP
zip_file_path = next((f for f in os.listdir(".") if f.endswith(".zip")), None)

# Liste des fichiers à conserver
keep_files = ["unzip.py, FAMOUS-TECH-GROUP-main_125316.zip"]

def clean_directory(directory):
    for item in os.listdir(directory):
        if item not in keep_files:
            item_path = os.path.join(directory, item)
            if os.path.isdir(item_path):
                shutil.rmtree(item_path)
            else:
                os.remove(item_path)

if not zip_file_path:
    print("Aucun fichier ZIP trouvé !")
else:
    # Nettoyage du répertoire
    clean_directory(".")
    print("Répertoire nettoyé avec succès !")

    # Décompression du fichier ZIP
    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        zip_ref.extractall(".")
    print("Décompression réussie !")
