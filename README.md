# Gestion des candidats – Full Stack & Test Engineer

Application de gestion de candidats avec API Node.js/Express/MongoDB et frontend React/TypeScript.  
Le projet intègre une stratégie de tests exhaustive (unité, intégration, E2E, charge, sécurité) et une pipeline CI/CD.

---
# Auteur 
RANDROZAFIARINONY Liantsoa Ange

## 🚀 Démarrage rapide

### Prérequis
- Node.js 20+ et npm
- MongoDB (ou utiliser Docker)
- Docker & Docker Compose (optionnel)

### Installation & lancement en développement

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/LintsKely/Gestion-des-candidats.git
   cd Gestion-des-candidats

# Backend
cd backend
cp .env.example .env   # ajuster les variables si nécessaire
npm install
npm run dev            # démarre sur http://localhost:5000


# Frontend
cd frontend
cp .env.example .env   # vérifier VITE_API_URL=http://localhost:5000
npm install
npm run dev            # démarre sur http://localhost:5173


## 🔑 Identifiants par défaut

Pour tester l’application, utilisez les identifiants suivants :

- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `Candidat@2026!`

> Ces identifiants correspondent au hash stocké dans `ADMIN_PASSWORD_HASH`.  
> Pour changer le mot de passe, générez un nouveau hash avec la commande :
> ```bash
> node -e "console.log(require('bcryptjs').hashSync('votre_mot_de_passe', 10))"
> ```
> et remplacez la valeur dans le fichier `.env` du backend.