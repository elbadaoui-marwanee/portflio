# Portfolio de Marwane El Badaoui

Portfolio personnel de **Marwane El Badaoui**, étudiant à l’École Supérieure de Technologie de Safi en développement informatique et réseaux. Il présente ses projets web, son intérêt pour les systèmes et la sécurité des réseaux, ainsi que son parcours.

## Informations personnelles

- **Localisation :** Safi, Maroc
- **Domaine :** développement web, systèmes et sécurité des réseaux
- **E-mail :** [elbadaouimarwanee@gmail.com](mailto:elbadaouimarwanee@gmail.com)
- **LinkedIn :** [marwane-el-badaoui-5878ab3b2](https://www.linkedin.com/in/marwane-el-badaoui-5878ab3b2)
- **CV :** [télécharger le PDF](assets/CV-Marwane-El-Badaoui.pdf)
- **GitHub :** renseigner l’adresse et le nom du compte dans `portfolio-data.js` avant la publication (valeur actuelle : `[GITHUB]`)

## Publier sur GitHub Pages

Le site est préparé pour GitHub Pages, qui héberge des fichiers statiques. Le workflow `.github/workflows/deploy-pages.yml` construit automatiquement le site et le publie après chaque push sur `main` ou `master`. Il ne copie que les pages HTML, les fichiers CSS/JavaScript et les ressources nécessaires : les scripts PHP et les données de commandes ne sont pas publiés.

1. Personnalisez les coordonnées dans `portfolio-data.js`, notamment `profile.github` et `profile.githubLabel`.
2. Ajoutez ces fichiers à un dépôt GitHub et poussez-les sur `main` ou `master`.
3. Dans le dépôt, ouvrez **Settings → Pages** et choisissez **GitHub Actions** comme source de publication.
4. Consultez l’onglet **Actions** pour vérifier le déploiement, puis ouvrez l’URL affichée dans **Settings → Pages**.

Le formulaire de contact ouvre l’application de messagerie du visiteur ; il ne transmet pas les messages à un serveur. Les pages PHP `commande.php` et `suivi-commandes.php` ne fonctionnent pas sur GitHub Pages. Pour traiter des commandes en ligne, il faut héberger ces scripts sur un serveur compatible PHP et les connecter à un service adapté.

## Voir combien de personnes visitent le portfolio

Le suivi est prêt pour **GitHub Pages**, avec [GoatCounter](https://www.goatcounter.com/). Aucun serveur PHP, mot de passe ou jeton API n’est nécessaire dans le dépôt. Les statistiques commencent après activation ; les anciennes visites ne sont pas récupérables.

1. Créez votre compte sur [goatcounter.com/signup](https://www.goatcounter.com/signup). Choisissez un **Account name**, par exemple `marwane-portfolio` s’il est disponible. Le champ **Site domain** peut contenir votre URL GitHub Pages ; il est facultatif.
2. Dans `analytics-config.js`, remplacez la chaîne vide par **votre vrai Account name** :

   ```js
   window.PORTFOLIO_ANALYTICS = {
     goatcounterCode: 'marwane-portfolio'
   };
   ```

3. Poussez les modifications sur GitHub et attendez la fin du déploiement Pages.
4. Ouvrez votre site publié, puis connectez-vous à `https://VOTRE-ACCOUNT-NAME.goatcounter.com` pour consulter les visites par période, pages, pays et sources. Gardez le tableau de bord privé dans les réglages de GoatCounter.

Un raccourci **Mes statistiques** apparaît en bas du portfolio en ajoutant `?admin=1` à son URL (exemple : `https://votre-compte.github.io/portfolio/?admin=1`). Ce paramètre affiche uniquement le lien ; l’accès aux données dépend de la connexion à votre compte GoatCounter. Cette vue et les aperçus `localhost` ne sont pas comptés.

Les deux pages `index.html` et `cv.html` sont suivies. Les clics de téléchargement du PDF et d’impression du CV apparaissent comme événements. `/portfolio/` et `/portfolio/index.html` sont regroupés ; les paramètres de l’URL sont exclus. Un compte non renseigné laisse le suivi désactivé sans requête externe.

Le nombre de visiteurs est une estimation : les bloqueurs, JavaScript désactivé et le filtrage des robots peuvent réduire le total. GoatCounter distingue les visites des rechargements d’une même page ; voir [Sessions and visitors](https://www.goatcounter.com/help/sessions). Pour vérifier l’installation, utilisez le site publié avec le bloqueur désactivé et attendez quelques secondes ([guide officiel](https://www.goatcounter.com/help/start)).

## Projets présentés

| Projet | Description | Technologies |
| --- | --- | --- |
| **Exam Planner** | Application de gestion des examens et des modules, avec tableau de bord, plan de révision et export PDF. | PHP, MySQL, JavaScript, HTML5, CSS3 |
| **AGRI ABED** | Boutique agricole réalisée en stage : catalogue, panier, commandes, stocks, espace client, administration et assistant produit. | PHP, MySQL, JavaScript, Python |
| **Laboratoire réseau CCNA** | Mise en pratique de l’adressage IPv4/IPv6, de la commutation, de la configuration Cisco IOS et des tests de connectivité. | Cisco IOS, IPv4/IPv6, Ethernet, switching, subnetting |

## Compétences

- **Développement :** HTML5, CSS3, JavaScript, PHP, Python et C.
- **Données et conception :** MySQL, phpMyAdmin, SGBD, Merise et PowerAMC.
- **Réseaux :** IPv4/IPv6, subnetting, Ethernet, switching, services IP et Cisco IOS.
- **Outils et méthodes :** VS Code, responsive design, modélisation et assembleur x86.
- **Badge :** [CCNA: Introduction to Networks sur Credly](https://www.credly.com/badges/1ec39e1d-0259-4159-a6c9-a58fec219bc5/linked_in_profile).

## Cours et modules

La page d’accueil regroupe les cours d’algorithmique, de programmation, d’analyse des systèmes d’information, d’architecture, de développement web, de réseaux, de systèmes d’exploitation, d’algèbre, d’UML et de cryptographie par semestre. Elle présente aussi les apprentissages en cours : OSINT avancé, pentesting web, analyse réseau et Java POO.

## Parcours

- **2024–2025 :** baccalauréat en sciences physiques, option français, mention Bien.
- **Depuis le 1er octobre 2025 :** formation à l’École Supérieure de Technologie de Safi en développement informatique et réseaux.
- **7 juin 2026 :** projet académique Exam Planner.
- **11 juin 2026 :** badge Cisco *CCNA: Introduction to Networks*.
- **1er au 31 août 2026 :** stage chez AGRI ABED, avec développement d’une boutique agricole.

## Organisation du site

- `index.html` : page du portfolio (accueil, à propos, projets, modules en cours, compétences, parcours et contact).
- `portfolio-data.js` : informations du profil et détails des projets à personnaliser.
- `script.js` et `styles.css` : interactions et styles du portfolio.
- `analytics-config.js` et `analytics.js` : configuration et suivi des visites avec GoatCounter.
- `cv.html` et `assets/CV-Marwane-El-Badaoui.pdf` : versions du CV.
- `assets/` : portrait et visuels des projets.
- `.github/workflows/deploy-pages.yml` : préparation et déploiement du site statique sur GitHub Pages.

Les liens de démonstration locale des projets apparaissent uniquement sur `localhost`. Pour consulter le site avec XAMPP, ouvrir `http://localhost/portfolio/` après avoir démarré Apache.
