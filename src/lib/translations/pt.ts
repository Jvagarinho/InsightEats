const pt = {
  Sidebar: {
    dashboard: "Painel",
    diary: "Diário",
    foods: "Alimentos",
    profile: "Perfil",
    features: "Funcionalidades",
    about: "Sobre",
    signOut: "Sair"
  },
  Common: {
    loading: "A carregar..."
  },
  Landing: {
    title: "InsightEats",
    description: "Acompanhe a sua nutrição com análise de alimentos por IA",
    signIn: "Entrar",
    getStarted: "Começar",
    goToDashboard: "Ir para Painel",
    copyright: "© 2026 InsightEats. Todos os direitos reservados."
  },
  Camera: {
    takePhoto: "Tirar Foto",
    uploadFromGallery: "Carregar da Galeria",
    cancel: "Cancelar",
    capture: "Capturar"
  },
  Features: {
    title: "Funcionalidades",
    description: "Descubra o que o InsightEats pode fazer por si",
    backToApp: "Voltar à App",
    mission: {
      title: "A Nossa Missão",
      content: "Ajudar as pessoas a fazer escolhas alimentares mais saudáveis através de tecnologia inteligente."
    },
    technologies: {
      title: "Tecnologias",
      description: "Potenciado por IA avançada e machine learning"
    },
    version: "Versão",
    smartTracking: {
      title: "Registo Inteligente",
      description: "Registe as suas refeições com reconhecimento de alimentos por IA"
    },
    detailedInsights: {
      title: "Informações Detalhadas",
      description: "Obtenha análise nutricional completa e acompanhamento de progresso"
    },
    globalDatabase: {
      title: "Base de Dados Global",
      description: "Aceda a milhões de alimentos das bases de dados Open Food Facts e USDA"
    },
    quickEasy: {
      title: "Rápido e Fácil",
      description: "Registe as suas refeições em segundos com a nossa interface intuitiva"
    }
  },
  About: {
    title: "Sobre o InsightEats & Iterio Tech",
    backToApp: "Voltar à App",
    presentation: {
      title: "Apresentação do Projeto Iterio Tech",
      paragraph1: "A Iterio Tech é uma iniciativa de desenvolvimento de software de ponta dedicada a ligar dados complexos à experiência humana diária. Somos especializados na criação de soluções digitais intuitivas e de alto desempenho que capacitam os utilizadores para assumir o controlo do seu crescimento e bem-estar pessoal.",
      paragraph2: "No cerne da nossa filosofia está a crença de que a tecnologia deve ser uma facilitadora silenciosa, proporcionando clareza sem complexidade. Com projetos como o InsightEats, aproveitamos arquiteturas full-stack modernas para transformar o rastreio nutricional numa viagem perfeita e esclarecedora.",
      paragraph3: "A Iterio Tech está empenhada em construir ferramentas que não sejam apenas funcionais, mas essenciais para um futuro mais saudável e orientado por dados."
    },
    mission: "A nossa missão é capacitar as pessoas com insights claros e orientados por dados para que possam fazer melhores escolhas de estilo de vida.",
    contact: {
      title: "Secção de Contato",
      intro: "Estamos sempre abertos a colaborações, feedback ou dúvidas sobre os nossos projetos. Sinta-se à vontade para contactar a nossa equipa:",
      emailLabel: "E-mail: ",
      tagline: "Iterio Tech – Simplificando a complexidade, uma linha de código de cada vez."
    },
    footer: {
      copyright: "© {year} Iterio Tech"
    }
  },
  Dashboard: {
    toasts: {
      weightLogged: "Peso registado com sucesso",
      weightError: "Erro ao registar peso"
    },
    title: "Painel",
    subtitle: "Acompanhe o seu progresso e nutrição",
    weightEvolution: "Evolução do Peso",
    last7Days: "7D",
    last30Days: "30D",
    last90Days: "90D",
    lastYear: "1A",
    logWeight: "Registar Peso",
    smartFoodSearch: "Pesquisa Inteligente de Alimentos",
    quickTip: "Dica Rápida",
    tipContent: "A consistência é a chave para atingir os seus objetivos de saúde. Registe as suas refeições diariamente!",
    loadingChart: "A carregar gráfico...",
    noWeightData: "Sem dados de peso disponíveis",
    rangeStart: "Início",
    rangeCurrent: "Atual",
    rangeChange: "Mudança",
    weightInputLabel: "Peso (kg)",
    weightInputPlaceholder: "Introduza o seu peso",
    saving: "A guardar...",
    logAction: "Registar"
  },
  Profile: {
    toasts: {
      success: "Perfil atualizado com sucesso",
      error: "Erro ao atualizar perfil"
    },
    title: "Perfil",
    user_info: "Informação do Utilizador",
    subtitle: "Gerencie as suas informações pessoais e objetivos",
    form: {
      age: "Idade",
      weight: "Peso (kg)",
      height: "Altura (cm)",
      sex: "Sexo",
      male: "Masculino",
      female: "Feminino",
      activityLevel: "Nível de Atividade",
      activityOptions: {
        sedentary: "Sedentário (pouco ou nenhum exercício)",
        light: "Ligeiramente ativo (1-3 dias/semana)",
        moderate: "Moderadamente ativo (3-5 dias/semana)",
        active: "Ativo (6-7 dias/semana)",
        very_active: "Muito ativo (trabalho físico ou 2x treino)"
      },
      saving: "A guardar...",
      saveGoals: "Guardar Objetivos"
    },
    dailyTargets: "Objetivos Diários",
    fillDetails: "Preencha os seus dados para calcular os seus objetivos diários"
  },
  FoodVision: {
    title: "Analisar Comida com IA",
    description: "Tire uma foto ou carregue uma imagem da sua refeição e deixe a IA identificar os alimentos e estimar os valores nutricionais.",
    analyzing: "A analisar imagem...",
    analysisError: "Erro ao analisar imagem",
    aiSummary: "Resumo da IA",
    confidence: {
      high: "Alta",
      medium: "Média",
      low: "Baixa"
    },
    search: "Procurar",
    searchingFor: "A procurar",
    foodAdded: "Alimento adicionado ao diário com sucesso!",
    errorAdding: "Erro ao adicionar alimento ao diário",
    close: "Fechar",
    addToDiary: "Adicionar ao Diário"
  },
  Diary: {
    title: "Diário Alimentar",
    subtitle: "Registe as suas refeições e monitorize a sua nutrição",
    addToDiary: "Adicionar ao Diário",
    todayLog: "Registo de Hoje",
    noLogsToday: "Ainda sem refeições registadas hoje",
    logDeleted: "Entrada eliminada com sucesso",
    deleteError: "Erro ao eliminar entrada",
    deleteLog: "Eliminar entrada"
  },
  FoodSearch: {
    placeholder: "Procurar alimento...",
    externalResults: "Resultados Externos",
    searchingExternal: "A procurar em fontes externas...",
    noResults: "Nenhum resultado encontrado",
    addFood: "Adicionar Alimento",
    quantityGrams: "Quantidade (gramas)",
    cancel: "Cancelar",
    addToDiary: "Adicionar ao Diário",
    alreadyInDb: "Alimento já existe na base de dados",
    addedToDb: "Alimento adicionado à base de dados",
    mealRecorded: "Refeição registada com sucesso!"
  },
  DailyProgress: {
    today: "Hoje",
    basedOnTargets: "Baseado nos seus objetivos",
    setGoals: "Defina os seus objetivos",
    date: "Data",
    previous: "Anterior",
    next: "Próximo",
    target: "Objetivo",
    macros: {
      calories: "Calorias",
      protein: "Proteínas",
      carbs: "Carboidratos",
      fats: "Gorduras",
      fiber: "Fibras"
    }
  }
} as const;

export default pt;
