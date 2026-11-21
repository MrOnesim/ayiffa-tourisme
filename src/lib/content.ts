export const site = {
  name: "AYIFFA TOURISME",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.ayiffatourisme.com",
  email: "contact@ayiffatourisme.com",
  phone: "+229 01 67 04 54 07",
  phoneHref: "+2290167045407",
  whatsapp: "https://wa.me/2290167045407?text=Bonjour%20AYIFFA%20TOURISME%2C%20je%20souhaite%20organiser%20un%20voyage%20au%20B%C3%A9nin.",
  address: "Ouidah, Atlantique, Bénin",
  defaultDestination: "Ouidah",
};

export type Destination = {
  slug: string; name: string; region: string; category: string; image: string;
  imageAlt: string; tagline: string; intro: string; highlights: string[]; story: string;
  imageNote?: string;
};

export const destinations: Destination[] = [
  {
    slug: "ouidah", name: "Ouidah", region: "Atlantique", category: "Culture & patrimoine", image: "/images/ville ouidah vu du ciel.jpeg",
    imageAlt: "Vue aérienne des cases et de la végétation à Ouidah, au Bénin",
    tagline: "Là où l’histoire rencontre l’âme du Bénin.",
    intro: "Ville de mémoire et de cultures vivantes, Ouidah invite à prendre le temps. Ses lieux historiques, ses traditions et son littoral se découvrent autrement avec un guide.",
    highlights: ["La Route des Esclaves et la Porte du Non-Retour", "Le patrimoine culturel et les traditions vodoun", "La Fondation Zinsou et la création artistique", "Les paysages de la lagune de Ouidah"],
    story: "Marcher à Ouidah, c’est traverser plusieurs histoires. Celle de la traite atlantique, à aborder avec respect. Celle d’une ville profondément attachée à ses traditions. Et celle d’un Bénin contemporain, ouvert à la création. AYIFFA TOURISME, basée à Ouidah, vous accompagne dans cette découverte."
  },
  {
    slug: "ganvie", name: "Ganvié", region: "Lac Nokoué", category: "Au fil de l’eau", image: "/images/ganvie vu du ciel.jpeg",
    imageAlt: "Une pirogue sur le lac Nokoué, près de Ganvié, photographiée par Kenza Loussouarn",
    tagline: "Une autre vie, au fil de l’eau.",
    intro: "Sur le lac Nokoué, les pirogues dessinent les chemins du quotidien. Ganvié se découvre au rythme de l’eau, de ses maisons sur pilotis et de ses habitants.",
    highlights: ["Une découverte de la cité lacustre en pirogue", "Les maisons sur pilotis", "Les paysages et les activités du lac Nokoué", "La découverte de la vie locale avec un guide"],
    story: "Ici, l’eau relie les maisons, les familles et les histoires. Une visite de Ganvié est une invitation à observer, à écouter et à comprendre une manière singulière d’habiter le lac. Le parcours se prépare avec votre guide, dans le respect des habitants et de leur intimité."
  },
  {
    slug: "grand-popo", name: "Grand-Popo", region: "Mono", category: "Évasion & nature", image: "/images/deux voi vu du ciel.jpeg",
    imageAlt: "Le littoral de Grand-Popo, entre plage, océan Atlantique et cocotiers",
    tagline: "L’océan pour horizon, la douceur pour rythme.",
    intro: "Entre le fleuve Mono, les lagunes et l’océan Atlantique, Grand-Popo dévoile un Bénin ouvert sur l’horizon. Une invitation à ralentir et à regarder autrement.",
    highlights: ["La Bouche du Roy", "Les paysages du fleuve Mono", "Les villages et les traditions du littoral", "Les plages bordées de cocotiers"],
    story: "À Grand-Popo, le voyage se fait plus lent. La lumière change sur les lagunes, les cocotiers accompagnent le rivage et le fleuve rejoint l’océan. Composez une étape entre découverte des paysages, rencontre avec la vie locale et moments de contemplation. La baignade dépend des conditions locales et des consignes de sécurité."
  },
  {
    slug: "lac-aheme", name: "Lac Ahémé", region: "Sud du Bénin", category: "Au fil de l’eau", image: "/images/lagoon.jpg",
    imageAlt: "Paysage lagunaire du sud du Bénin, photographié à Grand-Popo",
    imageNote: "Photographie d’ambiance : lagune de Grand-Popo, sud du Bénin.",
    tagline: "Au plus près de la nature et des rencontres.",
    intro: "Autour du lac Ahémé et de Gogotinkpon, les paysages d’eau et les savoir-faire locaux donnent au voyage une dimension plus intime.",
    highlights: ["L’immersion écologique à Gogotinkpon", "Une découverte de la mangrove en pirogue", "Les savoir-faire et les saveurs locales", "Les rencontres avec les communautés riveraines"],
    story: "L’agence propose une immersion à Gogotinkpon associant découverte en pirogue, mangrove et traditions locales. Le contenu précis, les conditions de navigation et les activités disponibles sont confirmés avec l’équipe avant le départ."
  },
  {
    slug: "adjarra", name: "Adjarra", region: "Ouémé", category: "Évasion & nature", image: "/images/pirogue.jpg",
    imageAlt: "Pirogue dans la végétation du lac Nokoué au Bénin",
    imageNote: "Photographie d’ambiance : lac Nokoué, Bénin.",
    tagline: "Une parenthèse entre eau, ombre et artisanat.",
    intro: "La rivière noire d’Adjarra fait partie des découvertes présentées par AYIFFA TOURISME. Un autre regard sur le sud du Bénin, entre paysages et culture.",
    highlights: ["La rivière noire d’Adjarra", "La découverte de l’artisanat local", "Le patrimoine de la région de l’Ouémé", "Une visite accompagnée à personnaliser"],
    story: "Les voies d’eau, les ateliers et les traditions composent une découverte complémentaire de celle du littoral. Votre programme sera préparé avec l’agence en fonction de vos envies et de l’accessibilité des sites."
  },
  {
    slug: "save", name: "Les collines de Savè", region: "Collines", category: "Évasion & nature", image: "/images/benin-road.jpg",
    imageAlt: "Une route et la végétation de la région de Dassa au Bénin",
    imageNote: "Photographie d’ambiance : région de Dassa, département des Collines.",
    tagline: "Prendre de la hauteur, changer de perspective.",
    intro: "Les reliefs de Savè ouvrent une autre page du voyage béninois. L’agence les présente parmi les sites à découvrir au-delà du littoral.",
    highlights: ["Les paysages des mamelles de Savè", "Une découverte de la région des Collines", "Les récits et le patrimoine local", "Un itinéraire adapté à votre rythme"],
    story: "En quittant la côte, les paysages changent et le voyage prend un nouveau souffle. Les modalités de visite, le niveau de marche et les conditions d’accès sont à vérifier avec l’équipe avant d’intégrer cette étape à votre séjour."
  }
];

export type Circuit = {
  slug: string; name: string; subtitle: string; location: string; duration: string; days: number;
  category: string; image: string; alt: string; description: string; highlights: string[];
  note: string; steps: {title: string; text: string}[];
};
export const circuits: Circuit[] = [
  {
    slug: "route-des-esclaves", name: "Ouidah, sur les chemins de mémoire", subtitle: "Un voyage dans l’histoire", location: "Ouidah", duration: "1 journée", days: 1,
    category: "Culture & patrimoine", image: "/images/ouidah vu du ciel 1.jpeg", alt: "Patrimoine et paysages de Ouidah au Bénin",
    description: "Une visite guidée pour comprendre l’histoire de la traite atlantique et découvrir les lieux de mémoire de Ouidah. Un parcours sensible, accompagné par les récits de votre guide.",
    highlights: ["La Route des Esclaves", "La Porte du Non-Retour", "Une visite accompagnée", "Un parcours à votre rythme"],
    note: "La durée d’une journée est indiquée sur le site de l’agence. Le parcours, les horaires et les prestations incluses sont à confirmer dans votre devis.",
    steps: [{title: "Échanger avec votre guide", text: "Le point de rendez-vous et l’organisation sont définis avec l’agence avant votre venue."}, {title: "Comprendre les lieux de mémoire", text: "Une découverte accompagnée de la Route des Esclaves, nourrie par le contexte historique de Ouidah."}, {title: "Prendre le temps de la découverte", text: "Un parcours ajusté à votre rythme. Les éventuelles visites complémentaires sont précisées dans votre proposition."}]
  },
  {
    slug: "gogotinkpon", name: "Gogotinkpon, l’échappée nature", subtitle: "L’essentiel est dans la rencontre", location: "Lac Ahémé", duration: "1 journée", days: 1,
    category: "Nature & rencontres", image: "/images/lagoon.jpg", alt: "Paysage lagunaire du sud du Bénin, photographie d’ambiance",
    description: "Une immersion écologique entre pirogue, mangrove et découvertes locales. Une journée pour renouer avec les choses simples, au plus près des paysages d’eau du sud du Bénin.",
    highlights: ["La découverte en pirogue", "La mangrove locale", "Les saveurs béninoises", "Les échanges avec les habitants"],
    note: "L’agence présente une excursion d’une journée et un parcours en pirogue d’environ une heure. Activités, disponibilité et inclusions à confirmer. Photographie d’ambiance prise à Grand-Popo.",
    steps: [{title: "Rejoindre Gogotinkpon", text: "Le transport et le lieu de départ sont définis dans votre devis personnalisé."}, {title: "Explorer la mangrove", text: "Un parcours en pirogue dans les paysages locaux, selon les conditions de navigation."}, {title: "Découvrir les savoir-faire locaux", text: "La présentation de l’agence évoque des rencontres et des dégustations. Leur organisation est confirmée avant le voyage."}]
  },
  {
    slug: "benin-huit-jours", name: "Circuit de 8 jours", subtitle: "Le Bénin, tout simplement", location: "Bénin", duration: "8 jours", days: 8,
    category: "Voyage sur mesure", image: "/images/GANVIE.jpeg", alt: "Maisons sur pilotis et pirogues au large de Ganvié",
    description: "Un format de huit jours présenté par l’agence, à composer autour de vos envies. Culture, paysages d’eau et rencontres : donnez à votre première découverte du Bénin votre propre couleur.",
    highlights: ["Un séjour personnalisable", "Un rythme défini ensemble", "Une découverte en couple, en famille ou entre amis", "Un devis détaillé avant toute confirmation"],
    note: "Le format de 8 jours figure sur le site existant. L’itinéraire détaillé, les hébergements, les repas et les transports ne sont pas encore confirmés et feront l’objet d’une proposition personnalisée.",
    steps: [{title: "Vos envies, notre point de départ", text: "Partagez vos centres d’intérêt, vos dates et votre rythme idéal."}, {title: "Un itinéraire préparé ensemble", text: "L’équipe propose les étapes et vérifie leur faisabilité pour la période choisie."}, {title: "Une proposition transparente", text: "Le programme et toutes les prestations sont détaillés dans le devis à valider avant le départ."}]
  },
  {
    slug: "benin-dix-jours", name: "Circuit de 10 jours", subtitle: "Le Bénin en grand", location: "Bénin", duration: "10 jours", days: 10,
    category: "Voyage sur mesure", image: "/images/benin-road.jpg", alt: "Route à travers les paysages de Dassa au Bénin",
    description: "Le site de l’agence présente un circuit de dix jours, du nord au sud. Ce format est une base de discussion pour imaginer un séjour plus long, selon les conditions d’accès et de sécurité au moment du départ.",
    highlights: ["Dix jours à personnaliser", "Des paysages variés", "Des étapes choisies ensemble", "Une faisabilité vérifiée avant le départ"],
    note: "Le titre et la durée sont repris du site existant. Aucun départ vers le nord ou les zones déconseillées n’est garanti. L’itinéraire doit être réévalué selon les recommandations officielles et les conditions locales.",
    steps: [{title: "Imaginer votre voyage", text: "Un échange permet de comprendre votre projet et vos attentes."}, {title: "Vérifier chaque étape", text: "L’agence examine l’accès aux sites, la sécurité et les prestations disponibles avant toute proposition."}, {title: "Valider un programme sur mesure", text: "Votre devis décrit uniquement les étapes et les prestations confirmées."}]
  },
  {
    slug: "benin-douze-jours", name: "Circuit de 12 jours", subtitle: "Du littoral aux collines, à votre rythme", location: "Bénin", duration: "12 jours", days: 12,
    category: "Voyage sur mesure", image: "/images/culture.jpg", alt: "Cérémonie traditionnelle à Abomey-Calavi au Bénin",
    description: "Un format de douze jours à composer avec l’agence : mémoire de Ouidah, paysages d’eau, rencontres et reliefs du sud selon les conditions du moment. Une proposition sur mesure, sans étape imposée.",
    highlights: ["Un itinéraire entièrement personnalisé", "Des étapes du sud aux collines", "Rencontres et paysages", "Faisabilité vérifiée avant le départ"],
    note: "Ce format est une base de discussion, pas un programme confirmé. Les étapes, les hébergements, les transports et les accès sont à valider selon les recommandations officielles et les conditions locales.",
    steps: [{title: "Définir vos priorités", text: "Partagez vos envies, vos dates et le rythme que vous souhaitez."}, {title: "Composer les étapes", text: "L’équipe propose un enchaînement cohérent et vérifie l’accès à chaque site."}, {title: "Valider le programme", text: "Le devis précise uniquement les services et les étapes confirmés avant le départ."}]
  },
  {
    slug: "benin-quinze-jours", name: "Circuit de 15 jours", subtitle: "Une immersion longue, sans se presser", location: "Bénin", duration: "15 jours", days: 15,
    category: "Voyage sur mesure", image: "/images/benin-road.jpg", alt: "Route à travers les paysages de Dassa au Bénin",
    description: "Quinze jours pour parcourir le Bénin autrement, du littoral aux paysages intérieurs. Ce format laisse le temps aux rencontres et aux pauses, à construire avec l’agence selon vos envies.",
    highlights: ["Un séjour long et personnalisable", "Du littoral aux paysages intérieurs", "Du temps pour les rencontres", "Un devis avant toute confirmation"],
    note: "La durée de quinze jours est proposée comme format de discussion. L’itinéraire, les hébergements et les déplacements dépendent des conditions d’accès, de sécurité et de disponibilité au moment du voyage.",
    steps: [{title: "Esquisser le voyage", text: "Nous partons de vos centres d’intérêt et de la durée souhaitée."}, {title: "Construire l’itinéraire", text: "Les étapes sont choisies ensemble, avec une vérification de leur faisabilité."}, {title: "Confirmer les détails", text: "Hébergements, transports et activités sont précisés dans le devis final."}]
  }
];

export const experiences = [
  {number:"01", title:"Rencontrer une culture vivante", category:"CULTURE & PATRIMOINE", text:"Écouter les histoires de Ouidah, découvrir ses traditions et regarder le Bénin avec un autre regard.", image:"/images/culture.jpg", alt:"Cérémonie traditionnelle à Abomey-Calavi au Bénin", href:"/destinations/ouidah"},
  {number:"02", title:"Suivre le rythme de l’eau", category:"PIROGUES & LAGUNES", text:"Glisser sur les eaux du lac Nokoué et découvrir les paysages lagunaires du sud du Bénin.", image:"/images/pirogue.jpg", alt:"Une femme naviguant en pirogue à Ganvié", href:"/destinations/ganvie"},
  {number:"03", title:"S’offrir le luxe de ralentir", category:"NATURE & ÉVASION", text:"Une lumière, un horizon, le souffle de l’Atlantique. Redécouvrir le plaisir de prendre son temps.", image:"/images/grand-popo.jpg", alt:"Le littoral et les palmiers de Grand-Popo", href:"/destinations/grand-popo"}
];

export const faqs = [
  {question:"Puis-je personnaliser mon voyage ?", answer:"Oui. Le site d’AYIFFA TOURISME présente des séjours personnalisables et privatisables, en couple, en famille ou entre amis. Partagez vos envies avec l’équipe pour recevoir un programme et un devis adaptés."},
  {question:"Les prix et les départs sont-ils garantis ?", answer:"Non. Les tarifs, disponibilités, inclusions et conditions d’annulation sont confirmés par l’agence dans un devis. Une demande sur ce site ne constitue pas une réservation ni un paiement."},
  {question:"Quelle est la meilleure période pour venir ?", answer:"Cela dépend de vos étapes et des activités envisagées. Nous préférons vous orienter en fonction de vos dates et des conditions locales, plutôt que d’afficher une période générique non vérifiée."},
  {question:"Comment préparer mon séjour au Bénin ?", answer:"Avant de partir, vérifiez les formalités d’entrée et les recommandations sanitaires et de sécurité auprès des autorités officielles. L’équipe peut échanger avec vous sur l’organisation locale de votre séjour."},
  {question:"Comment contacter directement l’agence ?", answer:"Vous pouvez écrire à contact@ayiffatourisme.com ou utiliser le bouton de contact WhatsApp. Le numéro public historique a été adapté au nouveau format béninois à dix chiffres ; l’activation de WhatsApp reste à confirmer avec l’agence."}
];
