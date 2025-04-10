# MovieBooker API

API backend du projet MovieBooker développée avec NestJS.

## 🌐 URL de Production

- API : [https://moviebooker-api.onrender.com/](https://moviebooker-api.onrender.com/)
- Documentation Swagger : [https://moviebooker-api.onrender.com/documentation](https://moviebooker-api.onrender.com/documentation)

## 🚀 Installation et Démarrage

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run start:dev

# Démarrage en mode production
npm run start:prod

# Exécution des tests
npm run test
```

## 📡 Routes API

### 🔐 Authentification
- `POST /auth/login` - Connexion utilisateur
- `POST /auth/register` - Inscription utilisateur
- `GET /auth/profile` - Obtenir le profil de l'utilisateur connecté

### 🎬 Films
- `GET /movies` - Liste des films
- `GET /movies/:id` - Détails d'un film
- `POST /movies` - Ajouter un film (Admin)
- `PUT /movies/:id` - Modifier un film (Admin)
- `DELETE /movies/:id` - Supprimer un film (Admin)

### 🎟️ Séances
- `GET /screenings` - Liste des séances
- `GET /screenings/:id` - Détails d'une séance
- `POST /screenings` - Créer une séance (Admin)
- `PUT /screenings/:id` - Modifier une séance (Admin)
- `DELETE /screenings/:id` - Supprimer une séance (Admin)

### 🎫 Réservations
- `GET /bookings` - Liste des réservations de l'utilisateur
- `GET /bookings/:id` - Détails d'une réservation
- `POST /bookings` - Créer une réservation
- `DELETE /bookings/:id` - Annuler une réservation

### 🏢 Salles
- `GET /rooms` - Liste des salles
- `GET /rooms/:id` - Détails d'une salle
- `POST /rooms` - Ajouter une salle (Admin)
- `PUT /rooms/:id` - Modifier une salle (Admin)
- `DELETE /rooms/:id` - Supprimer une salle (Admin)

## 🔒 Sécurité

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Pour les routes protégées, incluez le token dans le header :
```
Authorization: Bearer <votre_token>
```

## 🛠 Technologies Utilisées

- NestJS
- TypeORM
- PostgreSQL
- Swagger/OpenAPI
- JWT
- Class Validator

## 📝 Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```env
DATABASE_URL=postgresql://user:password@localhost:5432/moviebooker
JWT_SECRET=votre_secret_jwt
NODE_ENV=development
```
