/**
 * lessons.js — SOURCE OF TRUTH
 *
 * This is the only file you edit to add/change curriculum content.
 * Everything else (questions, audio scripts, image downloads) flows from this.
 *
 * Topic types:
 *   'standard' — templates use {word} to substitute from the vocab array (default)
 *   'family'   — special structure: members array with role/names/has fields
 *
 * expects values (tell Claude what kind of answer to grade):
 *   'yes-no'     — yes or no
 *   'emotion'    — any emotion word from the vocab
 *   'ability'    — can / can't + any ability word
 *   'name'       — a specific person's name
 *   'open'       — free-form, Claude judges naturally
 *   'photo-name' — Santiago sees one photo and names it (types the word)
 *   'photo-pick' — Santiago sees 6 photos and clicks the correct one
 */

export const LESSONS = [

  // ─── Feelings & Emotions ─────────────────────────────────────────────────────

  {
    group: 'People & Feelings',
    id: 'feelings',
    label: 'Feelings & Emotions',
    type: 'standard',
    vocab: [
      'hungry', 'angry', 'happy', 'sad', 'scared',
      'surprised', 'thirsty', 'tired', 'sick', 'sleepy',
      'confused', 'hot', 'cold',
    ],
    templates: [
      { text: 'How do you feel today?',       expects: 'emotion'              },
      { text: 'Do you feel {word} today?',     expects: 'yes-no', hint: '{word}' },
      { text: 'Do you feel {word} right now?', expects: 'yes-no', hint: '{word}' },
    ],
  },

  // ─── Abilities ───────────────────────────────────────────────────────────────

  {
    group: 'Actions & Abilities',
    id: 'ability',
    label: 'Things I Can Do',
    type: 'standard',
    vocab: ['swim', 'fly', 'sing', 'run', 'jump', 'climb', 'stomp', 'dance', 'crawl'],
    templates: [
      { text: 'Can you {word}?',   expects: 'yes-no', hint: '{word}' },
      { text: 'What can you do?',  expects: 'ability'                },
      { text: "What can't you do?", expects: 'ability'               },
    ],
  },

  // ─── Family Members ──────────────────────────────────────────────────────────
  //
  // type: 'family' uses a different expansion — see questions.js.
  //
  // members:
  //   role   — the family title (lowercase)
  //   names  — correct answer(s). Multiple = any is accepted.
  //   has    — false means Santiago does NOT have this family member.
  //            Penny will ask "Do you have a {role}?" and expect "no".
  //
  // Templates available for family type:
  //   {role}  — substitutes the family role (e.g. "mom", "uncle")
  //   {name}  — substitutes the name(s) — see expansion logic in questions.js
  //   {has}   — substitutes "yes" or "no" based on the has field

  {
    group: 'People & Feelings',
    id: 'family',
    label: 'Family Members',
    type: 'family',
    members: [
      { role: 'mom',          names: ['Cecilia'],                              has: true  },
      { role: 'dad',          names: ['Josue'],                                has: true  },
      { role: 'uncle',        names: ['Chris'],                                has: true  },
      { role: 'aunt',         names: ['Natalie', 'Valentina', 'Valeria', 'Nadya'], has: true  },
      { role: 'brother',      names: ['Mateo'],                                has: true  },
      { role: 'sister',       names: [],                                       has: false },
      { role: 'cousin',       names: [],                                       has: false },
      { role: 'grandfather',  names: ['Alcides'],                              has: true  },
      { role: 'grandmother',  names: ['Marlene'],                              has: true  },
      { role: 'godparent',    names: ['Chris'],                                has: true  },
      { role: 'godmother',    names: ['Natalie'],                              has: true  },
      { role: 'baby brother', names: ['Mateo'],                                has: true  },
    ],
    templates: [
      // "Is Chris your uncle?" — only generated for members where has: true
      { text: 'Is {name} your {role}?',           expects: 'yes-no', hint: 'yes'   },
      // "What is the name of your mom?" — only for has: true
      { text: 'What is the name of your {role}?', expects: 'name',   hint: '{name}' },
      // "Do you have a sister?" — generated for ALL members (has: false → answer is "no")
      { text: 'Do you have a {role}?',            expects: 'yes-no', hint: '{has}'  },
    ],
  },

  // ─── Chess ───────────────────────────────────────────────────────────────────
  //
  // All words need searchQuery overrides — generic searches return wrong images
  // (e.g. "knight" → medieval knight, "bishop" → religious bishop, "queen" → person)

  {
    group: 'Games & Activities',
    id: 'chess',
    label: 'Chess',
    type: 'standard',
    vocab: [
      'chess board', 'pawn', 'knight', 'queen', 'king', 'rook', 'bishop', 'square', 'row', 'column',
    ],
    searchQuery: {
      'chess board': 'chess board game',
      'pawn':        'chess pawn piece',
      'knight':      'chess knight piece',
      'queen':       'chess queen piece',
      'king':        'chess king piece',
      'rook':        'chess rook castle piece',
      'bishop':      'chess bishop piece',
      'square':      'colored square shape',
      'row':         'grid row highlighted',
      'column':      'grid column highlighted',
    },
    templates: [
      { text: 'What chess word is this?',        expects: 'photo-name'               },
      { text: 'Which picture is the {word}?',   expects: 'photo-pick', hint: '{word}' },
    ],
  },

  // ─── Days & Months ───────────────────────────────────────────────────────────
  //
  // type: 'sequence' — special expansion in questions.js
  // before/after questions get their hints computed from position in the arrays (wraps around)
  // "What day is it?" and "What month is it?" have no hint — Claude knows today's real date

  {
    group: 'Time & Calendar',
    id: 'days-months',
    label: 'Days & Months',
    type: 'sequence',
    days:   ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    months: ['January','February','March','April','May','June',
             'July','August','September','October','November','December'],
    templates: [
      { text: 'What day of the week is it?',  expects: 'current-day'                          },
      { text: 'What month is it?',             expects: 'current-month'                        },
      { text: 'What day is after {day}?',      expects: 'sequence', seq: 'days',   dir: 'after'  },
      { text: 'What month is after {month}?',  expects: 'sequence', seq: 'months', dir: 'after'  },
      { text: 'What day is before {day}?',     expects: 'sequence', seq: 'days',   dir: 'before' },
      { text: 'What month is before {month}?', expects: 'sequence', seq: 'months', dir: 'before' },
    ],
  },

  // ─── Rooms of the House ──────────────────────────────────────────────────────

  {
    group: 'Home & Places',
    id: 'rooms',
    label: 'Rooms of the House',
    type: 'standard',
    vocab: [
      'living room', 'kitchen', 'bathroom', 'bedroom',
      'dining room', 'laundry room', 'garden', 'garage',
      'playroom', 'office',
    ],
    searchQuery: {
      'playroom': 'kids playroom toys',
    },
    templates: [
      // Shows ONE photo of a room — Santiago types the name
      { text: 'What room is this?',            expects: 'photo-name'              },
      // Shows 6 room photos — Santiago clicks the correct one
      { text: 'Which picture is the {word}?',  expects: 'photo-pick', hint: '{word}' },
    ],
  },

  // ─── Body Parts ──────────────────────────────────────────────────────────────
  //
  // Images: /public/santiago-learns-english/body-parts/{word}.jpg
  // EXCEPT 'butt' — drop cartoon image in manually as butt.jpg
  //
  // searchQuery overrides the Unsplash search term for ambiguous words
  // (e.g. "toe" alone returns abstract results — "human toe" is more specific)

  {
    group: 'My Body',
    id: 'body-parts',
    label: 'Body Parts',
    type: 'standard',
    vocab: [
      'hair', 'head', 'face', 'forehead', 'eyebrow', 'eyelash',
      'eye', 'ear', 'nose', 'cheek', 'mouth', 'lips', 'teeth',
      'tongue', 'chin', 'neck', 'shoulder', 'chest', 'arm',
      'elbow', 'stomach', 'wrist', 'hand', 'thumb', 'finger',
      'leg', 'knee', 'foot', 'toe', 'back', 'butt',
    ],
    // Override Unsplash search terms for words that return bad results
    searchQuery: {
      'eye':      'human eye close up',
      'ear':      'human ear close up',
      'cheek':    'human cheek face',
      'chin':     'human chin face',
      'chest':    'human chest torso',
      'elbow':    'elbow joint close up',
      'wrist':    'wrist hand close up',
      'thumb':    'thumb finger close up',
      'finger':   'finger hand close up',
      'toe':      'toe close up',
      'back':     'person back muscles',
      'butt':     null,  // SKIP — add a cartoon image manually to /santiago/images/vocab/butt.jpg
    },
    templates: [
      { text: 'What body part is this?',         expects: 'photo-name'               },
      { text: 'Which picture is the {word}?',    expects: 'photo-pick', hint: '{word}' },
    ],
  },

  // ─── Junk Food ───────────────────────────────────────────────────────────────
  //
  // Images live at chat-with-penny/images/junk-food/ (penny's copy)
  // Originals also exist at /santiago-learns-english/junk-food/ for the standalone junk-food app
  // imageMap connects each vocab word → its image path (filenames differ from vocab words)

  {
    group: 'Food & Things I Like',
    id: 'junk-food',
    label: 'Junk Food',
    type: 'standard',
    vocab: [
      'pizza', 'hamburgers', 'french fries', 'fried chicken', 'soda',
      'potato chips', 'candy', 'cupcakes', 'ice cream', 'milkshakes',
      'hot dogs', 'chocolate bars', 'donuts', 'popcorn', 'cake',
      'nuggets', 'pancakes', 'cotton candy', 'gum', 'lollipops',
      'gummy bears', 'marshmallows', 'popsicles', 'brownies', 'onion rings',
      'corn dogs', 'cookies', 'pretzels', 'syrup', 'whipped cream',
    ],
    imageMap: {
      'pizza':          '/santiago-learns-english/chat-with-penny/images/junk-food/pizza.jpg',
      'hamburgers':     '/santiago-learns-english/chat-with-penny/images/junk-food/hamburger.jpg',
      'french fries':   '/santiago-learns-english/chat-with-penny/images/junk-food/french-fries.jpg',
      'fried chicken':  '/santiago-learns-english/chat-with-penny/images/junk-food/fried-chicken.jpg',
      'soda':           '/santiago-learns-english/chat-with-penny/images/junk-food/soda.jpg',
      'potato chips':   '/santiago-learns-english/chat-with-penny/images/junk-food/chips.jpg',
      'candy':          '/santiago-learns-english/chat-with-penny/images/junk-food/candy.jpg',
      'cupcakes':       '/santiago-learns-english/chat-with-penny/images/junk-food/cupcake.jpg',
      'ice cream':      '/santiago-learns-english/chat-with-penny/images/junk-food/ice-cream.jpg',
      'milkshakes':     '/santiago-learns-english/chat-with-penny/images/junk-food/milkshake.jpg',
      'hot dogs':       '/santiago-learns-english/chat-with-penny/images/junk-food/hot-dog.png',
      'chocolate bars': '/santiago-learns-english/chat-with-penny/images/junk-food/chocolate-bar.jpg',
      'donuts':         '/santiago-learns-english/chat-with-penny/images/junk-food/donut.jpg',
      'popcorn':        '/santiago-learns-english/chat-with-penny/images/junk-food/popcorn.jpg',
      'cake':           '/santiago-learns-english/chat-with-penny/images/junk-food/cake.jpg',
      'nuggets':        '/santiago-learns-english/chat-with-penny/images/junk-food/nuggets.jpg',
      'pancakes':       '/santiago-learns-english/chat-with-penny/images/junk-food/pancakes.jpg',
      'cotton candy':   '/santiago-learns-english/chat-with-penny/images/junk-food/cotton-candy.jpg',
      'gum':            '/santiago-learns-english/chat-with-penny/images/junk-food/gum.jpg',
      'lollipops':      '/santiago-learns-english/chat-with-penny/images/junk-food/lollipop.jpg',
      'gummy bears':    '/santiago-learns-english/chat-with-penny/images/junk-food/gummy-bear.jpg',
      'marshmallows':   '/santiago-learns-english/chat-with-penny/images/junk-food/marshmallow.jpg',
      'popsicles':      '/santiago-learns-english/chat-with-penny/images/junk-food/popsicle.jpg',
      'brownies':       '/santiago-learns-english/chat-with-penny/images/junk-food/brownie.jpg',
      'onion rings':    '/santiago-learns-english/chat-with-penny/images/junk-food/onion-rings.jpg',
      'corn dogs':      '/santiago-learns-english/chat-with-penny/images/junk-food/corn-dog.jpg',
      'cookies':        '/santiago-learns-english/chat-with-penny/images/junk-food/cookies.png',
      'pretzels':       '/santiago-learns-english/chat-with-penny/images/junk-food/pretzel.jpg',
      'syrup':          '/santiago-learns-english/chat-with-penny/images/junk-food/syrup.jpg',
      'whipped cream':  '/santiago-learns-english/chat-with-penny/images/junk-food/whipped-cream.jpg',
    },
    templates: [
      { text: 'Do you like {word}?',       expects: 'yes-no',    hint: '{word}' },
      { text: 'What junk food is this?',    expects: 'photo-name'               },
      { text: 'Find the {word}!',           expects: 'photo-pick', hint: '{word}' },
    ],
  },

  // ─── Fruits ──────────────────────────────────────────────────────────────────

  {
    group: 'Food & Things I Like',
    id: 'fruits',
    label: 'Fruits',
    type: 'standard',
    vocab: [
      'apple', 'banana', 'orange', 'grape', 'pear',
      'strawberry', 'mango', 'watermelon', 'pineapple',
    ],
    templates: [
      { text: 'Is {word} your favorite fruit?',  expects: 'yes-no',    hint: '{word}' },
      { text: 'What fruit is this?',            expects: 'photo-name'              },
      { text: 'Find the {word}!',               expects: 'photo-pick', hint: '{word}' },
    ],
  },

  // ─── Breakfast ───────────────────────────────────────────────────────────────

  {
    group: 'Food & Things I Like',
    id: 'breakfast',
    label: 'Breakfast',
    type: 'standard',
    vocab: [
      'water', 'orange juice', 'yogurt', 'bread', 'cereal',
      'coffee', 'milk', 'honey', 'sugar', 'toast',
      'butter', 'jelly', 'oatmeal', 'avocado', 'cheese',
    ],
    templates: [
      { text: 'Do you like {word}?',              expects: 'yes-no',    hint: '{word}' },
      { text: 'What breakfast food is this?',      expects: 'photo-name'               },
      { text: 'Which picture is the {word}?',      expects: 'photo-pick', hint: '{word}' },
    ],
  },

  // ─── Weather ─────────────────────────────────────────────────────────────────

  {
    group: 'Nature & Weather',
    id: 'weather',
    label: 'Weather',
    type: 'standard',
    vocab: ['sunny', 'cloudy', 'stormy', 'windy', 'rainy', 'snowy'],
    templates: [
      { text: 'How is the weather today?',         expects: 'open'                       },
      { text: 'Is it {word} outside?',             expects: 'yes-no',   hint: '{word}'   },
      { text: 'How is the weather in the photo?',   expects: 'photo-name'                 },
      { text: 'Which picture is {word} weather?',  expects: 'photo-pick', hint: '{word}' },
    ],
  },

  // ─── Pets ────────────────────────────────────────────────────────────────────
  //
  // filterVocab restricts "pet or zoo animal?" to the animals where the answer is clear.
  // "Is a dog a pet or a zoo animal?" → hint: 'pet'

  {
    group: 'Animals',
    id: 'pets',
    label: 'Pets',
    type: 'standard',
    vocab: [
      'dog', 'cat', 'guinea pig', 'rabbit', 'chicken',
      'bird', 'parrot', 'fish', 'turtle',
    ],
    templates: [
      { text: 'Is a {word} a good pet?',               expects: 'yes-no',     hint: '{word}' },
      { text: 'What pet is this?',                     expects: 'photo-name'               },
      { text: 'Find the {word}!',                      expects: 'photo-pick', hint: '{word}' },
      { text: 'Is the {word} a pet or a zoo animal?',  expects: 'pet-or-zoo', hint: 'pet',
        filterVocab: ['dog', 'cat'] },
    ],
  },

  // ─── Zoo Animals ─────────────────────────────────────────────────────────────
  //
  // filterVocab restricts "pet or zoo animal?" to clear-cut zoo animals only.
  // "Is a tiger a pet or a zoo animal?" → hint: 'zoo animal'

  {
    group: 'Animals',
    id: 'zoo-animals',
    label: 'Zoo Animals',
    type: 'standard',
    vocab: [
      'tiger', 'lion', 'monkey', 'dolphin', 'crocodile',
      'elephant', 'zebra', 'bear', 'giraffe', 'penguin',
      'polar bear', 'hippo', 'snake', 'kangaroo', 'shark',
    ],
    templates: [
      { text: 'Do you like {word}s?',                  expects: 'yes-no',     hint: '{word}' },
      { text: 'What animal is this?',                  expects: 'photo-name'               },
      { text: 'Find the {word}!',                      expects: 'photo-pick', hint: '{word}' },
      { text: 'Is the {word} a pet or a zoo animal?',  expects: 'pet-or-zoo', hint: 'zoo animal',
        filterVocab: ['tiger', 'lion', 'elephant', 'bear'] },
    ],
  },

  // ─── Farm Animals ────────────────────────────────────────────────────────────

  {
    group: 'Animals',
    id: 'farm-animals',
    label: 'Farm Animals',
    type: 'standard',
    vocab: [
      'pig', 'sheep', 'cow', 'duck', 'hen',
      'horse', 'goat', 'rooster',
    ],
    templates: [
      { text: 'What animal is this?',       expects: 'photo-name'               },
      { text: 'Which picture is a {word}?', expects: 'photo-pick', hint: '{word}' },
    ],
  },

  // ─── Classroom Objects ───────────────────────────────────────────────────────

  {
    group: 'School & Learning',
    id: 'classroom',
    label: 'Classroom Objects',
    type: 'standard',
    vocab: [
      'ruler', 'book', 'notebook', 'pen', 'pencil',
      'crayon', 'eraser', 'desk', 'chair', 'backpack', 'glue',
    ],
    templates: [
      { text: 'What is this?',                expects: 'photo-name'               },
      { text: 'Find the {word}!',             expects: 'photo-pick', hint: '{word}' },
    ],
  },

  // ─── Shapes ──────────────────────────────────────────────────────────────────

  {
    group: 'Colors & Shapes',
    id: 'shapes',
    label: 'Shapes',
    type: 'standard',
    vocab: [
      'triangle', 'circle', 'square', 'rectangle', 'star',
      'diamond', 'pentagon', 'oval', 'heart', 'hexagon',
      'octagon', 'cross',
    ],
    templates: [
      { text: 'What shape is this?',          expects: 'photo-name'               },
      { text: 'Find the {word}!',             expects: 'photo-pick', hint: '{word}' },
    ],
  },

  // ─── Lunch & Dinner ──────────────────────────────────────────────────────────

  {
    group: 'Food & Things I Like',
    id: 'lunch-dinner',
    label: 'Lunch & Dinner',
    type: 'standard',
    vocab: [
      'rice', 'potato', 'chicken', 'beef', 'soup',
      'pasta', 'salad', 'sweet potato', 'tea', 'lemonade',
      'steak', 'lasagna', 'lentils', 'turkey', 'cocoa',
      'wine', 'beans', 'tuna',
    ],
    templates: [
      { text: 'Do you like {word}?',          expects: 'yes-no',    hint: '{word}' },
      { text: 'What food is this?',            expects: 'photo-name'               },
      { text: 'Which picture is the {word}?',  expects: 'photo-pick', hint: '{word}' },
    ],
  },

  // ─── Vegetables ──────────────────────────────────────────────────────────────

  {
    group: 'Food & Things I Like',
    id: 'vegetables',
    label: 'Vegetables',
    type: 'standard',
    vocab: [
      'broccoli', 'onion', 'carrot', 'tomato', 'corn',
      'cucumber', 'lettuce', 'pepper', 'garlic', 'spinach',
      'cabbage', 'beet', 'potato', 'sweet potato', 'peas', 'green beans',
    ],
    templates: [
      { text: 'Is {word} yummy or yucky?',      expects: 'yes-no',    hint: '{word}' },
      { text: 'What vegetable is this?',        expects: 'photo-name'               },
      { text: 'Find the {word}!',               expects: 'photo-pick', hint: '{word}' },
    ],
  },

];
