/*
 * Modifiez ce fichier pour personnaliser rapidement le portfolio.
 * Remplacez les valeurs entre crochets par vos vraies informations.
 */
window.PORTFOLIO_DATA = {
  profile: {
    name: 'Marwane El Badaoui',
    role: 'Étudiant en systèmes et sécurité des réseaux',
    shortRole: 'Systèmes & sécurité réseau',
    intro: 'Étudiant à l’EST Safi, je conçois des applications web et approfondis les systèmes et la sécurité des réseaux.',
    location: 'Safi, Maroc',
    email: 'elbadaouimarwanee@gmail.com',
    github: '[GITHUB]',
    githubLabel: '[GITHUB]',
    linkedin: 'https://www.linkedin.com/in/marwane-el-badaoui-5878ab3b2',
    linkedinLabel: 'marwane-el-badaoui-5878ab3b2',
    photo: 'assets/photo linkden.png',
    cv: 'assets/CV-Marwane-El-Badaoui.pdf'
  },
  projects: {
    'exam-planner': {
      title: 'Exam Planner',
      images: [
        { src: 'assets/exam-planner-modules.jpg', alt: 'Gestion des modules dans Exam Planner' },
        { src: 'assets/exam-planner-dashboard.jpg', alt: 'Tableau de bord et progression dans Exam Planner' },
        { src: 'assets/exam-planner-login.jpg', alt: 'Page de connexion à Exam Planner' }
      ],
      intro: 'Application web de gestion des examens, des modules et des sessions de révision.',
      problem: 'Les étudiants doivent souvent répartir manuellement leurs révisions entre plusieurs modules, sans vue globale sur les priorités et la progression.',
      solution: 'Une interface centralisée qui regroupe les examens, calcule les priorités et construit un plan de révision facile à suivre.',
      features: ['Authentification et espace personnel', 'Gestion des modules et des examens', 'Tableau de bord avec indicateurs', 'Génération du plan de révision', 'Export imprimable et PDF'],
      technologies: ['PHP', 'MySQL', 'JavaScript', 'HTML5', 'CSS3']
    },
    'agri-abed': {
      title: 'AGRI ABED',
      intro: 'Boutique agricole complète réalisée pendant mon stage.',
      problem: 'Les produits, les stocks, les commandes et les demandes clients avaient besoin d’un espace numérique commun et simple à administrer.',
      solution: 'Une plateforme e-commerce métier avec catalogue, parcours de commande, espace client, administration et aide au choix des produits.',
      features: ['Catalogue et fiches produits', 'Panier et commande rapide', 'Gestion des stocks et commandes', 'Espace client et support', 'Assistant agricole et recommandations'],
      technologies: ['PHP', 'MySQL', 'JavaScript', 'Python', 'Responsive Design']
    },
    'ccna-lab': {
      title: 'Laboratoire réseau CCNA',
      intro: 'Mise en pratique des compétences acquises dans CCNA: Introduction to Networks.',
      problem: 'Concevoir un réseau local cohérent, attribuer les adresses et vérifier la communication entre les équipements.',
      solution: 'Une topologie documentée avec configuration des interfaces, commutation, adressage IPv4/IPv6 et commandes de diagnostic.',
      features: ['Plan d’adressage IPv4/IPv6', 'Configuration des interfaces', 'Commutation Ethernet', 'Vérification de la table de routage', 'Tests ping et traceroute'],
      technologies: ['Cisco IOS', 'IPv4 / IPv6', 'Ethernet', 'Switching', 'IP Subnetting']
    }
  }
};
