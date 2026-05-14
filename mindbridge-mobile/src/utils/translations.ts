export type Language = 'English' | 'French' | 'Twi' | 'Ga' | 'Ewe' | 'Hausa';

export interface TranslationSchema {
  dashboard: {
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
    ritualsTitle: string;
    clarityTitle: string;
    toolsTitle: string;
    supportTitle: string;
  };
  garden: {
    title: string;
    subtitle: string;
    seedQuestion: string;
  };
  ai: {
    title: string;
    subtitle: string;
    placeholder: string;
    goToSupport: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  English: {
    dashboard: {
      greetingMorning: 'Good Morning',
      greetingAfternoon: 'Good Afternoon',
      greetingEvening: 'Good Evening',
      ritualsTitle: "Today's Progress",
      clarityTitle: 'Moment of Clarity',
      toolsTitle: 'Mindful Tools',
      supportTitle: 'Community & Support',
    },
    garden: {
      title: 'Mood Garden',
      subtitle: 'Nurture your peace',
      seedQuestion: 'How are you feeling right now?',
    },
    ai: {
      title: 'MindBridge Oracle',
      subtitle: 'Your safe space',
      placeholder: 'Type your message...',
      goToSupport: 'Get Support Now',
    }
  },
  Twi: {
    dashboard: {
      greetingMorning: 'Maakye',
      greetingAfternoon: 'Maaha',
      greetingEvening: 'Maadwo',
      ritualsTitle: 'Nnɛ Nkɔsoɔ',
      clarityTitle: 'Adwene Mu Paa',
      toolsTitle: 'Nnwuma Titiriw',
      supportTitle: 'Mmoa ne Mpuntuo',
    },
    garden: {
      title: 'Tuo Garden',
      subtitle: 'Hwɛ wo asomdwoe so',
      seedQuestion: 'Tebea bɛn na wowɔ mu seesei?',
    },
    ai: {
      title: 'MindBridge Oracle',
      subtitle: 'Wo banbɔbea',
      placeholder: 'Twerɛ wo asɛm...',
      goToSupport: 'Nya Mmoa Seesei',
    }
  },
  French: {
    dashboard: {
      greetingMorning: 'Bon matin',
      greetingAfternoon: 'Bon après-midi',
      greetingEvening: 'Bonsoir',
      ritualsTitle: 'Progrès du jour',
      clarityTitle: 'Moment de Clarté',
      toolsTitle: 'Outils de pleine conscience',
      supportTitle: 'Communauté et soutien',
    },
    garden: {
      title: "Jardin d'humeur",
      subtitle: 'Cultivez votre paix',
      seedQuestion: 'Comment vous sentez-vous en ce moment?',
    },
    ai: {
      title: 'Oracle MindBridge',
      subtitle: 'Votre espace sécurisé',
      placeholder: 'Tapez votre message...',
      goToSupport: 'Obtenir de l\'aide',
    }
  },
  Ga: {
    dashboard: {
      greetingMorning: 'Leebi kpakpa',
      greetingAfternoon: 'Shwane kpakpa',
      greetingEvening: 'Gbɛkɛ kpakpa',
      ritualsTitle: 'Minaa shia',
      clarityTitle: 'Jwɛŋmɔ mli kpaa',
      toolsTitle: 'Nitsumɔi titiri',
      supportTitle: 'Webii kɛ yelikɛbuamɔ',
    },
    garden: {
      title: 'Susuma Abɔɔ',
      subtitle: 'Kwɛmɔ ohejɔlɛ lɛ nɔ',
      seedQuestion: 'Te onuɔ he tɛŋŋ bianɛ?',
    },
    ai: {
      title: 'MindBridge Oracle',
      subtitle: 'Ohewulaa he',
      placeholder: 'Ŋmaa osane...',
      goToSupport: 'Yaa Hejɔlɛ He',
    }
  },
  Ewe: {
    dashboard: {
      greetingMorning: 'Ŋdi na wò',
      greetingAfternoon: 'Ŋdɔ na wò',
      greetingEvening: 'Fiẽ na wò',
      ritualsTitle: 'Ŋkekea ƒe ŋgɔyiyi',
      clarityTitle: 'Kakaɖedzi ƒe ɣeyiɣi',
      toolsTitle: 'Nunyanya ƒe dɔwunuiwo',
      supportTitle: 'Habɔbɔ kple Kpedenanu',
    },
    garden: {
      title: 'Seselelãme ƒe Abɔ',
      subtitle: 'Kpɔ wo ŋutifafa ta',
      seedQuestion: 'Aleke nèle sese me fifia?',
    },
    ai: {
      title: 'MindBridge Oracle',
      subtitle: 'Wò teƒe nyuie',
      placeholder: 'Ŋlɔ wò gbedasi...',
      goToSupport: 'Kpɔ Kpedenanu Fifia',
    }
  },
  Hausa: {
    dashboard: {
      greetingMorning: 'Ina kwana',
      greetingAfternoon: 'Barka da rana',
      greetingEvening: 'Barka da yamma',
      ritualsTitle: 'Ci gaban yau',
      clarityTitle: 'Lokacin Haske',
      toolsTitle: 'Kayan Aiki',
      supportTitle: "Al'umma da Taimako",
    },
    garden: {
      title: 'Lambun Zuciya',
      subtitle: 'Rafi na kwanciyar hankali',
      seedQuestion: 'Yaya kake ji a yanzu?',
    },
    ai: {
      title: 'MindBridge Oracle',
      subtitle: 'Wurin amincin ku',
      placeholder: 'Rubuta saƙonku...',
      goToSupport: 'Nemi Taimako Yanzu',
    }
  }
};
