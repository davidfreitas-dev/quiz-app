// eslint-disable-next-line no-undef
const quiz = ref([
  {
    id: 1,
    questions: [
      {
        id: 1,
        question: 'Quem foi o primeiro homem criado por Deus?',
        options: [
          { option: 'A', desc: 'Adão', selected: false },
          { option: 'B', desc: 'Noé', selected: false },
          { option: 'C', desc: 'Abraão', selected: false },
          { option: 'D', desc: 'Moisés', selected: false },
        ],
        answer: 'A',
      },
      {
        id: 2,
        question: 'Quantos discípulos Jesus tinha?',
        options: [
          { option: 'A', desc: '5', selected: false },
          { option: 'B', desc: '12', selected: false },
          { option: 'C', desc: '20', selected: false },
          { option: 'D', desc: '3', selected: false },
        ],
        answer: 'B',
      },
      {
        id: 3,
        question: 'Qual é o primeiro livro da Bíblia?',
        options: [
          { option: 'A', desc: 'Êxodo', selected: false },
          { option: 'B', desc: 'Salmos', selected: false },
          { option: 'C', desc: 'Gênesis', selected: false },
          { option: 'D', desc: 'Provérbios', selected: false },
        ],
        answer: 'C',
      },
      {
        id: 4,
        question: 'Quem construiu a Arca de Noé?',
        options: [
          { option: 'A', desc: 'Davi', selected: false },
          { option: 'B', desc: 'Salomão', selected: false },
          { option: 'C', desc: 'Noé', selected: false },
          { option: 'D', desc: 'Abraão', selected: false },
        ],
        answer: 'C',
      },
      {
        id: 5,
        question: 'Qual foi o milagre mais conhecido de Jesus?',
        options: [
          { option: 'A', desc: 'Cura do cego Bartimeu', selected: false },
          { option: 'B', desc: 'Multiplicação dos pães', selected: false },
          { option: 'C', desc: 'Transformação da água em vinho', selected: false },
          { option: 'D', desc: 'Ressurreição de Lázaro', selected: false },
        ],
        answer: 'B',
      },
      {
        id: 6,
        question: 'Qual profeta foi engolido por um grande peixe?',
        options: [
          { option: 'A', desc: 'Isaías', selected: false },
          { option: 'B', desc: 'Jeremias', selected: false },
          { option: 'C', desc: 'Jonas', selected: false },
          { option: 'D', desc: 'Ezequiel', selected: false },
        ],
        answer: 'C',
      },
      {
        id: 7,
        question: 'Qual é o último livro da Bíblia?',
        options: [
          { option: 'A', desc: 'Apocalipse', selected: false },
          { option: 'B', desc: 'Gênesis', selected: false },
          { option: 'C', desc: 'Salmos', selected: false },
          { option: 'D', desc: 'Levítico', selected: false },
        ],
        answer: 'A',
      },
      {
        id: 8,
        question: 'Qual era a profissão de Pedro antes de se tornar um discípulo de Jesus?',
        options: [
          { option: 'A', desc: 'Pescador', selected: false },
          { option: 'B', desc: 'Carpinteiro', selected: false },
          { option: 'C', desc: 'Tecelão', selected: false },
          { option: 'D', desc: 'Agricultor', selected: false },
        ],
        answer: 'A',
      },
      {
        id: 9,
        question: 'Quem foi o rei mais famoso de Israel, conhecido por sua sabedoria?',
        options: [
          { option: 'A', desc: 'Saul', selected: false },
          { option: 'B', desc: 'Davi', selected: false },
          { option: 'C', desc: 'Salomão', selected: false },
          { option: 'D', desc: 'José', selected: false },
        ],
        answer: 'C',
      },
      {
        id: 10,
        question: 'Qual é o monte em que Moisés recebeu os Dez Mandamentos?',
        options: [
          { option: 'A', desc: 'Monte Sinai', selected: false },
          { option: 'B', desc: 'Monte Carmelo', selected: false },
          { option: 'C', desc: 'Monte das Oliveiras', selected: false },
          { option: 'D', desc: 'Monte Nebo', selected: false },
        ],
        answer: 'A',
      }
    ]
  },
  {
    id: 2,
    questions: [
      {
        id: 1,
        question: 'Quem foi o profeta que enfrentou e venceu os profetas de Baal no Monte Carmelo?',
        options: [
          { option: 'A', desc: 'Isaías', selected: false },
          { option: 'B', desc: 'Jeremias', selected: false },
          { option: 'C', desc: 'Elias', selected: false },
          { option: 'D', desc: 'Jonas', selected: false },
        ],
        answer: 'C',
      },
      {
        id: 2,
        question: 'Qual foi o primeiro milagre de Jesus registrado na Bíblia?',
        options: [
          { option: 'A', desc: 'Transformação da água em vinho', selected: false },
          { option: 'B', desc: 'Cura do cego Bartimeu', selected: false },
          { option: 'C', desc: 'Multiplicação dos pães', selected: false },
          { option: 'D', desc: 'Ressurreição de Lázaro', selected: false },
        ],
        answer: 'A',
      },
      {
        id: 3,
        question: 'Quem foi o rei que escreveu muitos dos Salmos encontrados na Bíblia?',
        options: [
          { option: 'A', desc: 'José', selected: false },
          { option: 'B', desc: 'Davi', selected: false },
          { option: 'C', desc: 'Salomão', selected: false },
          { option: 'D', desc: 'Ezequiel', selected: false },
        ],
        answer: 'B',
      },
      {
        id: 4,
        question: 'Qual dos apóstolos de Jesus negou conhecer Jesus três vezes antes do galo cantar?',
        options: [
          { option: 'A', desc: 'Pedro', selected: false },
          { option: 'B', desc: 'João', selected: false },
          { option: 'C', desc: 'Tiago', selected: false },
          { option: 'D', desc: 'Mateus', selected: false },
        ],
        answer: 'A',
      },
      {
        id: 5,
        question: 'Quem foi o líder que conduziu os israelitas na travessia do Mar Vermelho?',
        options: [
          { option: 'A', desc: 'Abraão', selected: false },
          { option: 'B', desc: 'Moisés', selected: false },
          { option: 'C', desc: 'Josué', selected: false },
          { option: 'D', desc: 'Noé', selected: false },
        ],
        answer: 'B',
      },
      {
        id: 6,
        question: 'Qual é o livro da Bíblia que contém os Dez Mandamentos?',
        options: [
          { option: 'A', desc: 'Êxodo', selected: false },
          { option: 'B', desc: 'Levítico', selected: false },
          { option: 'C', desc: 'Números', selected: false },
          { option: 'D', desc: 'Deuteronômio', selected: false },
        ],
        answer: 'A',
      },
      {
        id: 7,
        question: 'Quem foi o profeta que teve suas visões registradas no livro de Apocalipse?',
        options: [
          { option: 'A', desc: 'Isaías', selected: false },
          { option: 'B', desc: 'Jeremias', selected: false },
          { option: 'C', desc: 'Daniel', selected: false },
          { option: 'D', desc: 'Ezequiel', selected: false },
        ],
        answer: 'C',
      },
      {
        id: 8,
        question: 'Quem sonhou com uma escada que chegava ao céu?',
        options: [
          { option: 'A', desc: 'Abraão', selected: false },
          { option: 'B', desc: 'Jacó', selected: false },
          { option: 'C', desc: 'Isaque', selected: false },
          { option: 'D', desc: 'Moisés', selected: false },
        ],
        answer: 'B',
      },
      {
        id: 9,
        question: 'Qual foi o sinal que Deus deu a Noé como símbolo de Sua aliança?',
        options: [
          { option: 'A', desc: 'Um arco-íris', selected: false },
          { option: 'B', desc: 'Uma estrela brilhante', selected: false },
          { option: 'C', desc: 'Um trovão', selected: false },
          { option: 'D', desc: 'Uma árvore frutífera', selected: false },
        ],
        answer: 'A',
      },
      {
        id: 10,
        question: 'Quem foi o homem que Deus chamou para liderar o povo de Israel na conquista da Terra Prometida?',
        options: [
          { option: 'A', desc: 'Davi', selected: false },
          { option: 'B', desc: 'Josué', selected: false },
          { option: 'C', desc: 'Samuel', selected: false },
          { option: 'D', desc: 'Gideão', selected: false },
        ],
        answer: 'B',
      }
    ]
  }
]);

const createQuizzes = async () => {
  // eslint-disable-next-line no-undef
  const docRef = await addDoc(collection(db, 'quizzes'), quiz.value);
};
