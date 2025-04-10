# MovieBooker Frontend

Interface utilisateur du projet MovieBooker développée avec Angular 19.

## 🌐 URL de Production

[https://movie-booker-beta.vercel.app/](https://movie-booker-beta.vercel.app/)

## 🚀 Installation et Démarrage

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
ng serve

# Construction du projet
ng build

# Exécution des tests unitaires
ng test
```

L'application sera accessible sur `http://localhost:4200/`

## 📱 Fonctionnalités

- **Authentification**
  - Connexion/Inscription
  - Gestion du profil utilisateur

- **Gestion des Films**
  - Liste des films disponibles
  - Détails des films
  - Recherche et filtrage

- **Réservations**
  - Sélection des séances
  - Choix des places
  - Historique des réservations

- **Interface Administrateur**
  - Gestion des films
  - Gestion des séances
  - Gestion des salles

## 🛠 Structure du Projet

```
src/
├── app/
│   ├── components/     # Composants réutilisables
│   ├── pages/         # Pages principales
│   ├── services/      # Services d'API et utilitaires
│   ├── models/        # Interfaces et types
│   ├── guards/        # Guards d'authentification
│   └── shared/        # Éléments partagés
├── assets/           # Images et ressources statiques
└── environments/     # Configuration des environnements
```

## 🔧 Configuration

### Variables d'Environnement

`src/environments/environment.ts` :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

`src/environments/environment.prod.ts` :
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://moviebooker-api.onrender.com'
};
```

## 📚 Commandes Angular CLI

```bash
# Générer un nouveau composant
ng generate component nom-composant

# Générer un service
ng generate service nom-service

# Générer un guard
ng generate guard nom-guard

# Générer une interface
ng generate interface nom-interface
```

## 🎨 Style et Design

- Utilisation de SCSS pour les styles
- Design responsive
- Thème personnalisable
- Composants Material Design

## 📦 Dépendances Principales

- Angular 19
- Angular Material
- RxJS
- JWT Decode

## 🔗 Liens Utiles

- [Documentation Angular](https://angular.dev/)
- [Angular Material](https://material.angular.io/)
- [Documentation API Backend](https://moviebooker-api.onrender.com/documentation)
