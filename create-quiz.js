// eslint-disable-next-line no-undef
const quiz = ref({
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
});

const createQuizzes = async () => {
  // eslint-disable-next-line no-undef
  const docRef = await addDoc(collection(db, 'quizzes'), quiz.value);
};
