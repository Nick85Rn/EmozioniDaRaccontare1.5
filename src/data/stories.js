export const stories = [
  {
    id: 1,
    title: "Il Palloncino Rosso",
    description: "Gestire la tristezza quando perdiamo qualcosa.",
    coverColor: "#FF6B6B",
    isPremium: false, // <--- GRATIS
    startNode: 'start',
    nodes: {
      'start': {
        text: "Sei al parco col tuo palloncino. All'improvviso... WHOOSH! Vola via!",
        image: "🎈💨",
        bgColor: "#E3F2FD",
        choices: [
          { text: "Piangi forte", nextId: 'pianto', emotion: 'Tristezza' },
          { text: "Lo rincorri", nextId: 'ricerca', emotion: 'Speranza' }
        ]
      },
      'pianto': {
        text: "Le lacrime scendono calde. Il palloncino è lontano. Ti senti piccolo e triste.",
        image: "😭",
        bgColor: "#cfd8dc",
        choices: [
          { text: "Fai un bel respiro", nextId: 'calma', emotion: 'Coraggio' },
          { text: "Urli ancora", nextId: 'rabbia', emotion: 'Rabbia' }
        ]
      },
      'ricerca': {
        text: "Corri veloce! Ma non guardi per terra e inciampi in un sasso. Ahi!",
        image: "🏃‍♂️🪨",
        bgColor: "#fff9c4",
        choices: [
          { text: "Ti rialzi subito", nextId: 'calma', emotion: 'Resilienza' },
          { text: "Tiri un calcio al sasso", nextId: 'rabbia', emotion: 'Rabbia' }
        ]
      },
      'rabbia': {
        text: "Sei tutto rosso e arrabbiato! Ma urlare non fa tornare il palloncino.",
        image: "😡😤",
        bgColor: "#ffcdd2",
        choices: [
          { text: "Uso il salvagente per calmarmi", nextId: 'calma', emotion: 'Autocontrollo' }
        ]
      },
      'calma': {
        text: "Ora che sei calmo, guardi in alto. Il palloncino è incastrato in un ramo basso! Puoi prenderlo!",
        image: "🌳🎈",
        bgColor: "#c8e6c9",
        choices: [
          { text: "Lo prendo!", nextId: 'finale', emotion: 'Gioia' }
        ]
      },
      'finale': {
        text: "Evviva! Hai recuperato il palloncino e hai imparato a non arrenderti.",
        image: "🏆🌟",
        bgColor: "#FFF176",
        choices: []
      }
    }
  },
  {
    id: 2,
    title: "Il Buio in Cameretta",
    description: "Affrontare la paura dei mostri sotto il letto.",
    coverColor: "#7986CB",
    isPremium: true, // <--- PREMIUM (Bloccato) 🔒
    startNode: 'start',
    nodes: {
      'start': {
        text: "È ora di dormire. La mamma spegne la luce. Click. Improvvisamente la sedia sembra... un mostro!",
        image: "🛏️🌑",
        bgColor: "#303F9F",
        choices: [
          { text: "Ti nascondi sotto le coperte", nextId: 'nascondino', emotion: 'Paura' },
          { text: "Accendi la torcia", nextId: 'torcia', emotion: 'Coraggio' }
        ]
      },
      'nascondino': {
        text: "Sotto le coperte fa caldo e il cuore batte forte: BUM BUM BUM. Hai paura a uscire.",
        image: "👀",
        bgColor: "#1A237E",
        choices: [
          { text: "Chiami il papà", nextId: 'papà', emotion: 'Ricerca Sicurezza' },
          { text: "Prendi il tuo peluche", nextId: 'peluche', emotion: 'Conforto' }
        ]
      },
      'torcia': {
        text: "Click! Accendi la torcia verso il mostro. Ah! Non è un mostro, è solo la tua felpa sulla sedia!",
        image: "🔦👕",
        bgColor: "#FFF59D",
        choices: [
          { text: "Ridi e ti rilassi", nextId: 'finale', emotion: 'Sollievo' }
        ]
      },
      'papà': {
        text: "Papà arriva e accende la luce. Controllate insieme sotto il letto. Niente mostri, solo polvere!",
        image: "👨‍👧",
        bgColor: "#E1BEE7",
        choices: [
          { text: "Dormo tranquillo", nextId: 'finale', emotion: 'Sicurezza' }
        ]
      },
      'peluche': {
        text: "Stringi forte Orsetto. Lui non ha paura, e ti protegge. Ti senti un po' meglio.",
        image: "🧸❤️",
        bgColor: "#F8BBD0",
        choices: [
          { text: "Chiudo gli occhi", nextId: 'finale', emotion: 'Calma' }
        ]
      },
      'finale': {
        text: "Hai capito che il buio fa brutti scherzi, ma tu sei al sicuro. Buonanotte!",
        image: "💤🌙",
        bgColor: "#E8EAF6",
        choices: []
      }
    }
  }
];