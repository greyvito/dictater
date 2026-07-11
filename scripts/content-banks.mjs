/** Curriculum pack data for expand-content.mjs — ids use prefix p800- */

export const EXTRA_GRAMMAR = [
  {
    suffix: 'gram-punct',
    title: 'End Punctuation',
    question: 'Which sentence ends correctly?',
    choices: ['Where are you?', 'Where are you.', 'Where are you,'],
    correctIndex: 0,
    hint: 'Questions need a question mark.'
  },
  {
    suffix: 'gram-noun',
    title: 'Common Nouns',
    question: 'Which word is a person, place, or thing?',
    choices: ['school', 'quickly', 'happy'],
    correctIndex: 0,
    hint: 'Nouns name people, places, or things.'
  },
  {
    suffix: 'gram-adj',
    title: 'Adjectives',
    question: 'Which word describes the noun?',
    choices: ['The tall tree.', 'The run tree.', 'The quickly tree.'],
    correctIndex: 0,
    hint: 'Adjectives tell what kind or how many.'
  },
  {
    suffix: 'gram-pronoun',
    title: 'Pronouns',
    question: 'Choose the best pronoun: ___ went to the store.',
    choices: ['She', 'Her', 'Hers'],
    correctIndex: 0,
    hint: 'Use a subject pronoun.'
  },
  {
    suffix: 'gram-conj',
    title: 'Conjunctions',
    question: 'I wanted to play, ___ it was raining.',
    choices: ['but', 'so', 'the'],
    correctIndex: 0,
    hint: 'But shows contrast.'
  },
  {
    suffix: 'gram-article',
    title: 'Articles a/an',
    question: 'Choose the correct article: ___ umbrella.',
    choices: ['an', 'a', 'the the'],
    correctIndex: 0,
    hint: 'Use an before vowel sounds.'
  },
  {
    suffix: 'gram-comma',
    title: 'Commas in a List',
    question: 'Which list uses commas correctly?',
    choices: ['red, blue, and green', 'red blue and green', 'red, blue and, green'],
    correctIndex: 0,
    hint: 'Separate items in a list with commas.'
  },
  {
    suffix: 'gram-past',
    title: 'Past Tense',
    question: 'Yesterday we ___ to the lake.',
    choices: ['walked', 'walk', 'walking'],
    correctIndex: 0,
    hint: 'Past tense often ends in -ed.'
  }
];

export const EXTRA_VOCAB = [
  {
    suffix: 'vocab-syn-1',
    title: 'Synonyms: big',
    question: 'Which word means almost the same as big?',
    choices: ['large', 'tiny', 'slow'],
    correctIndex: 0,
    hint: 'Synonyms have similar meanings.'
  },
  {
    suffix: 'vocab-syn-2',
    title: 'Synonyms: fast',
    question: 'Which word is like fast?',
    choices: ['quick', 'heavy', 'quiet'],
    correctIndex: 0,
    hint: 'Quick and fast are synonyms.'
  },
  {
    suffix: 'vocab-ant-1',
    title: 'Antonyms: happy',
    question: 'Sad is the opposite of ___.',
    choices: ['happy', 'glad', 'joyful'],
    correctIndex: 0,
    hint: 'Antonyms mean the opposite.'
  },
  {
    suffix: 'vocab-ctx-3',
    title: 'Context Clues',
    question: 'The puppy was very ___. It wagged its tail and licked my hand.',
    choices: ['friendly', 'angry', 'sleepy'],
    correctIndex: 0,
    hint: 'Use clues in the sentence.'
  },
  {
    suffix: 'vocab-ctx-4',
    title: 'Shades of Meaning',
    question: 'Which word is stronger than said?',
    choices: ['shouted', 'whispered', 'mumbled'],
    correctIndex: 0,
    hint: 'Shouted is louder than said.'
  },
  {
    suffix: 'vocab-root',
    title: 'Word Parts',
    question: 'Unhappy means not happy. Unpack means ___.',
    choices: ['not packed', 'very packed', 'packed again'],
    correctIndex: 0,
    hint: 'Un- often means not.'
  },
  {
    suffix: 'vocab-homo',
    title: 'Multiple Meanings',
    question: 'Bat can mean an animal or a sports tool. In "The bat flew at night," bat means ___.',
    choices: ['animal', 'sports tool', 'building'],
    correctIndex: 0,
    hint: 'Read the whole sentence.'
  },
  {
    suffix: 'vocab-prefix',
    question: 'Rewrite means to write again. Reread means ___.',
    title: 'Prefixes re-',
    choices: ['read again', 'read once', 'not read'],
    correctIndex: 0,
    hint: 'Re- means again.'
  }
];

export const EXTRA_WRITING = [
  {
    suffix: 'write-prompt-2',
    title: 'Write About a Friend',
    prompt: 'Describe a friend and what you like to do together.',
    minWords: 25,
    difficulty: 'intermediate'
  },
  {
    suffix: 'write-prompt-3',
    title: 'Write a How-To',
    prompt: 'Explain how to make a simple snack step by step.',
    minWords: 30,
    difficulty: 'intermediate'
  },
  {
    suffix: 'write-prompt-4',
    title: 'Write an Opinion',
    prompt: 'What is the best season? Give reasons for your choice.',
    minWords: 35,
    difficulty: 'advanced'
  },
  {
    suffix: 'write-prompt-5',
    title: 'Write a Letter',
    prompt: 'Write a short letter thanking someone who helped you.',
    minWords: 40,
    difficulty: 'advanced'
  }
];

export const COMPREHENSION_BY_GRADE = {
  '1': [
    {
      suffix: 'comp-p800-1',
      title: 'The Red Hen',
      passage: 'The red hen ran to the pen. She found corn in the pen. The hen ate the corn.',
      questions: [
        { question: 'What color is the hen?', choices: ['red', 'blue', 'green'], correctIndex: 0 },
        { question: 'What did the hen eat?', choices: ['corn', 'fish', 'bread'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-2',
      title: 'My Dog Rex',
      passage: 'Rex is my dog. He likes to fetch balls. We play in the yard every day.',
      questions: [
        { question: 'What is the dog\'s name?', choices: ['Rex', 'Max', 'Sam'], correctIndex: 0 },
        { question: 'Where do they play?', choices: ['yard', 'school', 'store'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-3',
      title: 'Rainy Day',
      passage: 'It rained all morning. We stayed inside and read books. After lunch the sun came out.',
      questions: [
        { question: 'What did they do inside?', choices: ['read books', 'swim', 'run'], correctIndex: 0 },
        { question: 'When did the sun come out?', choices: ['after lunch', 'at night', 'never'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-4',
      title: 'The Big Tree',
      passage: 'A big oak tree grows near our school. Birds nest in its branches. We sit in its shade at recess.',
      questions: [
        { question: 'What kind of tree is it?', choices: ['oak', 'palm', 'pine'], correctIndex: 0 },
        { question: 'Who nests in the tree?', choices: ['birds', 'fish', 'cats'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-5',
      title: 'Making Soup',
      passage: 'Mom chopped carrots and potatoes. She put them in a pot with water. Soon the soup smelled good.',
      questions: [
        { question: 'What vegetables did Mom chop?', choices: ['carrots and potatoes', 'apples', 'rice'], correctIndex: 0 },
        { question: 'How did the soup smell?', choices: ['good', 'bad', 'loud'], correctIndex: 0 }
      ]
    }
  ],
  '2': [
    {
      suffix: 'comp-p800-1',
      title: 'The Lost Mitten',
      passage: 'Emma lost her blue mitten on the bus. She told the driver, who kept it in a box. The next day Emma got it back and smiled.',
      questions: [
        { question: 'What did Emma lose?', choices: ['a mitten', 'a hat', 'a book'], correctIndex: 0 },
        { question: 'Who helped Emma?', choices: ['the bus driver', 'a cat', 'her brother'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-2',
      title: 'Planting Seeds',
      passage: 'Our class planted sunflower seeds in cups. We watered them every day. After two weeks, green shoots appeared.',
      questions: [
        { question: 'What seeds did they plant?', choices: ['sunflower', 'corn', 'bean'], correctIndex: 0 },
        { question: 'When did shoots appear?', choices: ['after two weeks', 'the same day', 'after a year'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-3',
      title: 'The Library Trip',
      passage: 'We walked quietly to the library. Each student picked one book to borrow. We promised to return them in two weeks.',
      questions: [
        { question: 'How did they walk to the library?', choices: ['quietly', 'loudly', 'quickly running'], correctIndex: 0 },
        { question: 'How long can they keep the books?', choices: ['two weeks', 'one day', 'one year'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-4',
      title: 'Snow Day Fun',
      passage: 'Snow covered the ground overnight. Jake built a snow fort with his sister. They drank hot cocoa when their fingers got cold.',
      questions: [
        { question: 'What did Jake build?', choices: ['a snow fort', 'a sand castle', 'a kite'], correctIndex: 0 },
        { question: 'What did they drink?', choices: ['hot cocoa', 'juice', 'soda'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-5',
      title: 'The Broken Crayon',
      passage: 'Lina\'s favorite crayon broke in half. She taped the pieces together. It still colored just fine.',
      questions: [
        { question: 'What broke?', choices: ['a crayon', 'a pencil', 'a ruler'], correctIndex: 0 },
        { question: 'How did Lina fix it?', choices: ['with tape', 'with glue only', 'she threw it away'], correctIndex: 0 }
      ]
    }
  ],
  '3': [
    {
      suffix: 'comp-p800-1',
      title: 'The Science Fair',
      passage: 'Marcus built a volcano model for the science fair. He mixed baking soda and vinegar to make it erupt. The judges gave him a blue ribbon for clear explanation.',
      questions: [
        { question: 'What did Marcus build?', choices: ['a volcano model', 'a robot', 'a bridge'], correctIndex: 0 },
        { question: 'What award did he win?', choices: ['a blue ribbon', 'a gold medal', 'nothing'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-2',
      title: 'Migrating Geese',
      passage: 'Every autumn, geese fly south in a V shape. They travel hundreds of miles to find warmer weather. In spring they return north to nest.',
      questions: [
        { question: 'When do geese fly south?', choices: ['autumn', 'summer', 'winter only'], correctIndex: 0 },
        { question: 'Why do they migrate?', choices: ['for warmer weather', 'to sleep', 'to hide'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-3',
      title: 'The Community Garden',
      passage: 'Neighbors worked together on a community garden. They shared tools and took turns watering. By summer, tomatoes and peppers were ready to harvest.',
      questions: [
        { question: 'Who worked on the garden?', choices: ['neighbors', 'only one person', 'robots'], correctIndex: 0 },
        { question: 'What vegetables grew?', choices: ['tomatoes and peppers', 'only grass', 'apples'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-4',
      title: 'Learning to Swim',
      passage: 'At first Ava was afraid of the deep end. Her coach taught her to float and kick slowly. By the end of the month she swam across the pool.',
      questions: [
        { question: 'What was Ava afraid of?', choices: ['the deep end', 'the snack bar', 'homework'], correctIndex: 0 },
        { question: 'What could she do by the end of the month?', choices: ['swim across the pool', 'dive only', 'nothing'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-5',
      title: 'The Time Capsule',
      passage: 'Our class buried a time capsule behind the school. We put in drawings, a class photo, and a letter to future students. We will open it in ten years.',
      questions: [
        { question: 'Where did they bury the capsule?', choices: ['behind the school', 'in the ocean', 'at home'], correctIndex: 0 },
        { question: 'When will they open it?', choices: ['in ten years', 'tomorrow', 'never'], correctIndex: 0 }
      ]
    }
  ],
  '4': [
    {
      suffix: 'comp-p800-1',
      title: 'The Inventor\'s Journal',
      passage: 'Dr. Chen kept a journal of every experiment, even failures. She believed mistakes taught her what not to try next. Her persistence led to a new kind of battery.',
      questions: [
        { question: 'What did Dr. Chen record?', choices: ['experiments', 'recipes', 'songs'], correctIndex: 0 },
        { question: 'What did she invent?', choices: ['a new battery', 'a bicycle', 'a map'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-2',
      title: 'The Underground Railroad',
      passage: 'Harriet Tubman helped enslaved people escape to freedom in the North. She made many dangerous trips along secret routes. Her courage saved many lives.',
      questions: [
        { question: 'Who is this passage about?', choices: ['Harriet Tubman', 'George Washington', 'a fictional character'], correctIndex: 0 },
        { question: 'Where did people escape to?', choices: ['the North', 'the ocean', 'Europe only'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-3',
      title: 'Coral Reefs',
      passage: 'Coral reefs shelter thousands of marine species. Rising ocean temperatures can bleach coral, turning it white and weak. Scientists study reefs to protect them.',
      questions: [
        { question: 'What lives in coral reefs?', choices: ['many marine species', 'only birds', 'desert plants'], correctIndex: 0 },
        { question: 'What bleaches coral?', choices: ['rising temperatures', 'cold ice', 'wind only'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-4',
      title: 'The Debate Club',
      passage: 'Debate club members research both sides of an issue before arguing. They must listen respectfully to opponents and support claims with evidence.',
      questions: [
        { question: 'What must debaters use?', choices: ['evidence', 'only opinions', 'no research'], correctIndex: 0 },
        { question: 'How should they treat opponents?', choices: ['respectfully', 'rudely', 'they should ignore them'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-5',
      title: 'Wind Power',
      passage: 'Wind turbines convert moving air into electricity without burning fuel. Some communities place them on hills or offshore where winds are steady.',
      questions: [
        { question: 'What do turbines produce?', choices: ['electricity', 'water', 'coal'], correctIndex: 0 },
        { question: 'Where are turbines often placed?', choices: ['on hills or offshore', 'underground only', 'inside classrooms'], correctIndex: 0 }
      ]
    }
  ],
  '5': [
    {
      suffix: 'comp-p800-1',
      title: 'The Constitution',
      passage: 'The U.S. Constitution establishes the framework of government and protects citizens\' rights. The Bill of Rights lists freedoms such as speech and religion.',
      questions: [
        { question: 'What does the Constitution establish?', choices: ['government framework', 'sports rules', 'recipes'], correctIndex: 0 },
        { question: 'What lists specific freedoms?', choices: ['Bill of Rights', 'shopping list', 'map legend'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-2',
      title: 'Photosynthesis',
      passage: 'Plants use sunlight, water, and carbon dioxide to make sugar and release oxygen. This process called photosynthesis supports most life on Earth.',
      questions: [
        { question: 'What gas do plants release?', choices: ['oxygen', 'smoke', 'nitrogen only'], correctIndex: 0 },
        { question: 'What is the process called?', choices: ['photosynthesis', 'evaporation', 'digestion'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-3',
      title: 'Primary Sources',
      passage: 'Historians compare primary sources like letters and diaries with secondary accounts. Primary sources were created by people who lived through events.',
      questions: [
        { question: 'Which is a primary source?', choices: ['a diary from the event', 'a textbook summary', 'a fictional movie'], correctIndex: 0 },
        { question: 'Who creates primary sources?', choices: ['people who lived through events', 'future robots', 'only artists'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-4',
      title: 'Metaphor and Simile',
      passage: 'A simile compares using like or as: "brave as a lion." A metaphor states a comparison directly: "time is money." Both help readers visualize ideas.',
      questions: [
        { question: 'Which uses like or as?', choices: ['simile', 'metaphor', 'noun'], correctIndex: 0 },
        { question: 'What do these figures of speech do?', choices: ['help visualize ideas', 'count syllables', 'spell words'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-5',
      title: 'Supply and Demand',
      passage: 'When supply of a product is low and demand is high, prices often rise. When many sellers offer the same item, competition may lower prices.',
      questions: [
        { question: 'What happens when supply is low and demand high?', choices: ['prices often rise', 'prices always fall', 'nothing changes'], correctIndex: 0 },
        { question: 'What can competition do?', choices: ['lower prices', 'stop all sales', 'remove demand'], correctIndex: 0 }
      ]
    }
  ],
  '6': [
    {
      suffix: 'comp-p800-1',
      title: 'Rhetorical Appeals',
      passage: 'Speakers use ethos (credibility), pathos (emotion), and logos (logic) to persuade audiences. Strong arguments often combine all three thoughtfully.',
      questions: [
        { question: 'Which appeal uses logic?', choices: ['logos', 'pathos', 'ethos only'], correctIndex: 0 },
        { question: 'What does ethos refer to?', choices: ['credibility', 'weather', 'grammar'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-2',
      title: 'Climate Change',
      passage: 'Greenhouse gases trap heat in the atmosphere. Human activities have increased these gases, contributing to global temperature rise and shifting weather patterns.',
      questions: [
        { question: 'What do greenhouse gases trap?', choices: ['heat', 'sound', 'light only'], correctIndex: 0 },
        { question: 'What has contributed to temperature rise?', choices: ['human activities', 'only volcanoes', 'the moon'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-3',
      title: 'Theme in Literature',
      passage: 'Theme is the central message or insight about life that a story conveys. It is not the same as the topic; theme requires inference from events and characters.',
      questions: [
        { question: 'Theme is the story\'s ___.', choices: ['central message', 'setting', 'title'], correctIndex: 0 },
        { question: 'How do readers find theme?', choices: ['by inference', 'by counting pages', 'from the cover only'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-4',
      title: 'Democracy and Voting',
      passage: 'In a representative democracy, citizens elect officials to make laws. Voting is both a right and a responsibility that shapes community decisions.',
      questions: [
        { question: 'How are officials chosen?', choices: ['citizens elect them', 'they inherit power', 'random lottery only'], correctIndex: 0 },
        { question: 'Voting is a right and a ___.', choices: ['responsibility', 'punishment', 'game'], correctIndex: 0 }
      ]
    },
    {
      suffix: 'comp-p800-5',
      title: 'Reliable Sources',
      passage: 'Evaluate online sources by checking the author, publication date, and evidence cited. Sites that sensationalize claims without proof are less trustworthy.',
      questions: [
        { question: 'What should you check?', choices: ['author and date', 'font color only', 'number of ads'], correctIndex: 0 },
        { question: 'Sites without proof are ___.', choices: ['less trustworthy', 'always best', 'illegal always'], correctIndex: 0 }
      ]
    }
  ]
};

export const SPEAK_SENTENCES_BY_GRADE = {
  K: [
    { suffix: 'speak-p800-1', title: 'Say: I see a cat.', sentences: ['I see a cat.'] },
    { suffix: 'speak-p800-2', title: 'Say: We go to school.', sentences: ['We go to school.'] },
    { suffix: 'speak-p800-3', title: 'Say: The sun is hot.', sentences: ['The sun is hot.'] }
  ],
  '1': [
    { suffix: 'speak-p800-1', title: 'Say: I like to read.', sentences: ['I like to read.'] },
    { suffix: 'speak-p800-2', title: 'Say: My dog runs fast.', sentences: ['My dog runs fast.'] },
    { suffix: 'speak-p800-3', title: 'Say: We play at recess.', sentences: ['We play at recess.'] }
  ],
  '2': [
    { suffix: 'speak-p800-1', title: 'Say: Birds fly in the sky.', sentences: ['Birds fly in the sky.'] },
    { suffix: 'speak-p800-2', title: 'Say: I finished my homework.', sentences: ['I finished my homework.'] },
    { suffix: 'speak-p800-3', title: 'Say: Spring brings new flowers.', sentences: ['Spring brings new flowers.'] }
  ],
  '3': [
    { suffix: 'speak-p800-1', title: 'Say: Science helps us learn.', sentences: ['Science helps us learn.'] },
    { suffix: 'speak-p800-2', title: 'Say: We respect our classmates.', sentences: ['We respect our classmates.'] },
    { suffix: 'speak-p800-3', title: 'Say: The library is quiet.', sentences: ['The library is quiet.'] }
  ],
  '4': [
    { suffix: 'speak-p800-1', title: 'Say: History teaches us about the past.', sentences: ['History teaches us about the past.'] },
    { suffix: 'speak-p800-2', title: 'Say: I will revise my draft.', sentences: ['I will revise my draft.'] },
    { suffix: 'speak-p800-3', title: 'Say: Teamwork makes projects better.', sentences: ['Teamwork makes projects better.'] }
  ],
  '5': [
    { suffix: 'speak-p800-1', title: 'Say: Evidence supports our claim.', sentences: ['Evidence supports our claim.'] },
    { suffix: 'speak-p800-2', title: 'Say: I compare two sources carefully.', sentences: ['I compare two sources carefully.'] },
    { suffix: 'speak-p800-3', title: 'Say: Clear writing helps the reader.', sentences: ['Clear writing helps the reader.'] }
  ],
  '6': [
    { suffix: 'speak-p800-1', title: 'Say: Democracy depends on informed citizens.', sentences: ['Democracy depends on informed citizens.'] },
    { suffix: 'speak-p800-2', title: 'Say: I analyze the author\'s purpose.', sentences: ['I analyze the author\'s purpose.'] },
    { suffix: 'speak-p800-3', title: 'Say: Strong arguments use credible sources.', sentences: ['Strong arguments use credible sources.'] }
  ]
};

export const SPEAK_PASSAGES_BY_GRADE = {
  '3': [
    {
      suffix: 'speak-pass-p800-1',
      title: 'Read Aloud: Morning Routine',
      text: 'Every morning I brush my teeth, eat breakfast, and pack my backpack. Then I walk to the bus stop with my neighbor.'
    },
    {
      suffix: 'speak-pass-p800-2',
      title: 'Read Aloud: The Garden',
      text: 'Our garden has tomatoes, beans, and herbs. We water the plants in the evening when the sun is not too hot.'
    }
  ],
  '4': [
    {
      suffix: 'speak-pass-p800-1',
      title: 'Read Aloud: National Parks',
      text: 'National parks protect forests, deserts, and mountains for future generations. Visitors follow rules to keep wildlife safe.'
    },
    {
      suffix: 'speak-pass-p800-2',
      title: 'Read Aloud: Invention',
      text: 'Many inventions begin with a simple question. Inventors test ideas, learn from failure, and improve designs over time.'
    }
  ],
  '5': [
    {
      suffix: 'speak-pass-p800-1',
      title: 'Read Aloud: Ecosystems',
      text: 'An ecosystem includes living organisms and their physical environment. Changes to one part can affect the entire system.'
    },
    {
      suffix: 'speak-pass-p800-2',
      title: 'Read Aloud: Biography',
      text: 'Biographies describe real people\'s lives using facts from letters, interviews, and historical records.'
    }
  ],
  '6': [
    {
      suffix: 'speak-pass-p800-1',
      title: 'Read Aloud: Civil Rights',
      text: 'The civil rights movement used peaceful protest and legal action to challenge unfair laws and expand voting rights.'
    },
    {
      suffix: 'speak-pass-p800-2',
      title: 'Read Aloud: Media Literacy',
      text: 'Critical readers ask who created a message, what evidence supports it, and what the author wants them to believe.'
    }
  ]
};

export const SENTENCE_BUILDERS_BY_GRADE = {
  '1': [
    { suffix: 'sent-p800-1', title: 'Build: The dog runs.', sentence: 'The dog runs.' },
    { suffix: 'sent-p800-2', title: 'Build: I see a bird.', sentence: 'I see a bird.' },
    { suffix: 'sent-p800-3', title: 'Build: We like milk.', sentence: 'We like milk.' }
  ],
  '2': [
    { suffix: 'sent-p800-1', title: 'Build: The cat sat on the rug.', sentence: 'The cat sat on the rug.' },
    { suffix: 'sent-p800-2', title: 'Build: My friend helps me.', sentence: 'My friend helps me.' },
    { suffix: 'sent-p800-3', title: 'Build: We read every night.', sentence: 'We read every night.' }
  ],
  '3': [
    { suffix: 'sent-p800-1', title: 'Build: The brave firefighter saved the kitten.', sentence: 'The brave firefighter saved the kitten.' },
    { suffix: 'sent-p800-2', title: 'Build: Students studied for the spelling test.', sentence: 'Students studied for the spelling test.' },
    { suffix: 'sent-p800-3', title: 'Build: Rain fell on the playground.', sentence: 'Rain fell on the playground.' }
  ],
  '4': [
    { suffix: 'sent-p800-1', title: 'Build: Although it rained, we played indoors.', sentence: 'Although it rained, we played indoors.' },
    { suffix: 'sent-p800-2', title: 'Build: The explorer mapped the river carefully.', sentence: 'The explorer mapped the river carefully.' },
    { suffix: 'sent-p800-3', title: 'Build: Bees pollinate many flowering plants.', sentence: 'Bees pollinate many flowering plants.' }
  ],
  '5': [
    { suffix: 'sent-p800-1', title: 'Build: Consequently, the team revised its plan.', sentence: 'Consequently, the team revised its plan.' },
    { suffix: 'sent-p800-2', title: 'Build: The evidence supports a different conclusion.', sentence: 'The evidence supports a different conclusion.' },
    { suffix: 'sent-p800-3', title: 'Build: Readers should verify facts before sharing.', sentence: 'Readers should verify facts before sharing.' }
  ],
  '6': [
    { suffix: 'sent-p800-1', title: 'Build: Furthermore, the data suggest a trend.', sentence: 'Furthermore, the data suggest a trend.' },
    { suffix: 'sent-p800-2', title: 'Build: The author contrasts two opposing viewpoints.', sentence: 'The author contrasts two opposing viewpoints.' },
    { suffix: 'sent-p800-3', title: 'Build: Informed citizens participate in local elections.', sentence: 'Informed citizens participate in local elections.' }
  ]
};

export const PHONICS_BLENDS = [
  { suffix: 'phonics-p800-1', title: 'Blend: stop', targetWord: 'stop', tiles: ['s', 't', 'o', 'p'], prompt: 'Build the word stop' },
  { suffix: 'phonics-p800-2', title: 'Blend: frog', targetWord: 'frog', tiles: ['f', 'r', 'o', 'g'], prompt: 'Build the word frog' },
  { suffix: 'phonics-p800-3', title: 'Blend: clap', targetWord: 'clap', tiles: ['c', 'l', 'a', 'p'], prompt: 'Build the word clap' },
  { suffix: 'phonics-p800-4', title: 'Blend: train', targetWord: 'train', tiles: ['t', 'r', 'ai', 'n'], prompt: 'Build the word train' }
];

export const SIGHT_WORDS = [
  { suffix: 'sight-p800-1', title: 'Sight Word: because', word: 'because', sentence: 'I smiled because it was fun.' },
  { suffix: 'sight-p800-2', title: 'Sight Word: before', word: 'before', sentence: 'Wash your hands before lunch.' },
  { suffix: 'sight-p800-3', title: 'Sight Word: different', word: 'different', sentence: 'Each book tells a different story.' },
  { suffix: 'sight-p800-4', title: 'Sight Word: thought', word: 'thought', sentence: 'I thought about the answer.' },
  { suffix: 'sight-p800-5', title: 'Sight Word: enough', word: 'enough', sentence: 'We have enough time to finish.' }
];

export const PREK_PACK = {
  rhymes: [
    { suffix: 'rhyme-p800-6', prompt: 'tree', choices: ['bee', 'car', 'cup'], correctIndex: 0, title: 'Rhyme: tree' },
    { suffix: 'rhyme-p800-7', prompt: 'fish', choices: ['dish', 'dog', 'run'], correctIndex: 0, title: 'Rhyme: fish' },
    { suffix: 'rhyme-p800-8', prompt: 'king', choices: ['ring', 'book', 'sun'], correctIndex: 0, title: 'Rhyme: king' },
    { suffix: 'rhyme-p800-9', prompt: 'light', choices: ['night', 'day', 'hot'], correctIndex: 0, title: 'Rhyme: light' }
  ],
  syllables: [
    { suffix: 'syl-p800-6', prompt: 'robot', choices: ['2', '3', '4'], correctIndex: 0, title: 'Syllables: robot' },
    { suffix: 'syl-p800-7', prompt: 'watermelon', choices: ['3', '4', '5'], correctIndex: 1, title: 'Syllables: watermelon' },
    { suffix: 'syl-p800-8', prompt: 'pencil', choices: ['1', '2', '3'], correctIndex: 1, title: 'Syllables: pencil' },
    { suffix: 'syl-p800-9', prompt: 'hippopotamus', choices: ['4', '5', '6'], correctIndex: 1, title: 'Syllables: hippopotamus' }
  ],
  initials: [
    { suffix: 'init-p800-6', prompt: 'moon', choices: ['/m/', '/s/', '/t/'], correctIndex: 0, title: 'Start sound: /m/' },
    { suffix: 'init-p800-7', prompt: 'snake', choices: ['/s/', '/b/', '/p/'], correctIndex: 0, title: 'Start sound: /s/' },
    { suffix: 'init-p800-8', prompt: 'tiger', choices: ['/t/', '/f/', '/l/'], correctIndex: 0, title: 'Start sound: /t/' },
    { suffix: 'init-p800-9', prompt: 'flower', choices: ['/f/', '/m/', '/n/'], correctIndex: 0, title: 'Start sound: /f/' }
  ],
  letters: [
    { suffix: 'letter-p800-6', letter: 'D', choices: ['dog', 'sun', 'cat'], correctIndex: 0, title: 'Letter D' },
    { suffix: 'letter-p800-7', letter: 'G', choices: ['goat', 'bat', 'hen'], correctIndex: 0, title: 'Letter G' },
    { suffix: 'letter-p800-8', letter: 'H', choices: ['hat', 'pig', 'net'], correctIndex: 0, title: 'Letter H' },
    { suffix: 'letter-p800-9', letter: 'J', choices: ['jam', 'kite', 'log'], correctIndex: 0, title: 'Letter J' }
  ],
  pictures: [
    { suffix: 'pic-p800-6', prompt: 'tree', choices: ['tree', 'car', 'shoe'], correctIndex: 0, title: 'Picture Word: tree' },
    { suffix: 'pic-p800-7', prompt: 'book', choices: ['book', 'ball', 'bed'], correctIndex: 0, title: 'Picture Word: book' },
    { suffix: 'pic-p800-8', prompt: 'star', choices: ['star', 'sock', 'spoon'], correctIndex: 0, title: 'Picture Word: star' },
    { suffix: 'pic-p800-9', prompt: 'house', choices: ['house', 'hand', 'heart'], correctIndex: 0, title: 'Picture Word: house' }
  ],
  speak: [
    { suffix: 'speak-p800-6', prompt: 'book', expectedText: 'book', title: 'Say: book' },
    { suffix: 'speak-p800-7', prompt: 'friend', expectedText: 'friend', title: 'Say: friend' },
    { suffix: 'speak-p800-8', prompt: 'thank you', expectedText: 'thank you', title: 'Say: thank you' },
    { suffix: 'speak-p800-9', prompt: 'butterfly', expectedText: 'butterfly', title: 'Say: butterfly' }
  ]
};

export const K_COMPREHENSION = [
  {
    suffix: 'comp-p800-1',
    title: 'The Yellow Bus',
    passage: 'The yellow bus stops at our corner. Kids line up with their backpacks. The driver smiles and says good morning.',
    questions: [
      { question: 'What color is the bus?', choices: ['yellow', 'red', 'blue'], correctIndex: 0 },
      { question: 'What do kids carry?', choices: ['backpacks', 'kites', 'boats'], correctIndex: 0 }
    ]
  },
  {
    suffix: 'comp-p800-2',
    title: 'Pet Fish',
    passage: 'We have a gold fish in a bowl. We feed it flakes twice a day. The fish swims in circles.',
    questions: [
      { question: 'What kind of pet?', choices: ['fish', 'dog', 'cat'], correctIndex: 0 },
      { question: 'What do they feed it?', choices: ['flakes', 'bread', 'candy'], correctIndex: 0 }
    ]
  },
  {
    suffix: 'comp-p800-3',
    title: 'Counting Blocks',
    passage: 'We count red and blue blocks at math time. There are ten blocks in all. We stack them into a tower.',
    questions: [
      { question: 'How many blocks in all?', choices: ['ten', 'two', 'one hundred'], correctIndex: 0 },
      { question: 'What colors are the blocks?', choices: ['red and blue', 'only green', 'black'], correctIndex: 0 }
    ]
  },
  {
    suffix: 'comp-p800-4',
    title: 'Art Time',
    passage: 'In art we use crayons and paper. Maya draws a house with a red door. She shares her picture with the class.',
    questions: [
      { question: 'What does Maya draw?', choices: ['a house', 'a car', 'a fish'], correctIndex: 0 },
      { question: 'What color is the door?', choices: ['red', 'purple', 'gray'], correctIndex: 0 }
    ]
  },
  {
    suffix: 'comp-p800-5',
    title: 'Recess Games',
    passage: 'At recess we play tag and hopscotch. When the bell rings, we line up quietly. Then we walk back to class.',
    questions: [
      { question: 'What games do they play?', choices: ['tag and hopscotch', 'chess only', 'video games'], correctIndex: 0 },
      { question: 'What do they do when the bell rings?', choices: ['line up', 'run away', 'sleep'], correctIndex: 0 }
    ]
  }
];

export const SPELLING_PACKS_BY_GRADE = {
  '1': [
    { suffix: 'spell-p800-1', title: 'Short Vowel Words', words: ['cat', 'bed', 'pig', 'cup', 'hot'] },
    { suffix: 'spell-p800-2', title: 'CVC Words Set 2', words: ['map', 'ten', 'log', 'run', 'sit'] }
  ],
  '2': [
    { suffix: 'spell-p800-1', title: 'Long Vowel Patterns', words: ['cake', 'bike', 'rope', 'cube', 'late'] },
    { suffix: 'spell-p800-2', title: 'Blends', words: ['stop', 'flag', 'clap', 'drum', 'snap'] }
  ],
  '3': [
    { suffix: 'spell-p800-1', title: 'Prefixes un- re-', words: ['undo', 'replay', 'unsafe', 'rewrite', 'unpack'] },
    { suffix: 'spell-p800-2', title: 'Suffixes -ful -less', words: ['helpful', 'careless', 'thankful', 'hopeless', 'painful'] }
  ],
  '4': [
    { suffix: 'spell-p800-1', title: 'Homophones', words: ['their', 'there', "they're", 'to', 'too'] },
    { suffix: 'spell-p800-2', title: 'Silent Letters', words: ['knight', 'write', 'comb', 'lamb', 'ghost'] }
  ],
  '5': [
    { suffix: 'spell-p800-1', title: 'Greek Roots', words: ['biology', 'telephone', 'photograph', 'autograph', 'microscope'] },
    { suffix: 'spell-p800-2', title: 'Latin Roots', words: ['transport', 'construct', 'predict', 'visible', 'audience'] }
  ],
  '6': [
    { suffix: 'spell-p800-1', title: 'Academic Vocabulary', words: ['analyze', 'evaluate', 'summarize', 'interpret', 'hypothesis'] },
    { suffix: 'spell-p800-2', title: 'Commonly Confused', words: ['accept', 'except', 'affect', 'effect', 'principal'] }
  ]
};

export const DICTATION_PACKS_BY_GRADE = {
  '1': [
    {
      suffix: 'dict-p800-1',
      title: 'Morning at Home',
      text: 'I wake up. I eat eggs and toast. Then I go to school.',
      hint: 'Listen for short sentences.'
    },
    {
      suffix: 'dict-p800-2',
      title: 'The Park',
      text: 'We see ducks in the pond. The ducks swim and quack.',
      hint: 'Write what you hear.'
    }
  ],
  '2': [
    {
      suffix: 'dict-p800-1',
      title: 'Helping in the Kitchen',
      text: 'Mom mixes flour and eggs. We bake muffins for snack time.',
      hint: 'Listen for action words.'
    },
    {
      suffix: 'dict-p800-2',
      title: 'A Windy Day',
      text: 'The wind blew leaves across the yard. We wore jackets outside.',
      hint: 'Past tense: blew, wore.'
    }
  ],
  '3': [
    {
      suffix: 'dict-p800-1',
      title: 'The Museum Trip',
      text: 'Our class visited the history museum. We saw dinosaur bones and old tools.',
      hint: 'Two sentences about a trip.'
    },
    {
      suffix: 'dict-p800-2',
      title: 'After the Storm',
      text: 'Lightning flashed during the storm. Afterwards, a rainbow appeared in the sky.',
      hint: 'Watch spelling of afterwards.'
    }
  ],
  '4': [
    {
      suffix: 'dict-p800-1',
      title: 'The Orchestra',
      text: 'The orchestra tuned their instruments before the concert. Violins, cellos, and flutes played together beautifully.',
      hint: 'Musical vocabulary.'
    },
    {
      suffix: 'dict-p800-2',
      title: 'Recycling Project',
      text: 'Students collected bottles and paper for recycling. The project reduced waste at school.',
      hint: 'Focus on longer words.'
    }
  ],
  '5': [
    {
      suffix: 'dict-p800-1',
      title: 'The Debate',
      text: 'Teams researched renewable energy before the debate. Each speaker cited facts to support their position.',
      hint: 'Academic sentence structure.'
    },
    {
      suffix: 'dict-p800-2',
      title: 'Space Exploration',
      text: 'Rovers explore distant planets and send data back to Earth. Scientists analyze the information for signs of water.',
      hint: 'Science vocabulary.'
    }
  ],
  '6': [
    {
      suffix: 'dict-p800-1',
      title: 'The Essay Draft',
      text: 'The author revised her essay to strengthen the thesis. She added transitions between paragraphs for clarity.',
      hint: 'Writing process terms.'
    },
    {
      suffix: 'dict-p800-2',
      title: 'Community Service',
      text: 'Volunteers organized a food drive for families in need. Their efforts provided meals during the holiday season.',
      hint: 'Formal tone and vocabulary.'
    }
  ]
};
