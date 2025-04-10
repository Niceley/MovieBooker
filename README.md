# MovieBooker

MovieBooker est une application web complète permettant de réserver des places de cinéma. Le projet est divisé en deux parties : une API backend développée avec NestJS et un frontend développé avec Angular.

## 🌐 URLs de Production

- Frontend : [https://movie-booker-beta.vercel.app/](https://movie-booker-beta.vercel.app/)
- Backend API : [https://moviebooker-api.onrender.com/](https://moviebooker-api.onrender.com/)
- Documentation API (Swagger) : [https://moviebooker-api.onrender.com/documentation](https://moviebooker-api.onrender.com/documentation)

## 📁 Structure du Projet

```
MovieBooker/
├── moviebooker-api/     # Backend NestJS
└── moviebooker-frontend/ # Frontend Angular
```

## 🚀 Démarrage Rapide

### Backend (moviebooker-api)

```bash
cd moviebooker-api
npm install
npm run start:dev
```

Le serveur backend démarrera sur `http://localhost:3000`

### Frontend (moviebooker-frontend)

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
- **Documentation API** : Swagger
- **Déploiement** :
  - Frontend : Vercel
  - Backend : Render
