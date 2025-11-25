# MovieBooker

MovieBooker est une application web complète permettant de réserver des places de cinéma. Le projet est divisé en deux parties : une API backend développée avec NestJS et un frontend développé avec Angular.

# Contributeur

Ce projet à été fait en groupe avec : 

David W. - 20230637
Thomas L. - 20230012
Antoine H. - 20230367

## 📁 Structure du Projet

```
MovieBooker/
├── moviebooker-api/     # Backend NestJS
└── moviebooker-frontend/ # Frontend Angular
```

Avant d'initialiser le projet, il faut récupérer une clé API TMDB sur le lien suivant : 

https://www.themoviedb.org/settings/api

## 🚀 Démarrage Rapide

### Option 1 : Avec Docker (Recommandé) 🐳

La méthode la plus simple pour démarrer le projet est d'utiliser Docker. La seule configuration nécessaire est votre clé API TMDB.

1. **Configurez votre clé API TMDB** :
   ```bash
   # Éditez .env et remplacez your_tmdb_api_key_here par votre vraie clé API
   ```

2. **Démarrez tous les services** :
   ```bash
   docker-compose up -d
   ```

3. **Accédez à l'application** :
   - Frontend : http://localhost:80
   - Backend API : http://localhost:3000
   - Documentation API : http://localhost:3000/documentation

Pour plus de détails, consultez le [Guide Docker](./DOCKER.md).

### Option 2 : Installation Manuelle

#### Backend (moviebooker-api)

```bash
cd moviebooker-api
npm install
npm run start:dev
```

Le serveur backend démarrera sur `http://localhost:3000`

#### Frontend (moviebooker-frontend)

```bash
cd moviebooker-frontend
npm install
ng serve
```

L'application frontend sera accessible sur `http://localhost:4200`

## 📚 Documentation

Pour plus de détails sur chaque partie du projet, consultez les README spécifiques :

- [Documentation Frontend](./moviebooker-frontend/README.md)
- [Documentation Backend](./moviebooker-api/README.md)

## 🛠 Technologies Utilisées

- **Frontend** : Angular 19
- **Backend** : NestJS
- **Base de données** : PostgreSQL
