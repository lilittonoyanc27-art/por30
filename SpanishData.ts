/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Conjugation {
  subject: string;
  pronoun: string; // Yo, Tú, Él/Ella, Nosotros, Vosotros, Ellos/Ellas
  armenianPronoun: string; // Ես, Դու, Նա, Մենք, Դուք, Նրանք
  haber: string;
  suffix: string; // -ado / -ido
  example: string;
}

export interface VerbInfo {
  verb: string; // cantar, comer, vivir
  translation: string; // երգել, ուտել, ապրել
  type: 'ar' | 'er' | 'ir' | 'irregular';
  participle: string; // cantado, comido, vivido, hecho
  isIrregular: boolean;
}

export interface QuizQuestion {
  id: number;
  armenian: string;
  spanish: string;
  options: string[];
  correctIndex: number;
  hint: string;
  verb: string;
  subject: string;
  correctParts: string[]; // e.g. ["he", "cantado"]
}

export const ARM_SPANISH_GRAMMAR = {
  title: "Pretérito Perfecto de Indicativo",
  introduction: "Pretérito Perfecto (Սահմանական Անցյալ Կատարյալ) ժամանակաձևը իսպաներենում օգտագործվում է այն անցյալ գործողությունների համար, որոնք կատարվել են ներկա ժամանակահատվածում կամ դեռևս կապված են ներկայի հետ (օրինակ՝ այսօր, այս շաբաթ, երբևէ):",
  formula: "haber (ներկա ժամանակ) + Participio (անցյալ դերբայ)",
  haberConjugation: [
    { pronoun: "Yo (Ես)", form: "he" },
    { pronoun: "Tú (Դու)", form: "has" },
    { pronoun: "Él / Ella / Usted (Նա)", form: "ha" },
    { pronoun: "Nosotros / Nosotras (Մենք)", form: "hemos" },
    { pronoun: "Vosotros / Vosotras (Դուք)", form: "habéis" },
    { pronoun: "Ellos / Ellas / Ustedes (Նրանք)", form: "han" }
  ],
  participleRules: [
    { group: "-AR բայեր", endings: "Փոխվում է -ADO-ի", example: "cantar (երգել) -> cantado" },
    { group: "-ER բայեր", endings: "Փոխվում է -IDO-ի", example: "comer (ուտել) -> comido" },
    { group: "-IR բայեր", endings: "Փոխվում է -IDO-ի", example: "vivir (ապրել) -> vivido" }
  ],
  irregularParticiples: [
    { infinitive: "hacer", translation: "անել", participle: "hecho" },
    { infinitive: "decir", translation: "ասել", participle: "dicho" },
    { infinitive: "ver", translation: "տեսնել", participle: "visto" },
    { infinitive: "escribir", translation: "գրել", participle: "escrito" },
    { infinitive: "abrir", translation: "բացել", participle: "abierto" },
    { infinitive: "poner", translation: "դնել", participle: "puesto" },
    { infinitive: "volver", translation: "վերադառնալ", participle: "vuelto" },
    { infinitive: "romper", translation: "կոտրել", participle: "roto" },
    { infinitive: "morir", translation: "մահանալ", participle: "muerto" }
  ],
  markers: [
    { phrase: "hoy", translation: "այսօր" },
    { phrase: "esta semana", translation: "այս շաբաթ" },
    { phrase: "este año", translation: "այս տարի" },
    { phrase: "ya", translation: "արդեն" },
    { phrase: "todavía no", translation: "դեռ ոչ" },
    { phrase: "alguna vez", translation: "որևէ անգամ" },
    { phrase: "nunca", translation: "երբեք" }
  ]
};

export const POPULAR_VERBS: VerbInfo[] = [
  { verb: "cantar", translation: "երգել", type: "ar", participle: "cantado", isIrregular: false },
  { verb: "comer", translation: "ուտել", type: "er", participle: "comido", isIrregular: false },
  { verb: "vivir", translation: "ապրել", type: "ir", participle: "vivido", isIrregular: false },
  { verb: "hacer", translation: "անել", type: "irregular", participle: "hecho", isIrregular: true },
  { verb: "decir", translation: "ասել", type: "irregular", participle: "dicho", isIrregular: true },
  { verb: "ver", translation: "տեսնել", type: "irregular", participle: "visto", isIrregular: true },
  { verb: "escribir", translation: "գրել", type: "irregular", participle: "escrito", isIrregular: true },
  { verb: "abrir", translation: "բացել", type: "irregular", participle: "abierto", isIrregular: true },
  { verb: "trabajar", translation: "աշխատել", type: "ar", participle: "trabajado", isIrregular: false },
  { verb: "beber", translation: "խմել", type: "er", participle: "bebido", isIrregular: false },
  { verb: "salir", translation: "դուրս գալ", type: "ir", participle: "salido", isIrregular: false },
  { verb: "viajar", translation: "ճամփորդել", type: "ar", participle: "viajado", isIrregular: false }
];

export const PRACTICE_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    armenian: "Ես այսօր երգել եմ:",
    spanish: "Yo he cantado hoy.",
    options: [
      "Yo he cantado hoy.",
      "Yo has cantado hoy.",
      "Yo ha cantado hoy.",
      "Yo hemos cantado hoy."
    ],
    correctIndex: 0,
    hint: "Yo-ի համար օգտագործվում է 'he' օժանդակ բայը և cantar -> cantado:",
    verb: "cantar",
    subject: "Yo",
    correctParts: ["he", "cantado"]
  },
  {
    id: 2,
    armenian: "Դու արդեն ավարտել ես քո խաղը:",
    spanish: "Tú ya has terminado tu juego.",
    options: [
      "Tú ya he terminado tu juego.",
      "Tú ya has cantado tu juego.",
      "Tú ya has terminado tu juego.",
      "Tú ya ha terminado tu juego."
    ],
    correctIndex: 2,
    hint: "Tú-ի համար օժանդակ բայն է 'has', իսկ terminar-ի անցյալ դերբայը՝ 'terminado':",
    verb: "terminar",
    subject: "Tú",
    correctParts: ["has", "terminado"]
  },
  {
    id: 3,
    armenian: "Նա երբևէ ապրել է Իսպանիայում:",
    spanish: "Él alguna vez ha vivido en España.",
    options: [
      "Él alguna vez ha vivido en España.",
      "Él alguna vez has vivido en España.",
      "Él alguna vez hemos vivido en España.",
      "Él alguna vez he vivido en España."
    ],
    correctIndex: 0,
    hint: "Él-ի համար օժանդակ բայն է 'ha', իսկ vivir -> vivido:",
    verb: "vivir",
    subject: "Él",
    correctParts: ["ha", "vivido"]
  },
  {
    id: 4,
    armenian: "Մենք այս շաբաթ նամակ ենք գրել:",
    spanish: "Nosotros hemos escrito una carta esta semana.",
    options: [
      "Nosotros hemos escribido una carta esta semana.",
      "Nosotros hemos escrito una carta esta semana.",
      "Nosotros han escrito una carta esta semana.",
      "Nosotros habéis escrito una carta esta semana."
    ],
    correctIndex: 1,
    hint: "Escribir բայը անկանոն է և դառնում է 'escrito', իսկ Nosotros-ի համար՝ 'hemos':",
    verb: "escribir",
    subject: "Nosotros",
    correctParts: ["hemos", "escrito"]
  },
  {
    id: 5,
    armenian: "Դուք (vosotros) արդեն արել եք տնային աշխատանքը:",
    spanish: "Vosotros ya habéis hecho la tarea.",
    options: [
      "Vosotros ya han hecho la tarea.",
      "Vosotros ya habéis hacido la tarea.",
      "Vosotros ya hemos hecho la tarea.",
      "Vosotros ya habéis hecho la tarea."
    ],
    correctIndex: 3,
    hint: "Hacer-ը անկանոն է դառնում է 'hecho', Vosotros-ի համար օժանդակ բայն է 'habéis':",
    verb: "hacer",
    subject: "Vosotros",
    correctParts: ["habéis", "hecho"]
  },
  {
    id: 6,
    armenian: "Նրանք այսօր տեսել են ֆիլմը:",
    spanish: "Ellos han visto la película hoy.",
    options: [
      "Ellos hemos visto la película hoy.",
      "Ellos han visto la película hoy.",
      "Ellos han verido la película hoy.",
      "Ellos ha visto la película hoy."
    ],
    correctIndex: 1,
    hint: "Ver բայը անկանոն է՝ 'visto', Ellos-ի համար՝ 'han':",
    verb: "ver",
    subject: "Ellos",
    correctParts: ["han", "visto"]
  },
  {
    id: 7,
    armenian: "Մարիան բացել է պատուհանը:",
    spanish: "María ha abierto la ventana.",
    options: [
      "María ha abierto la ventana.",
      "María has abierto la ventana.",
      "María ha abrido la ventana.",
      "María he abierto la ventana."
    ],
    correctIndex: 0,
    hint: "María-ն երրորդ դեմք է (ha), իսկ abrir բայը անկանոն է՝ 'abierto':",
    verb: "abrir",
    subject: "María",
    correctParts: ["ha", "abierto"]
  },
  {
    id: 8,
    armenian: "Ես ճամփորդել եմ Իսպանիայով մեկ:",
    spanish: "Yo he viajado por España.",
    options: [
      "Yo hemos viajado por España.",
      "Yo ha viajado por España.",
      "Yo he viajado por España.",
      "Yo han viajado por España."
    ],
    correctIndex: 2,
    hint: "Yo-ի համար օգտագործվում է 'he', viajar -> viajado:",
    verb: "viajar",
    subject: "Yo",
    correctParts: ["he", "viajado"]
  },
  {
    id: 9,
    armenian: "Դուք (vosotros) աշխատել եք շատ:",
    spanish: "Vosotros habéis trabajado mucho.",
    options: [
      "Vosotros habéis trabajado mucho.",
      "Vosotros han trabajado mucho.",
      "Vosotros hemos trabajado mucho.",
      "Vosotros habéis trabajido mucho."
    ],
    correctIndex: 0,
    hint: "Vosotros-ի հետ օգտագործում ենք 'habéis', trabajar -> trabajado:",
    verb: "trabajar",
    subject: "Vosotros",
    correctParts: ["habéis", "trabajado"]
  },
  {
    id: 10,
    armenian: "Նրանք արդեն վերադարձել են տուն:",
    spanish: "Ellos ya han vuelto a casa.",
    options: [
      "Ellos ya hemos vuelto a casa.",
      "Ellos ya han volverido a casa.",
      "Ellos ya ha vuelto a casa.",
      "Ellos ya han vuelto a casa."
    ],
    correctIndex: 3,
    hint: "Volver բայը դառնում է անկանոն 'vuelto', Ellos-ի համար՝ 'han':",
    verb: "volver",
    subject: "Ellos",
    correctParts: ["han", "vuelto"]
  },
  {
    id: 11,
    armenian: "Կարմենը ծաղիկները դրել է սեղանին:",
    spanish: "Carmen ha puesto las flores en la mesa.",
    options: [
      "Carmen ha puesto las flores en la mesa.",
      "Carmen has puesto las flores en la mesa.",
      "Carmen hemos puesto las flores en la mesa.",
      "Carmen ha ponido las flores en la mesa."
    ],
    correctIndex: 0,
    hint: "Poner ბայը անկանոն է՝ 'puesto', Carmen-ի համար՝ 'ha':",
    verb: "poner",
    subject: "Carmen",
    correctParts: ["ha", "puesto"]
  },
  {
    id: 12,
    armenian: "Մենք պատահաբար կոտրել ենք բաժակը:",
    spanish: "Nosotros hemos roto el vaso por accidente.",
    options: [
      "Nosotros han roto el vaso por accidente.",
      "Nosotros hemos rompido el vaso por accidente.",
      "Nosotros hemos roto el vaso por accidente.",
      "Nosotros habéis roto el vaso por accidente."
    ],
    correctIndex: 2,
    hint: "Romper-ի անցյալ դերբայը անկանոն է՝ 'roto', 'hemos' Nosotros-ի համար:",
    verb: "romper",
    subject: "Nosotros",
    correctParts: ["hemos", "roto"]
  },
  {
    id: 13,
    armenian: "Դու երբևէ ճշմարտությունն ասե՞լ ես նրանց:",
    spanish: "¿Tú alguna vez les has dicho la verdad?",
    options: [
      "¿Tú alguna vez les he dicho la verdad?",
      "¿Tú alguna vez les has dicho la verdad?",
      "¿Tú alguna vez les has decido la verdad?",
      "¿Tú alguna vez les ha dicho la verdad?"
    ],
    correctIndex: 1,
    hint: "Decir բայի անցյալ դերբայը անկանոն է՝ 'dicho', Tú-ի համար՝ 'has':",
    verb: "decir",
    subject: "Tú",
    correctParts: ["has", "dicho"]
  },
  {
    id: 14,
    armenian: "Ես գնել եմ նոր բասկետբոլի գնդակ:",
    spanish: "Yo he comprado un nuevo balón de baloncesto.",
    options: [
      "Yo he comprado un nuevo balón de baloncesto.",
      "Yo ha comprado un nuevo balón de baloncesto.",
      "Yo has comprado un nuevo balón de baloncesto.",
      "Yo hemos comprado un nuevo balón de baloncesto."
    ],
    correctIndex: 0,
    hint: "Comprar բայը կանոնավոր է՝ 'comprar' -> 'comprado', Yo-ի համար՝ 'he':",
    verb: "comprar",
    subject: "Yo",
    correctParts: ["he", "comprado"]
  },
  {
    id: 15,
    armenian: "Նրանք պարել են ամբողջ գիշեր տոնին:",
    spanish: "Ellos han bailado toda la noche en la fiesta.",
    options: [
      "Ellos ha bailado toda la noche en la fiesta.",
      "Ellos hemos bailado toda la noche en la fiesta.",
      "Ellos han bailado toda la noche en la fiesta.",
      "Ellos han bailido toda la noche en la fiesta."
    ],
    correctIndex: 2,
    hint: "Bailar-ը կանոնավոր է՝ 'bailado', Ellos-ի համար՝ 'han':",
    verb: "bailar",
    subject: "Ellos",
    correctParts: ["han", "bailado"]
  },
  {
    id: 16,
    armenian: "Նա այսօր շատ իսպաներեն է սովորել:",
    spanish: "Ella ha aprendido mucho español hoy.",
    options: [
      "Ella ha aprendido mucho español hoy.",
      "Ella has aprendido mucho español hoy.",
      "Ella ha aprendidado mucho español hoy.",
      "Ella he aprendido mucho español hoy."
    ],
    correctIndex: 0,
    hint: "Aprender-ը կանոնավոր է՝ 'aprendido', Ella (նա)-ի համար՝ 'ha':",
    verb: "aprender",
    subject: "Ella",
    correctParts: ["ha", "aprendido"]
  },
  {
    id: 17,
    armenian: "Տեսե՞լ ես դու Señor Pedro-ին խաղադաշտում:",
    spanish: "¿Has visto tú a Señor Pedro en la cancha?",
    options: [
      "¿He visto tú a Señor Pedro en la cancha?",
      "¿Has verido tú a Señor Pedro en la cancha?",
      "¿Ha visto tú a Señor Pedro en la cancha?",
      "¿Has visto tú a Señor Pedro en la cancha?"
    ],
    correctIndex: 3,
    hint: "Ver բայի անցյալ դերբայը անկանոն է՝ 'visto', Tú-ի համար՝ 'has':",
    verb: "ver",
    subject: "Tú",
    correctParts: ["has", "visto"]
  },
  {
    id: 18,
    armenian: "Մենք այսօր կեսօրից հետո բասկետբոլ ենք խաղացել:",
    spanish: "Nosotros hemos jugado al baloncesto esta tarde.",
    options: [
      "Nosotros han jugado al baloncesto esta tarde.",
      "Nosotros hemos jugido al baloncesto esta tarde.",
      "Nosotros hemos jugado al baloncesto esta tarde.",
      "Nosotros habéis jugado al baloncesto esta tarde."
    ],
    correctIndex: 2,
    hint: "Jugar-ի անցյալ դերբայն է 'jugado', Nosotros-ի համար օգտագործում ենք 'hemos':",
    verb: "jugar",
    subject: "Nosotros",
    correctParts: ["hemos", "jugado"]
  },
  {
    id: 19,
    armenian: "Մարզիկները վազել են հինգ կիլոմետր:",
    spanish: "Los atletas han corrido cinco kilómetros.",
    options: [
      "Los atletas han corrido cinco kilómetros.",
      "Los atletas ha corrido cinco kilómetros.",
      "Los atletas han corrado cinco kilómetros.",
      "Los atletas hemos corrido cinco kilómetros."
    ],
    correctIndex: 0,
    hint: "Correr-ը կանոնավոր է՝ 'corrido', Los atletas (նրանք)-ի համար՝ 'han':",
    verb: "correr",
    subject: "Los atletas",
    correctParts: ["han", "corrido"]
  },
  {
    id: 20,
    armenian: "Ես լվացել եմ իմ մարզական համազգեստը:",
    spanish: "Yo he lavado mi uniforme deportivo.",
    options: [
      "Yo ha lavado mi uniforme deportivo.",
      "Yo he lavado mi uniforme deportivo.",
      "Yo has lavado mi uniforme deportivo.",
      "Yo hemos lavado mi uniforme deportivo."
    ],
    correctIndex: 1,
    hint: "Lavar-ը կանոնավոր է՝ 'lavado', Yo-ի համար՝ 'he':",
    verb: "lavar",
    subject: "Yo",
    correctParts: ["he", "lavado"]
  },
  {
    id: 21,
    armenian: "Դու այսօր հաղթել ես բասկետբոլի խաղը:",
    spanish: "Tú has ganado el partido de baloncesto hoy.",
    options: [
      "Tú has ganado el partido de baloncesto hoy.",
      "Tú ha ganado el partido de baloncesto hoy.",
      "Tú he ganado el partido de baloncesto hoy.",
      "Tú han ganado el partido de baloncesto hoy."
    ],
    correctIndex: 0,
    hint: "Ganar-ի անցյալ դերբայն է 'ganado', Tú-ի համար՝ 'has':",
    verb: "ganar",
    subject: "Tú",
    correctParts: ["has", "ganado"]
  },
  {
    id: 22,
    armenian: "Pedro-ն գնդակը գցել է օղակի մեջ:",
    spanish: "Pedro ha encestado el balón en el aro.",
    options: [
      "Pedro ha encestado el balón en el aro.",
      "Pedro has encestado el balón en el aro.",
      "Pedro he encestado el balón en el aro.",
      "Pedro han encestado el balón en el aro."
    ],
    correctIndex: 0,
    hint: "Encestar բայը կանոնավոր է՝ 'encestado', Pedro (երրորդ դեմք)-ի համար՝ 'ha':",
    verb: "encestar",
    subject: "Pedro",
    correctParts: ["ha", "encestado"]
  },
  {
    id: 23,
    armenian: "Մենք այս շաբաթ մարզվել ենք Պեդրոյի հետ:",
    spanish: "Nosotros hemos entrenado con Pedro esta semana.",
    options: [
      "Nosotros han entrenado con Pedro esta semana.",
      "Nosotros hemos entrenado con Pedro esta semana.",
      "Nosotros hemos entrenido con Pedro esta semana.",
      "Nosotros habéis entrenado con Pedro esta semana."
    ],
    correctIndex: 1,
    hint: "Entrenar-ը կառուցվում է որպես 'entrenado', Nosotros-ի համար՝ 'hemos':",
    verb: "entrenar",
    subject: "Nosotros",
    correctParts: ["hemos", "entrenado"]
  },
  {
    id: 24,
    armenian: "Դուք (vosotros) լսե՞լ եք իսպանական երաժշտություն:",
    spanish: "¿Habéis escuchado vosotros música española?",
    options: [
      "¿Han escuchado vosotros música española?",
      "¿Hemos escuchado vosotros música española?",
      "¿Habéis escuchido vosotros música española?",
      "¿Habéis escuchado vosotros música española?"
    ],
    correctIndex: 3,
    hint: "Escuchar-ը դառնում է 'escuchado', Vosotros-ի համար օժանդակ բայն է 'habéis':",
    verb: "escuchar",
    subject: "Vosotros",
    correctParts: ["habéis", "escuchado"]
  },
  {
    id: 25,
    armenian: "Նրանք մարզասրահը վաղ են բացել:",
    spanish: "Ellos han abierto el gimnasio temprano.",
    options: [
      "Ellos han abrido el gimnasio temprano.",
      "Ellos ha abierto el gimnasio temprano.",
      "Ellos han abierto el gimnasio temprano.",
      "Ellos hemos abierto el gimnasio temprano."
    ],
    correctIndex: 2,
    hint: "Abrir բայը անկանոն է՝ 'abierto', Ellos-ի համար՝ 'han':",
    verb: "abrir",
    subject: "Ellos",
    correctParts: ["han", "abierto"]
  },
  {
    id: 26,
    armenian: "Կատուն ամբողջ օրը քնել է սենյակում:",
    spanish: "El gato ha dormido todo el día en el cuarto.",
    options: [
      "El gato ha dormido todo el día en el cuarto.",
      "El gato has dormido todo el día en el cuarto.",
      "El gato hemos dormido todo el día en el cuarto.",
      "El gato han dormido todo el día en el cuarto."
    ],
    correctIndex: 0,
    hint: "Dormir-ի անցյալ դերբայն է 'dormido', El gato (նա/այն) դեպքում՝ 'ha':",
    verb: "dormir",
    subject: "El gato",
    correctParts: ["ha", "dormido"]
  },
  {
    id: 27,
    armenian: "Մարզման ժամանակ ես շատ ջուր եմ խմել:",
    spanish: "Yo he bebido mucha agua durante el entrenamiento.",
    options: [
      "Yo he bebido mucha agua durante el entrenamiento.",
      "Yo ha bebido mucha agua durante el entrenamiento.",
      "Yo has bebido mucha agua durante el entrenamiento.",
      "Yo hemos bebido mucha agua durante el entrenamiento."
    ],
    correctIndex: 0,
    hint: "Beber-ը կանոնավոր է՝ 'bebido', Yo-ի համար՝ 'he':",
    verb: "beber",
    subject: "Yo",
    correctParts: ["he", "bebido"]
  },
  {
    id: 28,
    armenian: "Դուք (vosotros) որոշել եք ավելի շատ մարզվել:",
    spanish: "Vosotros habéis decidido entrenar más.",
    options: [
      "Vosotros han decidido entrenar más.",
      "Vosotros hemos decidido entrenar más.",
      "Vosotros habéis decidado entrenar más.",
      "Vosotros habéis decidido entrenar más."
    ],
    correctIndex: 3,
    hint: "Decidir-ի անցյալ դերբայն է 'decidido', Vosotros-ի համար՝ 'habéis':",
    verb: "decidir",
    subject: "Vosotros",
    correctParts: ["habéis", "decidido"]
  },
  {
    id: 29,
    armenian: "Նա խաղադաշտ է վերադարձել մեծ ոգևորությամբ:",
    spanish: "Ella ha vuelto a la cancha con gran entusiasmo.",
    options: [
      "Ella ha volverido a la cancha con gran entusiasmo.",
      "Ella ha vuelto a la cancha con gran entusiasmo.",
      "Ella has vuelto a la cancha con gran entusiasmo.",
      "Ella han vuelto a la cancha con gran entusiasmo."
    ],
    correctIndex: 1,
    hint: "Volver-ի անցյալ դերբայը անկանոն է՝ 'vuelto', Ella-ի համար՝ 'ha':",
    verb: "volver",
    subject: "Ella",
    correctParts: ["ha", "vuelto"]
  },
  {
    id: 30,
    armenian: "Մենք հասկացել ենք բասկետբոլի կանոնները:",
    spanish: "Nosotros hemos comprendido las reglas del baloncesto.",
    options: [
      "Nosotros han comprendido las reglas del baloncesto.",
      "Nosotros hemos comprendido las reglas del baloncesto.",
      "Nosotros hemos comprendado las reglas del baloncesto.",
      "Nosotros habéis comprendido las reglas del baloncesto."
    ],
    correctIndex: 1,
    hint: "Comprender-ը կանոնավոր է՝ 'comprendido', Nosotros-ի համար օգտագործվում է 'hemos':",
    verb: "comprender",
    subject: "Nosotros",
    correctParts: ["hemos", "comprendido"]
  }
];
