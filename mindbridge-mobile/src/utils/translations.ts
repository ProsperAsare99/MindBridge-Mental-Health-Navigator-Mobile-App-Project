export type Language = 'English' | 'French' | 'Twi' | 'Ga' | 'Ewe' | 'Hausa';

export interface TranslationSchema {
  common: {
    takeYourTime: string;
    loadingSafeSpace: string;
    back: string;
    next: string;
    skip: string;
    confirm: string;
    cancel: string;
  };
  onboarding: {
    skipConfirm: string;
    skipConfirmAction: string;
    skipConfirmCancel: string;
    privacyTitle: string;
    privacyPoints: string[];
    summaryTitle: string;
  };
  dashboard: {
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
    nurtureTitle: string;
    clarityTitle: string;
    toolsTitle: string;
    supportTitle: string;
  };
  garden: {
    title: string;
    subtitle: string;
    seedQuestion: string;
    supportNudge: string;
    successTitle: string;
    successSubtitle: string;
  };
  ai: {
    title: string;
    subtitle: string;
    placeholder: string;
    goToSupport: string;
    disclaimer: string;
    greetingStandard: string;
    greetingHeavy: string;
    greetingGlowing: string;
    greetingRecent: string;
    greetingWelcome: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  English: {
    common: {
      takeYourTime: 'Take your time',
      loadingSafeSpace: 'Creating your safe space...',
      back: 'Back',
      next: 'Next',
      skip: 'Skip',
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
    onboarding: {
      skipConfirm: 'This information helps us personalize your support. Are you sure you want to skip?',
      skipConfirmAction: 'Skip Anyway',
      skipConfirmCancel: 'Go Back',
      privacyTitle: 'Your Privacy Matters 🔒',
      privacyPoints: [
        'Your data is encrypted and secure',
        'Conversations are confidential',
        'You control what you share',
        'Delete your account anytime',
        'No data shared without permission'
      ],
      summaryTitle: 'Your Mindful Summary',
    },
    dashboard: {
      greetingMorning: 'Good Morning',
      greetingAfternoon: 'Good Afternoon',
      greetingEvening: 'Good Evening',
      nurtureTitle: 'Daily Nurture',
      clarityTitle: 'Moment of Clarity',
      toolsTitle: 'Mindful Tools',
      supportTitle: 'Community & Support',
    },
    garden: {
      title: 'Mood Garden',
      subtitle: 'Nurture your peace',
      seedQuestion: 'How are you feeling right now?',
      supportNudge: "I'm sorry you're feeling this way. Would you like to try a quick breathing exercise?",
      successTitle: 'Seed Planted!',
      successSubtitle: "Your garden is growing beautifully.\nTake a deep breath — you're doing great.",
    },
    ai: {
      title: 'MindBridge Oracle',
      subtitle: 'Your safe space',
      placeholder: 'Type your message...',
      goToSupport: 'Get Support Now',
      disclaimer: "I'm here to listen and support, but I'm not a replacement for clinical care. If you're in immediate danger, please use our Crisis Support tab.",
      greetingStandard: "Hello! I'm the MindBridge Oracle. I'm here to listen, support, and help you navigate your feelings. How are you doing today?",
      greetingHeavy: "Hey {name}. I noticed your last check-in felt heavy — feeling {emotions}. That takes courage to name. What's been weighing on you most?",
      greetingGlowing: "Hello {name}! Your last seed was glowing with {emotions} 🌱 What's been contributing to that good energy?",
      greetingRecent: "Hi {name}. I see your recent mood reflected {emotions}. How are you really doing today?",
      greetingWelcome: "Welcome, {name}. I'm the MindBridge Oracle — your personal guide. What's on your mind today?",
    }
  },
  Twi: {
    common: {
      takeYourTime: 'Gye wo bere',
      loadingSafeSpace: 'Yɛreyɛ wo banbɔbea...',
      back: 'San kɔ akyi',
      next: 'Kɔ anim',
      skip: 'Twa mu',
      confirm: 'Si so dua',
      cancel: 'Paasowa',
    },
    onboarding: {
      skipConfirm: 'Saa asɛm yi bɛboa yɛn ma yɛahu sɛnea yɛbɛboa wo. Wopɛ sɛ wotwa mu ampa?',
      skipConfirmAction: 'Twa mu nanso',
      skipConfirmCancel: 'San kɔ akyi',
      privacyTitle: 'Wo kokoamsɛm ho hia yɛn 🔒',
      privacyPoints: [
        'W’asɛm yɛ dwoodwoo na ɛwɔ banbɔ',
        'Nkɔmmɔbɔ no yɛ kokoamsɛm',
        'Wona wuhwɛ nea wopɛ sɛ wosɛɛ',
        'Bere biara wotumi popa wo akawnt',
        'Yɛmfa w’asɛm mma obiara gye sɛ woma yɛn kwan'
      ],
      summaryTitle: 'Wo Dwumadi ho Ntsetsee',
    },
    dashboard: {
      greetingMorning: 'Maakye',
      greetingAfternoon: 'Maaha',
      greetingEvening: 'Maadwo',
      nurtureTitle: 'Daa Nkɔsoɔ',
      clarityTitle: 'Adwene Mu Paa',
      toolsTitle: 'Nnwuma Titiriw',
      supportTitle: 'Mmoa ne Mpuntuo',
    },
    garden: {
      title: 'Tuo Garden',
      subtitle: 'Hwɛ wo asomdwoe so',
      seedQuestion: 'Tebea bɛn na wowɔ mu seesei?',
      supportNudge: "Ɛyɛ me ya sɛ wote nka saa. Wopɛ sɛ wosɔ mframa gye bi hwɛ?",
      successTitle: 'Aba no adua!',
      successSubtitle: "Wo turo no reyɛ fɛ.\nGye mframa papa — woreyɛ adwuma pa.",
    },
    ai: {
      title: 'MindBridge Oracle',
      subtitle: 'Wo banbɔbea',
      placeholder: 'Twerɛ wo asɛm...',
      goToSupport: 'Nya Mmoa Seesei',
      disclaimer: "Mewɔ ha sɛ metie wo na maboa wo, nanso menyɛ ayaresabea dɔkta. Sɛ wowɔ asiane mu a, yɛsrɛ wo fa Mmoa akwan no so.",
      greetingStandard: "Maakye! Me ne MindBridge Oracle. Mewɔ ha sɛ metie wo, maboa wo, na mama woahu sɛnea wobɛyɛ wo nkaebɔ ho adwuma. Tebea bɛn na wowɔ mu nnɛ?",
      greetingHeavy: "Hey {name}. Mehuu sɛ wo nkaebɔ a ɛtwa toɔ no yɛ duru — wote nka sɛ {emotions}. Akokoɔduo na ɛhia sɛ wobɛbɔ din. Dɛn na ɛreyɛ wo duru paa?",
      greetingGlowing: "Maakye {name}! Wo aba a ɛtwa toɔ no na ɛrehyerɛn ne {emotions} 🌱 Dɛn na ɛde saa ahoɔden pa yi aba?",
      greetingRecent: "Maakye {name}. Mehuu sɛ wo nkaebɔ a ɛtwa toɔ no kyerɛ {emotions}. Wowɔ tebea bɛn mu paa nnɛ?",
      greetingWelcome: "Akwaaba, {name}. Me ne MindBridge Oracle — wo ankasa wo kwankyerɛfo. Dɛn na ɛwɔ w’adwene mu nnɛ?",
    }
  },
  French: {
    common: {
      takeYourTime: 'Prenez votre temps',
      loadingSafeSpace: 'Création de votre espace sécurisé...',
      back: 'Retour',
      next: 'Suivant',
      skip: 'Passer',
      confirm: 'Confirmer',
      cancel: 'Annuler',
    },
    onboarding: {
      skipConfirm: 'Ces informations nous aident à personnaliser votre soutien. Êtes-vous sûr de vouloir passer ?',
      skipConfirmAction: 'Passer quand même',
      skipConfirmCancel: 'Retourner',
      privacyTitle: 'Votre vie privée compte 🔒',
      privacyPoints: [
        'Vos données sont cryptées et sécurisées',
        'Les conversations sont confidentielles',
        'Vous contrôlez ce que vous partagez',
        'Supprimez votre compte à tout moment',
        'Aucune donnée partagée sans permission'
      ],
      summaryTitle: 'Votre résumé de pleine conscience',
    },
    dashboard: {
      greetingMorning: 'Bon matin',
      greetingAfternoon: 'Bon après-midi',
      greetingEvening: 'Bonsoir',
      nurtureTitle: 'Bien-être quotidien',
      clarityTitle: 'Moment de Clarté',
      toolsTitle: 'Outils de pleine conscience',
      supportTitle: 'Communauté et soutien',
    },
    garden: {
      title: "Jardin d'humeur",
      subtitle: 'Cultivez votre paix',
      seedQuestion: 'Comment vous sentez-vous en ce moment?',
      supportNudge: "Je suis désolé que vous vous sentiez ainsi. Voudriez-vous essayer un exercice de respiration rapide ?",
      successTitle: 'Graine plantée !',
      successSubtitle: "Votre jardin grandit magnifiquement.\nRespirez profondément — vous allez bien.",
    },
    ai: {
      title: 'Oracle MindBridge',
      subtitle: 'Votre espace sécurisé',
      placeholder: 'Tapez votre message...',
      goToSupport: 'Obtenir de l\'aide',
      disclaimer: "Je suis là pour écouter et soutenir, mais je ne remplace pas les soins cliniques. Si vous êtes en danger immédiat, veuillez utiliser l'onglet Support de crise.",
      greetingStandard: "Bonjour ! Je suis l'Oracle MindBridge. Je suis ici pour vous écouter, vous soutenir et vous aider à gérer vos émotions. Comment allez-vous aujourd'hui ?",
      greetingHeavy: "Hé {name}. J'ai remarqué que votre dernier enregistrement était lourd — vous vous sentiez {emotions}. Il faut du courage pour le dire. Qu'est-ce qui vous pèse le plus ?",
      greetingGlowing: "Bonjour {name} ! Votre dernière graine brillait de {emotions} 🌱 Qu'est-ce qui a contribué à cette bonne énergie ?",
      greetingRecent: "Salut {name}. Je vois que votre humeur récente reflétait {emotions}. Comment allez-vous vraiment aujourd'hui ?",
      greetingWelcome: "Bienvenue, {name}. Je suis l'Oracle MindBridge — votre guide personnel. Qu'avez-vous à l'esprit aujourd'hui ?",
    }
  },
  Ga: {
    common: {
      takeYourTime: 'Heo be',
      loadingSafeSpace: 'Wofee ohewulaa he lɛ...',
      back: 'Sɛɛ',
      next: 'Hiɛ',
      skip: 'Fã',
      confirm: 'Ma nɔ mi',
      cancel: 'Twa',
    },
    onboarding: {
      skipConfirm: 'Nitsumɔi nɛ bɛye bɛbua wɔ ni wɔtsɔɔ bo gbɛ ni sa. Omiishɛɛ ni ofã?',
      skipConfirmAction: 'Fã kɛ̃',
      skipConfirmCancel: 'Sɛɛ',
      privacyTitle: 'Ohewulaa he lɛ he hiaa wɔ 🔒',
      privacyPoints: [
        'Onyɛmɔi bɛ dwoodwoo kɛ banbɔ',
        'Sanebɛi lɛ ji kokoamsɛm',
        'Bo okwɛɔ nɔ ni ooshɛɛ',
        'Kpa o-account be fɛɛ be',
        'Wɔmbalamɛ obiara ni wɔheee gbɛ'
      ],
      summaryTitle: 'O-jwɛŋmɔ he mlitsɔɔmɔ',
    },
    dashboard: {
      greetingMorning: 'Leebi kpakpa',
      greetingAfternoon: 'Shwane kpakpa',
      greetingEvening: 'Gbɛkɛ kpakpa',
      nurtureTitle: 'Daa Minaa',
      clarityTitle: 'Jwɛŋmɔ mli kpaa',
      toolsTitle: 'Nitsumɔi titiri',
      supportTitle: 'Webii kɛ yelikɛbuamɔ',
    },
    garden: {
      title: 'Susuma Abɔɔ',
      subtitle: 'Kwɛmɔ ohejɔlɛ lɛ nɔ',
      seedQuestion: 'Te onuɔ he tɛŋŋ bianɛ?',
      supportNudge: "Eshwerɛ mi akɛ onuɔ he nakai. Oosumɔ ni okee mu ko kwee?",
      successTitle: 'Dua lɛ edua!',
      successSubtitle: "O-abɔɔ lɛ efɛɛ fɛfɛo.\nMuɔ kpakpa — oofee nitsumɔ kpakpa.",
    },
    ai: {
      title: 'MindBridge Oracle',
      subtitle: 'Ohewulaa he',
      placeholder: 'Ŋmaa osane...',
      goToSupport: 'Yaa Hejɔlɛ He',
      disclaimer: "Miyɛ biɛ ni mabua bo, shi mifeee dɔkta. Kɛ́ ooshɛ oshãra mli lɛ, ofainɛ yaa Mmoa gbɛ lɛ nɔ.",
      greetingStandard: "Leebi! Mi ji MindBridge Oracle lɛ. Miyɛ biɛ ni mabua bo ni maduru ojwɛŋmɔ mli. Te onuɔ he tɛŋŋ nnɛ?",
      greetingHeavy: "Hé {name}. Mina akɛ o-nitsumɔ ni ofee nyɛ lɛ wa — onuɔ he akɛ {emotions}. Ehe hiaa ekãa akɛ obɛtsɛ́ gbɛ́i. Mɛni haa onuɔ he tɛŋŋ?",
      greetingGlowing: "Leebi {name}! O-dua ni ofee nyɛ lɛ miitsɛ̀ kɛ {emotions} 🌱 Mɛni ha onuɔ he akɛ o-he wa nakai?",
      greetingRecent: "Hé {name}. Mina akɛ o-jwɛŋmɔ mli lɛ etsɔɔ {emotions}. Te onuɔ he tɛŋŋ paa nnɛ?",
      greetingWelcome: "Akwaaba, {name}. Mi ji MindBridge Oracle lɛ — o-gbɛtsɔɔlɔ paa. Mɛni yɔɔ o-jwɛŋmɔ mli nnɛ?",
    }
  },
  Ewe: {
    common: {
      takeYourTime: 'Gbɔ ɖe eme',
      loadingSafeSpace: 'Wole wò teƒe nyuie la wɔm...',
      back: 'Megbe',
      next: 'Ŋgɔ',
      skip: 'Tutu',
      confirm: 'Ðo kpe edzi',
      cancel: 'Tso eme',
    },
    onboarding: {
      skipConfirm: 'Nyakpui siawo akpe ɖe mía ŋu be míawɔ nu siwo asɔ na wò. Èka ɖe edzi be èdi be yeatutui?',
      skipConfirmAction: 'Tutui kokoo',
      skipConfirmCancel: 'Megbe',
      privacyTitle: 'Wò gbeɖasiwo ho hia 🔒',
      privacyPoints: [
        'Wò nyawo le dzadzɛ ƒe banbɔ me',
        'Dzeɖoɖoawo nye ɣlaɣla nyawo',
        'Wòe nye nu siwo nàma ƒe dziɖula',
        'Nàte ŋu atsɔ wò akawnt ko ɣesiaɣi',
        'Míemana nya aɖeke obiara o negbe ɖe nèma mɔ mí'
      ],
      summaryTitle: 'Wò Nunyanya ƒe Nuvidi',
    },
    dashboard: {
      greetingMorning: 'Ŋdi na wò',
      greetingAfternoon: 'Ŋdɔ na wò',
      greetingEvening: 'Fiẽ na wò',
      nurtureTitle: 'Ŋkekea ƒe Ŋgɔyiyi',
      clarityTitle: 'Kakaɖedzi ƒe ɣeyiɣi',
      toolsTitle: 'Nunyanya ƒe dɔwunuiwo',
      supportTitle: 'Habɔbɔ kple Kpedenanu',
    },
    garden: {
      title: 'Seselelãme ƒe Abɔ',
      subtitle: 'Kpɔ wo ŋutifafa ta',
      seedQuestion: 'Aleke nèle sese me fifia?',
      supportNudge: "Eve m be nèle sese me nenema. Àdi be yeasɔ gbɔgbɔ ƒe dɔwɔnu aɖea?",
      successTitle: 'Ku la ƒe dodo!',
      successSubtitle: "Wò abɔ la le tsitsim fɛfɛɛ.\nGbɔ ɖe eme — èle dɔ nyuie wɔm.",
    },
    ai: {
      title: 'MindBridge Oracle',
      subtitle: 'Wò teƒe nyuie',
      placeholder: 'Ŋlɔ wò gbedasi...',
      goToSupport: 'Kpɔ Kpedenanu Fifia',
      disclaimer: "Mele afii be mase wò nya agbɔ, gake nyemye dɔkta o. Ne èle nɔnɔme sesẽ me la, taflatse zã Kpedenanu mɔwo.",
      greetingStandard: "Ŋdi! Nyee nye MindBridge Oracle. Mele afii be mase wò nya agbɔ, mado alɔ wò eye makpe ɖe ŋuwò be nàkpɔ wò seselelãmewo gbɔ. Aleke nèle fifia?",
      greetingHeavy: "Hé {name}. Mekpɔe be wò seselelãme mamlɛa mefa o — nèle {emotions} sem. Ehiã dzinɔameƒe be nàgblɔe. Nu kae le fu ɖem na wò wu?",
      greetingGlowing: "Ŋdi {name}! Wò ku mamlɛa le dzo dam kple {emotions} 🌱 Nu kae na nèle seselelãme nyui sia me?",
      greetingRecent: "Hé {name}. Mekpɔe be wò seselelãme mamlɛa fia {emotions}. Aleke nèle sese me vavã fifia?",
      greetingWelcome: "Woezor, {name}. Nyee nye MindBridge Oracle — wò mɔfiala. Nu kae le wò jwɛŋmɔ me fifia?",
    }
  },
  Hausa: {
    common: {
      takeYourTime: 'Dauki lokacinka',
      loadingSafeSpace: 'Kirkirar wurin amincin ku...',
      back: 'Baya',
      next: 'Gaba',
      skip: 'Tsallake',
      confirm: 'Tabbatar',
      cancel: 'Soke',
    },
    onboarding: {
      skipConfirm: 'Wannan bayanin yana taimaka mana mu keɓance goyan bayan ku. Kun tabbata kuna son tsallake?',
      skipConfirmAction: 'Tsallake Duk da haka',
      skipConfirmCancel: 'Koma Baya',
      privacyTitle: 'Sirrin ku yana da mahimmanci 🔒',
      privacyPoints: [
        'Bayanan ku na sirri ne kuma suna da tsaro',
        'Tattaunawa na sirri ne',
        'Kuna sarrafa abin da kuke rabawa',
        'Share asusunku kowane lokaci',
        'Babu raba bayanai ba tare da izini ba'
      ],
      summaryTitle: 'Takaitaccen Tunani',
    },
    dashboard: {
      greetingMorning: 'Ina kwana',
      greetingAfternoon: 'Barka da rana',
      greetingEvening: 'Barka da yamma',
      nurtureTitle: 'Ci gaban yau',
      clarityTitle: 'Lokacin Haske',
      toolsTitle: 'Kayan Aiki',
      supportTitle: "Al'umma da Taimako",
    },
    garden: {
      title: 'Lambun Zuciya',
      subtitle: 'Rafi na kwanciyar hankali',
      seedQuestion: 'Yaya kake ji a yanzu?',
      supportNudge: "Yi haƙuri kuna jin haka. Za ku so ku gwada darasin numfashi?",
      successTitle: 'An dasa iri!',
      successSubtitle: "Lambun ku yana girma da kyau.\nYi numfashi mai zurfi - kuna yin girma.",
    },
    ai: {
      title: 'MindBridge Oracle',
      subtitle: 'Wurin amincin ku',
      placeholder: 'Rubuta saƙonku...',
      goToSupport: 'Nemi Taimako Yanzu',
      disclaimer: "Ina nan don sauraro da taimako, amma ni ba likita ba ne. Idan kana cikin haɗari, don Allah yi amfani da sashen Taimakon Gaggawa.",
      greetingStandard: "Ina kwana! Ni ne MindBridge Oracle. Ina nan don in saurare ka, in taimaka maka, in kuma taimaka maka wajen tafiyar da yadda kake ji. Yaya kake yau?",
      greetingHeavy: "Sannu {name}. Na lura cewa bincikenka na ƙarshe ya yi nauyi — kana jin {emotions}. Yana bukatar jajircewa don bayyana hakan. Me ya fi damun ka?",
      greetingGlowing: "Sannu {name}! Irin ka na ƙarshe ya kasance mai haske da {emotions} 🌱 Me ya taimaka wa wannan kyakkyawan kuzari?",
      greetingRecent: "Sannu {name}. Na ga cewa yanayin ka na baya-bayan nan ya nuna {emotions}. Yaya kake da gaske yau?",
      greetingWelcome: "Barka da zuwa, {name}. Ni ne MindBridge Oracle — jagoran ku. Me ke ranka yau?",
    }
  }
};
