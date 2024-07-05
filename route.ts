/**
 * Un tableau des routes accessibles par tout le monde et qui ne nécessitent pas de connexion
 * @type {string[]}
 */

export const publicRoutes = [
  "/",
  "/events",
  "/events/[id]",
  "/devenir-organisateur",
  "/auth/new-verification",
];

/**
 * Un tableau des routes utilisées pour l'authentification.
 * Ces routes ... (à compléter)
 * @type {string[]}
 */

export const authRoutes = [
  "/auth/connexion",
  "/auth/inscription",
  "/auth/inscription/org",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

export const organizerRoutes = ["/events/create"];

/**
 * Le préfix pour les routes API utilisées pour l'authentification.
 * Les routes qui commencent par ce préfixe sont utilisées pour l'authentification.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Le chemin par défaut pour rediriger l'utilisateur après la connexion.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
