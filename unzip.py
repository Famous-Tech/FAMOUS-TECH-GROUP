import zipfile
import os
import shutil
import subprocess

zip_file_path = next((f for f in os.listdir(".") if f.endswith(".zip")), None)

keep_files = ["unzip.py", "FAMOUS-TECH-GROUP-main_125316.zip"]

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
    clean_directory(".")
    print("Répertoire nettoyé avec succès !")

    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        zip_ref.extractall(".")
    print("Décompression réussie !")

    subprocess.run(["git", "init"], check=True)

    # Configurer les informations Git
    subprocess.run(["git", "config", "--local", "user.name", "GitHub Actions"], check=True)
    subprocess.run(["git", "config", "--local", "user.email", "actions@github.com"], check=True)

    subprocess.run(["git", "add", "."], check=True)

    try:
        subprocess.run(["git", "commit", "-m", "Décompression du fichier ZIP et nettoyage"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors du commit: {e}")
    
    subprocess.run(["git", "push", "https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }} HEAD:main"], check=True)

    print("Git push effectué avec succès !")
