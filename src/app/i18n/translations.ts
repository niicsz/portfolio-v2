export type Language = 'pt' | 'en';

export interface Translations {
  months: string[];
  nav: {
    about: string;
    experience: string;
    education: string;
    projects: string;
    skills: string;
    certifications: string;
  };
  header: {
    toLightMode: string;
    toDarkMode: string;
    toggleMenu: string;
    switchLanguage: string;
    otherLanguageCode: string;
  };
  hero: {
    role: string;
    resume: string;
  };
  about: {
    title: string;
    paragraphs: string[];
  };
  experience: {
    title: string;
    period: string;
    paragraphs: string[];
  };
  education: {
    title: string;
    inProgress: string;
    degrees: Record<'mba' | 'technologist' | 'technical', string>;
    usp: string;
  };
  projects: {
    title: string;
    inDevelopment: string;
    viewOnGitHub: string;
    items: Record<string, { name: string; description: string }>;
  };
  skills: {
    title: string;
  };
  certifications: {
    title: string;
    issuedOn: string;
  };
  chat: {
    title: string;
    subtitle: string;
    close: string;
    open: string;
    launcher: string;
    logLabel: string;
    intro: string;
    suggestionsLabel: string;
    suggestions: string[];
    you: string;
    assistant: string;
    sources: string;
    typing: string;
    inputLabel: string;
    placeholder: string;
    hint: string;
    send: string;
    outOfScope: string;
    rejected: string;
    errors: {
      network: string;
      invalid: string;
      unavailable: string;
      generic: string;
      empty: string;
      rateLimit: string;
      rateLimitIn: (seconds: number) => string;
    };
  };
}

const PT: Translations = {
  months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  nav: {
    about: 'Sobre',
    experience: 'Experiência',
    education: 'Educação',
    projects: 'Projetos',
    skills: 'Habilidades',
    certifications: 'Certificações'
  },
  header: {
    toLightMode: 'Mudar para modo claro',
    toDarkMode: 'Mudar para modo escuro',
    toggleMenu: 'Abrir ou fechar o menu',
    switchLanguage: 'Switch to English',
    otherLanguageCode: 'EN'
  },
  hero: {
    role: 'Software Engineer at Bradesco',
    resume: 'Ver Currículo'
  },
  about: {
    title: 'Sobre Mim',
    paragraphs: [
      'Sou Desenvolvedor de Software especializado em Java e Spring Boot, atuando no Bradesco na construção e manutenção de soluções de alta performance e escala. Tenho experiência com Nest.js, Angular, Docker, SQL Server e MongoDB, além de certificação Azure, o que me permite trabalhar com arquiteturas modernas, integrações robustas e ambientes em nuvem.',
      'Minha trajetória combina desenvolvimento Back-End, conhecimento em sistemas distribuídos e participação ativa em squads ágeis, sempre com foco em entregar software confiável, seguro e alinhado às necessidades do negócio. Sou movido por desafios técnicos, melhoria contínua e boas práticas de engenharia.',
      'Sou tecnólogo em Análise e Desenvolvimento de Sistemas pela Universidade São Judas Tadeu e atualmente curso MBA em Engenharia de Software na Universidade de São Paulo (USP), buscando aprofundar minhas habilidades e contribuir com soluções que gerem impacto real para as empresas e para os usuários.'
    ]
  },
  experience: {
    title: 'Experiência Profissional',
    period: 'Fev 2025 - O momento · Híbrido, Osasco, SP',
    paragraphs: [
      'Atuei no Btoken – Token Corporativo do Bradesco, contribuindo para o desenvolvimento e manutenção de um sistema de geração de tokens OTP usado em vários canais bancários. Construí microsserviços com Spring Boot, desenvolvi APIs REST (documentadas com Swagger/OpenAPI) e implementei testes unitários com JUnit 5 e Mockito. Utilizei Java, Kafka, Azure, SQL Server e Databricks para persistência de dados, processamento e relatórios analíticos.',
      'Posteriormente, integrei a Squad DocMatch (Análise de Documentos), desenvolvendo integrações com a API da Serasa para validação e autenticação de documentos. Trabalhei com MongoDB e SQL Server para armazenamento e correlação de dados, garantindo segurança e escalabilidade nos processos de onboarding.',
      'Atualmente, faço parte da Squad Bex for Dev, em um contexto de Platform Engineering utilizando o Backstage (Internal Developer Platform). Apoio iniciativas para melhorar a experiência do desenvolvedor (DX), mantendo serviços da plataforma interna. Meu dia a dia inclui uso de Linux (WSL, RHEL), containers com Podman e Docker, e criação de Shell scripts para automação de tarefas.'
    ]
  },
  education: {
    title: 'Formação Acadêmica',
    inProgress: 'Em andamento',
    degrees: {
      mba: 'MBA em Engenharia de Software',
      technologist: 'Tecnólogo em Análise e Desenvolvimento de Sistemas',
      technical: 'Técnico em Desenvolvimento de Sistemas'
    },
    usp: 'Universidade de São Paulo (USP)'
  },
  projects: {
    title: 'Projetos',
    inDevelopment: 'Em desenvolvimento',
    viewOnGitHub: 'Ver no GitHub',
    items: {
      'resilience-lab': {
        name: 'Resilience Lab',
        description:
          'Laboratório de resiliência em arquitetura hexagonal com Java 25, Spring Boot 4 e Resilience4j: seis padrões medidos no Grafana com k6 e WireMock.'
      },
      'binitech-pdv': {
        name: 'BiniTech PDV',
        description: 'Sistema de Ponto de Venda (PDV) moderno e eficiente, focado na gestão de caixa.'
      },
      'binitech-auth': {
        name: 'BiniTech Auth',
        description:
          'Serviço reutilizável de autenticação com arquitetura hexagonal, Java 21, Spring Boot, MongoDB, JWT e Argon2.'
      },
      'binitech-pdv-frontend': {
        name: 'BiniTech PDV Frontend',
        description:
          'SPA Angular 21 do BiniTech PDV SaaS multi-tenant, com fluxos de venda, gestão, relatórios e assinatura via Stripe.'
      },
      'cep-api': {
        name: 'Logística CEP API',
        description:
          'API REST para consulta de CEPs com abordagem API-first, resiliência, testes de integração e infraestrutura AWS via Terraform.'
      },
      'url-shortener': {
        name: 'URL Shortener',
        description: 'Encurtador de URLs rápido e escalável construído com Java e banco de dados relacional.'
      },
      'percentage-calculator': {
        name: 'Calculadora de Aumento Percentual',
        description: 'Projeto de calculadora que aplica aumento percentual a um valor inicial.'
      }
    }
  },
  skills: {
    title: 'Habilidades & Tecnologias'
  },
  certifications: {
    title: 'Certificações',
    issuedOn: 'Emitido em'
  },
  chat: {
    title: 'Entreviste o Nicolas',
    subtitle: 'Respostas geradas por IA com base no currículo',
    close: 'Fechar chat de entrevista',
    open: 'Abrir chat: entreviste o Nicolas',
    launcher: 'Me entreviste',
    logLabel: 'Conversa com o assistente',
    intro:
      'Olá! Eu respondo perguntas sobre a carreira do Nicolas: experiência profissional, projetos, formação e stack. Pergunte o que quiser ou escolha uma sugestão abaixo.',
    suggestionsLabel: 'Perguntas sugeridas',
    suggestions: [
      'Quais tecnologias ele usou no Btoken?',
      'Quais projetos pessoais ele tem?',
      'Onde ele estuda?',
      'Quais certificações ele tem?'
    ],
    you: 'Você:',
    assistant: 'Assistente:',
    sources: 'Fontes:',
    typing: 'O assistente está digitando',
    inputLabel: 'Sua pergunta',
    placeholder: 'Pergunte sobre experiência, projetos, formação...',
    hint: 'Enter envia · Shift+Enter quebra linha',
    send: 'Enviar pergunta',
    outOfScope:
      'Só consigo responder perguntas sobre a carreira do Nicolas: experiências, projetos, formação e tecnologias.',
    rejected: 'Não posso ajudar com esse pedido. Que tal perguntar sobre as experiências ou projetos do Nicolas?',
    errors: {
      network:
        'Não foi possível conectar ao assistente agora. Verifique sua conexão e tente novamente em instantes.',
      invalid: 'Não consegui entender a pergunta. Ela precisa ter entre 3 e 500 caracteres.',
      unavailable: 'O assistente está temporariamente indisponível. Tente novamente mais tarde.',
      generic: 'Algo deu errado ao buscar a resposta. Tente novamente em instantes.',
      empty: 'Não recebi uma resposta válida do assistente. Tente novamente.',
      rateLimit: 'Muitas perguntas em pouco tempo. Aguarde um pouco e tente novamente.',
      rateLimitIn: (seconds) =>
        `Muitas perguntas em pouco tempo. Tente novamente em ${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}.`
    }
  }
};

const EN: Translations = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  nav: {
    about: 'About',
    experience: 'Experience',
    education: 'Education',
    projects: 'Projects',
    skills: 'Skills',
    certifications: 'Certifications'
  },
  header: {
    toLightMode: 'Switch to light mode',
    toDarkMode: 'Switch to dark mode',
    toggleMenu: 'Open or close the menu',
    switchLanguage: 'Mudar para português',
    otherLanguageCode: 'PT'
  },
  hero: {
    role: 'Software Engineer at Bradesco',
    resume: 'View Resume'
  },
  about: {
    title: 'About Me',
    paragraphs: [
      "I'm a Software Developer specialized in Java and Spring Boot, working at Bradesco building and maintaining high-performance, large-scale solutions. I have experience with Nest.js, Angular, Docker, SQL Server and MongoDB, plus an Azure certification, which lets me work with modern architectures, robust integrations and cloud environments.",
      "My path combines back-end development, knowledge of distributed systems and active participation in agile squads, always focused on delivering reliable, secure software aligned with business needs. I'm driven by technical challenges, continuous improvement and good engineering practices.",
      "I hold a technologist degree in Systems Analysis and Development from Universidade São Judas Tadeu and I'm currently pursuing an MBA in Software Engineering at the University of São Paulo (USP), aiming to deepen my skills and deliver solutions with real impact for companies and users."
    ]
  },
  experience: {
    title: 'Professional Experience',
    period: 'Feb 2025 - Present · Hybrid, Osasco, SP',
    paragraphs: [
      "I worked on Btoken – Bradesco's Corporate Token, contributing to the development and maintenance of an OTP token generation system used across several banking channels. I built microservices with Spring Boot, developed REST APIs (documented with Swagger/OpenAPI) and wrote unit tests with JUnit 5 and Mockito. I used Java, Kafka, Azure, SQL Server and Databricks for data persistence, processing and analytical reports.",
      'Later, I joined the DocMatch squad (Document Analysis), building integrations with the Serasa API for document validation and authentication. I worked with MongoDB and SQL Server for data storage and correlation, ensuring security and scalability in onboarding processes.',
      "I'm currently part of the Bex for Dev squad, in a Platform Engineering context using Backstage (Internal Developer Platform). I support initiatives to improve developer experience (DX) and maintain internal platform services. My day-to-day includes Linux (WSL, RHEL), containers with Podman and Docker, and Shell scripts for task automation."
    ]
  },
  education: {
    title: 'Education',
    inProgress: 'In progress',
    degrees: {
      mba: 'MBA in Software Engineering',
      technologist: 'Technologist Degree in Systems Analysis and Development',
      technical: 'Technical Degree in Systems Development'
    },
    usp: 'University of São Paulo (USP)'
  },
  projects: {
    title: 'Projects',
    inDevelopment: 'In development',
    viewOnGitHub: 'View on GitHub',
    items: {
      'resilience-lab': {
        name: 'Resilience Lab',
        description:
          'Resilience lab in hexagonal architecture with Java 25, Spring Boot 4 and Resilience4j: six patterns measured in Grafana with k6 and WireMock.'
      },
      'binitech-pdv': {
        name: 'BiniTech PDV',
        description: 'Modern, efficient Point of Sale (POS) system focused on cash register management.'
      },
      'binitech-auth': {
        name: 'BiniTech Auth',
        description:
          'Reusable authentication service with hexagonal architecture, Java 21, Spring Boot, MongoDB, JWT and Argon2.'
      },
      'binitech-pdv-frontend': {
        name: 'BiniTech PDV Frontend',
        description:
          'Angular 21 SPA for the multi-tenant BiniTech PDV SaaS, with sales, management, reporting and Stripe subscription flows.'
      },
      'cep-api': {
        name: 'Logistics ZIP Code API',
        description:
          'REST API for Brazilian ZIP code (CEP) lookup with an API-first approach, resilience, integration tests and AWS infrastructure via Terraform.'
      },
      'url-shortener': {
        name: 'URL Shortener',
        description: 'Fast, scalable URL shortener built with Java and a relational database.'
      },
      'percentage-calculator': {
        name: 'Percentage Increase Calculator',
        description: 'Calculator project that applies a percentage increase to an initial value.'
      }
    }
  },
  skills: {
    title: 'Skills & Technologies'
  },
  certifications: {
    title: 'Certifications',
    issuedOn: 'Issued'
  },
  chat: {
    title: 'Interview Nicolas',
    subtitle: 'AI-generated answers based on his resume',
    close: 'Close interview chat',
    open: 'Open chat: interview Nicolas',
    launcher: 'Interview me',
    logLabel: 'Conversation with the assistant',
    intro:
      "Hi! I answer questions about Nicolas's career: professional experience, projects, education and tech stack. Ask anything or pick a suggestion below.",
    suggestionsLabel: 'Suggested questions',
    suggestions: [
      'What technologies did he use on Btoken?',
      'What personal projects does he have?',
      'Where does he study?',
      'What certifications does he have?'
    ],
    you: 'You:',
    assistant: 'Assistant:',
    sources: 'Sources:',
    typing: 'The assistant is typing',
    inputLabel: 'Your question',
    placeholder: 'Ask about experience, projects, education...',
    hint: 'Enter sends · Shift+Enter adds a line',
    send: 'Send question',
    outOfScope: "I can only answer questions about Nicolas's career: experience, projects, education and tech stack.",
    rejected: "I can't help with that request. Try asking about Nicolas's experience or projects.",
    errors: {
      network: "Couldn't reach the assistant right now. Check your connection and try again shortly.",
      invalid: "I couldn't understand the question. It must be between 3 and 500 characters.",
      unavailable: 'The assistant is temporarily unavailable. Please try again later.',
      generic: 'Something went wrong while fetching the answer. Please try again shortly.',
      empty: "I didn't get a valid answer from the assistant. Please try again.",
      rateLimit: 'Too many questions in a short time. Please wait a bit and try again.',
      rateLimitIn: (seconds) =>
        `Too many questions in a short time. Try again in ${seconds} ${seconds === 1 ? 'second' : 'seconds'}.`
    }
  }
};

export const TRANSLATIONS: Record<Language, Translations> = { pt: PT, en: EN };
