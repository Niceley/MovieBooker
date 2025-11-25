# 🐳 Guide Docker - MovieBooker

Ce guide explique comment démarrer le projet MovieBooker avec Docker.

## 📋 Prérequis

- Docker installé ([Installation Docker](https://docs.docker.com/get-docker/))
- Docker Compose installé (généralement inclus avec Docker Desktop)
- Une clé API TMDB ([Obtenir une clé API TMDB](https://www.themoviedb.org/settings/api))

## 🚀 Démarrage Rapide

### 1. Configuration de la clé API TMDB

Éditez le fichier `.env` et remplacez `your_tmdb_api_key_here` par votre vraie clé API TMDB :

```env
TMDB_API_KEY=votre_cle_api_tmdb_ici
```

### 2. Démarrer les services

Lancez tous les services avec Docker Compose :

```bash
docker-compose up -d
```

Cette commande va :
- Démarrer une base de données PostgreSQL
- Construire et démarrer l'API backend (NestJS)
- Construire et démarrer le frontend (Angular avec nginx)

### 3. Accéder à l'application

Une fois les conteneurs démarrés, vous pouvez accéder à :

- **Frontend** : http://localhost:80
- **Backend API** : http://localhost:3000
- **Base de données PostgreSQL** : localhost:5432

## 🛠 Commandes Utiles

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Arrêter les services

```bash
docker-compose down
```

### Arrêter et supprimer les volumes (⚠️ supprime les données de la base)

```bash
docker-compose down -v
```

### Reconstruire les images

```bash
docker-compose build --no-cache
docker-compose up -d
```

### Redémarrer un service spécifique

```bash
docker-compose restart api
docker-compose restart frontend
```

## 📁 Structure des Services

- **postgres** : Base de données PostgreSQL (port 5432)
- **api** : API NestJS (port 3000)
- **frontend** : Application Angular servie par nginx (port 80)

## 🔧 Configuration

### Variables d'environnement

Les variables d'environnement sont définies dans le fichier `.env` et dans `docker-compose.yml`.

Variables principales :
- `TMDB_API_KEY` : Clé API TMDB (obligatoire)
- `JWT_SECRET` : Secret pour JWT (optionnel, valeur par défaut utilisée si non définie)
- `DATABASE_URL` : URL de connexion à la base de données (configurée automatiquement)

### Modifier l'URL de l'API dans le frontend

Si vous modifiez le port de l'API, vous devez mettre à jour l'argument `API_URL` dans le `docker-compose.yml` :

```yaml
frontend:
  build:
    args:
      API_URL: http://localhost:3000  # Modifiez cette URL si nécessaire
```

Puis reconstruisez le frontend :

```bash
docker-compose build frontend
docker-compose up -d frontend
```

## 🐛 Dépannage

### Les migrations Prisma ne s'exécutent pas

Si vous rencontrez des problèmes avec les migrations, vous pouvez les exécuter manuellement :

```bash
docker-compose exec api npx prisma migrate deploy
```

### Réinitialiser la base de données

```bash
docker-compose down -v
docker-compose up -d
```

### Vérifier l'état des services

```bash
docker-compose ps
```

### Accéder au shell d'un conteneur

```bash
# API
docker-compose exec api sh

# Base de données
docker-compose exec postgres psql -U moviebooker -d moviebooker
```

## 📝 Notes

- Les données de la base de données sont persistées dans un volume Docker nommé `postgres_data`
- Le frontend est servi en mode production avec nginx
- Les migrations Prisma s'exécutent automatiquement au démarrage de l'API
- Le frontend est configuré pour se connecter à l'API sur `http://localhost:3000`

