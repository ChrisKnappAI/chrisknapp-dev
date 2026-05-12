// Vocab phrases for Chat with Penny.
// 3 phrases per vocab word. Used after correct Type 1 / Type 2 answers.
// Keys match the Answer column in question-bank.csv exactly.

const VOCAB_PHRASES = {

  // --- Chess ---
  'chess board': [
    { en: 'A chess board has 64 squares!', es: '¡Un tablero de ajedrez tiene 64 casillas!' },
    { en: 'Chess board — black and white squares!', es: '¡Tablero de ajedrez — casillas negras y blancas!' },
    { en: 'Penny loves to play on the chess board!', es: '¡A Penny le encanta jugar en el tablero de ajedrez!' },
  ],
  'pawn': [
    { en: 'The pawn is the smallest piece!', es: '¡El peón es la pieza más pequeña!' },
    { en: 'Pawns move forward — never backward!', es: '¡Los peones avanzan — ¡nunca hacia atrás!' },
    { en: 'Penny loves the little pawn!', es: '¡A Penny le encanta el pequeño peón!' },
  ],
  'knight': [
    { en: 'Knight! It jumps in an L shape!', es: '¡Caballo! ¡Salta en forma de L!' },
    { en: 'The knight can jump over other pieces!', es: '¡El caballo puede saltar sobre otras piezas!' },
    { en: 'Knights are angry — careful!', es: '¡Los caballos están enojados — ¡cuidado!' },
  ],
  'queen': [
    { en: 'Queen! The most powerful piece!', es: '¡Reina! ¡La pieza más poderosa!' },
    { en: 'The queen can move anywhere!', es: '¡La reina puede moverse a cualquier lugar!' },
    { en: 'Penny wants to be the queen!', es: '¡Penny quiere ser la reina!' },
  ],
  'king': [
    { en: 'King! Keep him safe!', es: '¡Rey! ¡Mantenlo a salvo!' },
    { en: 'The king is the most important piece!', es: '¡El rey es la pieza más importante!' },
    { en: 'Penny says — protect the king!', es: '¡Penny dice — ¡protege al rey!' },
  ],
  'rook': [
    { en: 'Rook! It moves left, right, up, and down!', es: '¡Torre! ¡Se mueve a la izquierda, derecha, arriba y abajo!' },
    { en: 'The rook is shaped like a tower!', es: '¡La torre tiene forma de castillo!' },
    { en: 'This penguin loves the rook!', es: '¡A este pingüino le encanta la torre!' },
  ],
  'bishop': [
    { en: 'Bishop! It moves in a diagonal line!', es: '¡Alfil! ¡Se mueve en línea diagonal!' },
    { en: 'The bishop always stays on one color!', es: '¡El alfil siempre se queda en un solo color!' },
    { en: "Penny's favorite piece is the bishop!", es: '¡La pieza favorita de Penny es el alfil!' },
  ],
  'square': [
    { en: 'Square! Every chess board has 64 of them!', es: '¡Casilla! ¡Cada tablero tiene 64!' },
    { en: 'Each piece stands on one square!', es: '¡Cada pieza está en una casilla!' },
    { en: "Penny's chess square is black!", es: '¡La casilla de Penny es negra!' },
  ],
  'row': [
    { en: 'Row! It goes left and right!', es: '¡Fila! ¡Va de izquierda a derecha!' },
    { en: 'A chess board has 8 rows!', es: '¡Un tablero de ajedrez tiene 8 filas!' },
    { en: 'Penny counts every row on the board!', es: '¡Penny cuenta cada fila del tablero!' },
  ],
  'column': [
    { en: 'Column! It goes up and down!', es: '¡Columna! ¡Va de arriba a abajo!' },
    { en: 'A chess board has 8 columns!', es: '¡Un tablero de ajedrez tiene 8 columnas!' },
    { en: 'Count the columns with Penny — eight!', es: '¡Cuenta las columnas con Penny — ¡ocho!' },
  ],

  // --- Rooms ---
  'living room': [
    { en: 'Living room — where the family is!', es: '¡Sala — donde está la familia!' },
    { en: 'Sit and watch TV in the living room!', es: '¡Siéntate a ver televisión en la sala!' },
    { en: 'Penny wants to sit on your sofa!', es: '¡Penny quiere sentarse en tu sofá!' },
  ],
  'kitchen': [
    { en: 'Kitchen! This is where we cook food!', es: '¡Cocina! ¡Aquí cocinamos la comida!' },
    { en: 'The kitchen smells so good!', es: '¡La cocina huele tan rico!' },
    { en: 'Penny loves to eat in the kitchen!', es: '¡A Penny le encanta comer en la cocina!' },
  ],
  'bathroom': [
    { en: 'Bathroom! Wash your hands!', es: '¡Baño! ¡Lávate las manos!' },
    { en: 'Brush your teeth in the bathroom!', es: '¡Cepíllate los dientes en el baño!' },
    { en: 'Even penguins wash their hands!', es: '¡Hasta los pingüinos se lavan las manos!' },
  ],
  'bedroom': [
    { en: 'Bedroom! Time to sleep!', es: '¡Dormitorio! ¡Hora de dormir!' },
    { en: 'The bedroom is where you rest!', es: '¡El dormitorio es donde descansas!' },
    { en: 'Penny sleeps in a cold bedroom!', es: '¡Penny duerme en un dormitorio frío!' },
  ],
  'dining room': [
    { en: 'Dining room — where the family eats!', es: '¡Comedor — donde la familia come!' },
    { en: 'Sit at the table in the dining room!', es: '¡Siéntate en la mesa del comedor!' },
    { en: 'Penny wants to eat at your table!', es: '¡Penny quiere comer en tu mesa!' },
  ],
  'laundry room': [
    { en: 'Laundry room — for clean clothes!', es: '¡Lavandería — para ropa limpia!' },
    { en: 'Wash your clothes in the laundry room!', es: '¡Lava tu ropa en la lavandería!' },
    { en: 'Penny has no clothes to wash!', es: '¡Penny no tiene ropa que lavar!' },
  ],
  'garden': [
    { en: 'Garden! Where flowers and plants grow!', es: '¡Jardín! ¡Donde crecen flores y plantas!' },
    { en: 'Plants need sun and water to grow!', es: '¡Las plantas necesitan sol y agua para crecer!' },
    { en: 'Penny likes to walk in the garden!', es: '¡A Penny le gusta caminar en el jardín!' },
  ],
  'garage': [
    { en: 'Garage — where the car lives!', es: '¡Garaje — donde vive el carro!' },
    { en: 'The car is in the garage!', es: '¡El carro está en el garaje!' },
    { en: 'Penny does not have a car or a garage!', es: '¡Penny no tiene carro ni garaje!' },
  ],
  'playroom': [
    { en: 'Playroom — time to play!', es: '¡Cuarto de juegos — ¡hora de jugar!' },
    { en: 'Toys and games are in the playroom!', es: '¡Los juguetes y juegos están en el cuarto de juegos!' },
    { en: 'Penny wants to play in your playroom!', es: '¡Penny quiere jugar en tu cuarto de juegos!' },
  ],
  'office': [
    { en: 'Office — where grown-ups work!', es: '¡Oficina — donde trabajan los adultos!' },
    { en: 'Computers are in the office!', es: '¡Las computadoras están en la oficina!' },
    { en: 'Penny has an office in Antarctica!', es: '¡Penny tiene una oficina en la Antártida!' },
  ],

  // --- Body Parts ---
  'hair': [
    { en: 'Hair! On top of your head!', es: '¡Cabello! ¡En la cima de tu cabeza!' },
    { en: 'Your hair can be long or short!', es: '¡Tu cabello puede ser largo o corto!' },
    { en: 'Penguins have no hair — only feathers!', es: '¡Los pingüinos no tienen cabello — ¡solo plumas!' },
  ],
  'head': [
    { en: 'Head! Your brain is in there!', es: '¡Cabeza! ¡Tu cerebro está adentro!' },
    { en: 'Nod your head yes!', es: '¡Mueve la cabeza para decir sí!' },
    { en: 'Penny has a big round head!', es: '¡Penny tiene una cabeza grande y redonda!' },
  ],
  'face': [
    { en: 'Face! Let me see your smile!', es: '¡Cara! ¡Déjame ver tu sonrisa!' },
    { en: 'Your face has eyes, nose, and mouth!', es: '¡Tu cara tiene ojos, nariz y boca!' },
    { en: 'Penny has a cute black and white face!', es: '¡Penny tiene una cara bonita en blanco y negro!' },
  ],
  'forehead': [
    { en: 'Forehead — right above your eyes!', es: '¡Frente — justo encima de tus ojos!' },
    { en: 'Touch your forehead!', es: '¡Toca tu frente!' },
    { en: 'A big kiss on your forehead!', es: '¡Un gran beso en tu frente!' },
  ],
  'eyebrow': [
    { en: 'Eyebrow! Raise it up!', es: '¡Ceja! ¡Levántala!' },
    { en: 'Your eyebrows are above your eyes!', es: '¡Tus cejas están encima de tus ojos!' },
    { en: 'Penny raises one eyebrow when she is happy!', es: '¡Penny levanta una ceja cuando está feliz!' },
  ],
  'eyelash': [
    { en: 'Eyelash! They protect your eyes!', es: '¡Pestaña! ¡Protegen tus ojos!' },
    { en: 'Your eyelashes are long and beautiful!', es: '¡Tus pestañas son largas y hermosas!' },
    { en: 'Penny has big beautiful eyelashes!', es: '¡Penny tiene pestañas grandes y hermosas!' },
  ],
  'eye': [
    { en: 'Eye! Can you see me?', es: '¡Ojo! ¿Me puedes ver?' },
    { en: 'You have two eyes — left and right!', es: '¡Tienes dos ojos — izquierdo y derecho!' },
    { en: 'Penny has big round eyes!', es: '¡Penny tiene ojos grandes y redondos!' },
  ],
  'ear': [
    { en: 'Ear! Can you hear me?', es: '¡Oreja! ¿Me puedes escuchar?' },
    { en: 'You have two ears!', es: '¡Tienes dos orejas!' },
    { en: 'Penguins have very good ears!', es: '¡Los pingüinos tienen muy buenos oídos!' },
  ],
  'nose': [
    { en: 'Nose! What do you smell?', es: '¡Nariz! ¿Qué hueles?' },
    { en: 'Your nose is in the middle of your face!', es: '¡Tu nariz está en el centro de tu cara!' },
    { en: 'Penny has a yellow nose — like a beak!', es: '¡Penny tiene una nariz amarilla — como un pico!' },
  ],
  'cheek': [
    { en: 'Cheek! Touch your cheek!', es: '¡Mejilla! ¡Toca tu mejilla!' },
    { en: 'You have two cheeks — left and right!', es: '¡Tienes dos mejillas — izquierda y derecha!' },
    { en: 'Penny has pink cheeks!', es: '¡Penny tiene mejillas rosadas!' },
  ],
  'mouth': [
    { en: 'Mouth! Say the word again!', es: '¡Boca! ¡Di la palabra de nuevo!' },
    { en: 'Open your mouth big!', es: '¡Abre la boca bien grande!' },
    { en: 'Penny opens her mouth to eat fish!', es: '¡Penny abre la boca para comer pescado!' },
  ],
  'lips': [
    { en: 'Lips! Touch your lips!', es: '¡Labios! ¡Toca tus labios!' },
    { en: 'Your lips help you talk and eat!', es: '¡Tus labios te ayudan a hablar y comer!' },
    { en: 'Penny has orange lips!', es: '¡Penny tiene labios anaranjados!' },
  ],
  'teeth': [
    { en: 'Teeth! Brush them every day!', es: '¡Dientes! ¡Cepíllalos todos los días!' },
    { en: 'Brush your teeth two times a day!', es: '¡Cepíllate los dientes dos veces al día!' },
    { en: 'Penny says — brush your teeth!', es: '¡Penny dice — ¡cepíllate los dientes!' },
  ],
  'tongue': [
    { en: 'Tongue! Stick it out!', es: '¡Lengua! ¡Sácala!' },
    { en: 'Your tongue helps you taste food!', es: '¡Tu lengua te ayuda a saborear la comida!' },
    { en: 'Penny uses her tongue to eat fish!', es: '¡Penny usa su lengua para comer pescado!' },
  ],
  'chin': [
    { en: 'Chin! At the bottom of your face!', es: '¡Mentón! ¡En la parte baja de tu cara!' },
    { en: 'Touch your chin!', es: '¡Toca tu mentón!' },
    { en: 'Penny has a white chin!', es: '¡Penny tiene un mentón blanco!' },
  ],
  'neck': [
    { en: 'Neck! It holds your head up!', es: '¡Cuello! ¡Sostiene tu cabeza!' },
    { en: 'Turn your neck left and right!', es: '¡Gira el cuello a la izquierda y a la derecha!' },
    { en: 'Penny has a short neck!', es: '¡Penny tiene un cuello corto!' },
  ],
  'shoulder': [
    { en: 'Shoulder! Touch your shoulder!', es: '¡Hombro! ¡Toca tu hombro!' },
    { en: 'You have two shoulders!', es: '¡Tienes dos hombros!' },
    { en: 'Penny carries fish on her shoulder!', es: '¡Penny carga pescado en su hombro!' },
  ],
  'chest': [
    { en: 'Chest! Your heart is inside!', es: '¡Pecho! ¡Tu corazón está adentro!' },
    { en: 'Put your hand on your chest!', es: '¡Pon la mano en el pecho!' },
    { en: 'Penny has a big white chest!', es: '¡Penny tiene un pecho grande y blanco!' },
  ],
  'arm': [
    { en: 'Arm! Move it up and down!', es: '¡Brazo! ¡Muévelo hacia arriba y hacia abajo!' },
    { en: 'Wave your arm — hello!', es: '¡Mueve tu brazo — ¡hola!' },
    { en: "Penny's arms are her wings!", es: '¡Los brazos de Penny son sus alas!' },
  ],
  'elbow': [
    { en: 'Elbow! Bend your arm!', es: '¡Codo! ¡Dobla el brazo!' },
    { en: 'Touch your elbow!', es: '¡Toca tu codo!' },
    { en: 'Penny bends her elbow to swim fast!', es: '¡Penny dobla el codo para nadar rápido!' },
  ],
  'stomach': [
    { en: 'Stomach! Are you hungry?', es: '¡Estómago! ¿Tienes hambre?' },
    { en: 'Pat your stomach!', es: '¡Date una palmadita en el estómago!' },
    { en: "Penny's stomach is always hungry for fish!", es: '¡El estómago de Penny siempre tiene hambre de pescado!' },
  ],
  'wrist': [
    { en: 'Wrist! Turn it around!', es: '¡Muñeca! ¡Gírala!' },
    { en: 'The wrist connects your hand and arm!', es: '¡La muñeca conecta la mano y el brazo!' },
    { en: "Penny's wrist helps her swim!", es: '¡La muñeca de Penny la ayuda a nadar!' },
  ],
  'hand': [
    { en: 'Hand! Give me a high five!', es: '¡Mano! ¡Chócala!' },
    { en: 'You have two hands — left and right!', es: '¡Tienes dos manos — izquierda y derecha!' },
    { en: 'Penny has wings instead of hands!', es: '¡Penny tiene alas en vez de manos!' },
  ],
  'thumb': [
    { en: 'Thumbs up — great job!', es: '¡Pulgar arriba — ¡buen trabajo!' },
    { en: 'The thumb is the big finger!', es: '¡El pulgar es el dedo grande!' },
    { en: 'Give Penny a thumbs up!', es: '¡Dale un pulgar arriba a Penny!' },
  ],
  'finger': [
    { en: 'Finger! How many do you have?', es: '¡Dedo! ¿Cuántos tienes?' },
    { en: 'You have ten fingers — count them!', es: '¡Tienes diez dedos — ¡cuéntalos!' },
    { en: 'Penny has no fingers — only wings!', es: '¡Penny no tiene dedos — solo alas!' },
  ],
  'leg': [
    { en: 'Leg! Kick it up!', es: '¡Pierna! ¡Levántala!' },
    { en: 'Stand on one leg — can you?', es: '¡Párate en una pierna — ¿puedes?' },
    { en: 'Penny has short legs but swims fast!', es: '¡Penny tiene piernas cortas pero nada rápido!' },
  ],
  'knee': [
    { en: 'Knee! Touch your knee!', es: '¡Rodilla! ¡Toca tu rodilla!' },
    { en: 'The knee is in the middle of your leg!', es: '¡La rodilla está en el medio de la pierna!' },
    { en: 'Penny bends her knee to sit down!', es: '¡Penny dobla la rodilla para sentarse!' },
  ],
  'foot': [
    { en: 'Foot! Stomp it!', es: '¡Pie! ¡Golpéalo!' },
    { en: 'You have two feet — left and right!', es: '¡Tienes dos pies — izquierdo y derecho!' },
    { en: 'Penny has big orange feet!', es: '¡Penny tiene pies grandes y anaranjados!' },
  ],
  'toe': [
    { en: 'Toe! Wiggle them!', es: '¡Dedo del pie! ¡Muévelos!' },
    { en: 'You have five toes on each foot!', es: '¡Tienes cinco dedos en cada pie!' },
    { en: 'Penny has orange toes!', es: '¡Penny tiene dedos del pie anaranjados!' },
  ],
  'back': [
    { en: 'Back! Stand up straight!', es: '¡Espalda! ¡Párense derecho!' },
    { en: 'Your back holds you up all day!', es: '¡Tu espalda te sostiene todo el día!' },
    { en: 'Penny has a black back!', es: '¡Penny tiene una espalda negra!' },
  ],
  'butt': [
    { en: 'Butt! Sit down on it!', es: '¡Trasero! ¡Siéntate en él!' },
    { en: 'Everyone has a butt!', es: '¡Todo el mundo tiene trasero!' },
    { en: 'Penny sits on her butt on the ice!', es: '¡Penny se sienta en su trasero sobre el hielo!' },
  ],

  // --- Junk Food ---
  'pizza': [
    { en: 'Pizza! I love cheese!', es: '¡Pizza! ¡Me encanta el queso!' },
    { en: 'Pizza is red and yellow and delicious!', es: '¡La pizza es roja y amarilla y deliciosa!' },
    { en: 'Penny wants pizza right now!', es: '¡Penny quiere pizza ahora mismo!' },
  ],
  'hamburgers': [
    { en: 'Hamburger! Meat inside a bun!', es: '¡Hamburguesa! ¡Carne dentro de un pan!' },
    { en: 'Big and delicious hamburger!', es: '¡Grande y deliciosa hamburguesa!' },
    { en: 'Penny loves hamburgers!', es: '¡A Penny le encantan las hamburguesas!' },
  ],
  'french fries': [
    { en: 'French fries! Hot and golden!', es: '¡Papas fritas! ¡Calientes y doradas!' },
    { en: 'French fries are made from potatoes!', es: '¡Las papas fritas se hacen con papas!' },
    { en: 'Penny eats french fries with ketchup!', es: '¡Penny come papas fritas con ketchup!' },
  ],
  'fried chicken': [
    { en: 'Fried chicken! Hot and golden!', es: '¡Pollo frito! ¡Caliente y dorado!' },
    { en: 'Crispy fried chicken — so good!', es: '¡Pollo frito crujiente — ¡muy rico!' },
    { en: 'This penguin loves fried chicken!', es: '¡A este pingüino le encanta el pollo frito!' },
  ],
  'soda': [
    { en: 'Soda! Sweet and cold!', es: '¡Refresco! ¡Dulce y frío!' },
    { en: 'Soda has bubbles!', es: '¡El refresco tiene burbujas!' },
    { en: "Penny's favorite soda is orange!", es: '¡El refresco favorito de Penny es de naranja!' },
  ],
  'potato chips': [
    { en: 'Potato chips! So salty!', es: '¡Papitas! ¡Tan saladas!' },
    { en: 'Crunch crunch — potato chips!', es: '¡Crunch crunch — ¡papitas!' },
    { en: 'Penny loves potato chips!', es: '¡A Penny le encantan las papitas!' },
  ],
  'candy': [
    { en: 'Candy! Red, yellow, green!', es: '¡Dulces! ¡Rojos, amarillos, verdes!' },
    { en: 'Candy is very sweet!', es: '¡Los dulces son muy dulces!' },
    { en: "Penny's favorite candy is red!", es: '¡El dulce favorito de Penny es rojo!' },
  ],
  'cupcakes': [
    { en: 'Cupcakes! Little cakes for you!', es: '¡Pastelitos! ¡Pequeños pasteles para ti!' },
    { en: 'Pink and yellow cupcakes!', es: '¡Pastelitos rosados y amarillos!' },
    { en: 'Penny baked cupcakes for you!', es: '¡Penny horneó pastelitos para ti!' },
  ],
  'ice cream': [
    { en: 'Ice cream! Penguins love vanilla!', es: '¡Helado! ¡A los pingüinos les encanta la vainilla!' },
    { en: 'Cold and sweet ice cream!', es: '¡Helado frío y dulce!' },
    { en: 'What color is your ice cream?', es: '¿De qué color es tu helado?' },
  ],
  'milkshakes': [
    { en: 'This penguin does not like milkshakes!', es: '¡A este pingüino no le gustan los batidos!' },
    { en: 'Milkshake! Cold and sweet!', es: '¡Batido! ¡Frío y dulce!' },
    { en: 'Do you like chocolate milkshake?', es: '¿Te gusta el batido de chocolate?' },
  ],
  'hot dogs': [
    { en: 'Hot dog! Hot and delicious!', es: '¡Hot dog! ¡Caliente y delicioso!' },
    { en: 'A hot dog inside a bun!', es: '¡Un hot dog dentro de un pan!' },
    { en: 'Penny loves hot dogs!', es: '¡A Penny le encantan los hot dogs!' },
  ],
  'chocolate bars': [
    { en: 'Chocolate! So sweet!', es: '¡Chocolate! ¡Tan dulce!' },
    { en: 'Dark chocolate or milk chocolate?', es: '¿Chocolate oscuro o chocolate con leche?' },
    { en: "Penny's favorite food is chocolate!", es: '¡La comida favorita de Penny es el chocolate!' },
  ],
  'donuts': [
    { en: 'Donut! Round with a hole!', es: '¡Dona! ¡Redonda con un hoyo!' },
    { en: 'Pink donut with rainbow sprinkles!', es: '¡Dona rosada con chispas de colores!' },
    { en: 'Penny eats a donut every morning!', es: '¡Penny come una dona cada mañana!' },
  ],
  'popcorn': [
    { en: 'Popcorn! White and salty!', es: '¡Palomitas! ¡Blancas y saladas!' },
    { en: 'Pop pop pop — popcorn!', es: '¡Pop pop pop — ¡palomitas!' },
    { en: 'Penny eats popcorn at the movies!', es: '¡Penny come palomitas en el cine!' },
  ],
  'cake': [
    { en: 'Cake! Is it your birthday?', es: '¡Pastel! ¿Es tu cumpleaños?' },
    { en: 'Pink cake with candles!', es: '¡Pastel rosado con velas!' },
    { en: 'Penny made you a birthday cake!', es: '¡Penny te hizo un pastel de cumpleaños!' },
  ],
  'nuggets': [
    { en: 'Nuggets! Small and golden!', es: '¡Nuggets! ¡Pequeños y dorados!' },
    { en: 'Nuggets are small pieces of chicken!', es: '¡Los nuggets son pequeños trozos de pollo!' },
    { en: 'Penny dips nuggets in ketchup!', es: '¡Penny moja los nuggets en ketchup!' },
  ],
  'pancakes': [
    { en: 'Pancakes! Soft and warm!', es: '¡Panqueques! ¡Suaves y calientitos!' },
    { en: 'Pancakes with honey and butter!', es: '¡Panqueques con miel y mantequilla!' },
    { en: 'Penny eats ten pancakes for breakfast!', es: '¡Penny come diez panqueques en el desayuno!' },
  ],
  'cotton candy': [
    { en: 'Cotton candy! Pink and sweet!', es: '¡Algodón de azúcar! ¡Rosado y dulce!' },
    { en: 'Soft and sweet cotton candy!', es: '¡Algodón de azúcar suave y dulce!' },
    { en: 'Penny loves pink cotton candy!', es: '¡A Penny le encanta el algodón de azúcar rosado!' },
  ],
  'gum': [
    { en: 'Gum! Chew chew chew!', es: '¡Chicle! ¡Mastica mastica mastica!' },
    { en: 'Gum — do not swallow it!', es: '¡Chicle — ¡no lo tragues!' },
    { en: 'Penny chews gum all day!', es: '¡Penny mastica chicle todo el día!' },
  ],
  'lollipops': [
    { en: 'Lollipop! Sweet on a stick!', es: '¡Paleta! ¡Dulce en un palito!' },
    { en: 'Red, orange, and green lollipops!', es: '¡Paletas rojas, anaranjadas y verdes!' },
    { en: "Penny's favorite lollipop is red!", es: '¡La paleta favorita de Penny es roja!' },
  ],
  'gummy bears': [
    { en: 'Gummy bears! Red, green, and yellow!', es: '¡Ositos de goma! ¡Rojos, verdes y amarillos!' },
    { en: 'Soft and sweet gummy bears!', es: '¡Ositos de goma suaves y dulces!' },
    { en: 'Penny eats gummy bears every day!', es: '¡Penny come ositos de goma todos los días!' },
  ],
  'marshmallows': [
    { en: 'Marshmallows! Soft and white!', es: '¡Malvaviscos! ¡Suaves y blancos!' },
    { en: 'Marshmallows are sweet and soft!', es: '¡Los malvaviscos son dulces y suaves!' },
    { en: 'Penny loves white marshmallows — like snow!', es: '¡A Penny le encantan los malvaviscos blancos — ¡como la nieve!' },
  ],
  'popsicles': [
    { en: 'Popsicle! Cold on a stick!', es: '¡Paleta de hielo! ¡Fría en un palito!' },
    { en: 'Red, orange, and green popsicles!', es: '¡Paletas de hielo rojas, anaranjadas y verdes!' },
    { en: 'Penny loves cold popsicles!', es: '¡A Penny le encantan las paletas de hielo frías!' },
  ],
  'brownies': [
    { en: 'Brownie! Dark and sweet!', es: '¡Brownie! ¡Oscuro y dulce!' },
    { en: 'Chocolate brownies — so good!', es: '¡Brownies de chocolate — ¡tan ricos!' },
    { en: 'Penny made chocolate brownies!', es: '¡Penny hizo brownies de chocolate!' },
  ],
  'onion rings': [
    { en: 'Onion rings! Round and hot!', es: '¡Aros de cebolla! ¡Redondos y calientes!' },
    { en: 'Golden onion rings!', es: '¡Aros de cebolla dorados!' },
    { en: 'Penny eats onion rings on Fridays!', es: '¡Penny come aros de cebolla los viernes!' },
  ],
  'corn dogs': [
    { en: 'Corn dog! Meat on a stick!', es: '¡Perro en maíz! ¡Carne en un palito!' },
    { en: 'Yellow corn dog — so delicious!', es: '¡Perro en maíz amarillo — ¡tan delicioso!' },
    { en: 'Penny loves corn dogs at the park!', es: '¡A Penny le encantan los perros en maíz en el parque!' },
  ],
  'cookies': [
    { en: 'Cookies! Brown and sweet!', es: '¡Galletas! ¡Marrones y dulces!' },
    { en: 'Big chocolate chip cookies!', es: '¡Grandes galletas de chispas de chocolate!' },
    { en: 'Penny baked cookies for you!', es: '¡Penny horneó galletas para ti!' },
  ],
  'pretzels': [
    { en: 'Pretzel! Brown and salty!', es: '¡Pretzel! ¡Marrón y salado!' },
    { en: 'Salty pretzels — so good!', es: '¡Pretzels salados — ¡tan ricos!' },
    { en: 'Penny eats pretzels every day!', es: '¡Penny come pretzels todos los días!' },
  ],
  'syrup': [
    { en: 'Syrup! Sweet and golden!', es: '¡Jarabe! ¡Dulce y dorado!' },
    { en: 'Put sweet syrup on your pancakes!', es: '¡Ponle jarabe dulce a tus panqueques!' },
    { en: 'Penny puts syrup on everything!', es: '¡Penny le pone jarabe a todo!' },
  ],
  'whipped cream': [
    { en: 'Whipped cream! White and sweet!', es: '¡Crema batida! ¡Blanca y dulce!' },
    { en: 'Put whipped cream on top!', es: '¡Pon crema batida encima!' },
    { en: 'Penny puts whipped cream on her fish!', es: '¡Penny le pone crema batida a su pescado!' },
  ],

  // --- Fruits ---
  'apple': [
    { en: 'Apple! Red, green, or yellow!', es: '¡Manzana! ¡Roja, verde o amarilla!' },
    { en: 'One apple a day is good for you!', es: '¡Una manzana al día es buena para ti!' },
    { en: 'Penny gives you a red apple!', es: '¡Penny te da una manzana roja!' },
  ],
  'banana': [
    { en: 'Banana! Yellow and sweet!', es: '¡Plátano! ¡Amarillo y dulce!' },
    { en: 'Peel the banana and eat it!', es: '¡Pela el plátano y cómelo!' },
    { en: 'Penny loves yellow bananas!', es: '¡A Penny le encantan los plátanos amarillos!' },
  ],
  'orange': [
    { en: 'Orange! The color and the fruit!', es: '¡Naranja! ¡El color y la fruta!' },
    { en: 'Peel the orange and eat it!', es: '¡Pela la naranja y cómela!' },
    { en: "Penny's beak is orange — like an orange!", es: '¡El pico de Penny es anaranjado — ¡como una naranja!' },
  ],
  'grape': [
    { en: 'Grape! Small and sweet!', es: '¡Uva! ¡Pequeña y dulce!' },
    { en: 'Grapes are green or purple!', es: '¡Las uvas son verdes o moradas!' },
    { en: 'Penny eats green grapes!', es: '¡Penny come uvas verdes!' },
  ],
  'pear': [
    { en: 'Pear! Green and sweet!', es: '¡Pera! ¡Verde y dulce!' },
    { en: 'The pear is green and yellow!', es: '¡La pera es verde y amarilla!' },
    { en: 'Penny has a pear for breakfast!', es: '¡Penny tiene una pera para el desayuno!' },
  ],
  'strawberry': [
    { en: 'Strawberry! Red and sweet!', es: '¡Fresa! ¡Roja y dulce!' },
    { en: 'Strawberries are red!', es: '¡Las fresas son rojas!' },
    { en: 'Penny loves red strawberries!', es: '¡A Penny le encantan las fresas rojas!' },
  ],
  'mango': [
    { en: 'Mango! Orange and sweet!', es: '¡Mango! ¡Anaranjado y dulce!' },
    { en: 'Mango is yellow and orange inside!', es: '¡El mango es amarillo y anaranjado por dentro!' },
    { en: 'Penny eats mango in the summer!', es: '¡Penny come mango en el verano!' },
  ],
  'watermelon': [
    { en: 'Watermelon! Green outside, red inside!', es: '¡Sandía! ¡Verde por fuera, roja por dentro!' },
    { en: 'Watermelon is red and sweet!', es: '¡La sandía es roja y dulce!' },
    { en: 'Penny loves cold watermelon!', es: '¡A Penny le encanta la sandía fría!' },
  ],
  'pineapple': [
    { en: 'Pineapple! Yellow inside!', es: '¡Piña! ¡Amarilla por dentro!' },
    { en: 'Pineapple is yellow and sweet!', es: '¡La piña es amarilla y dulce!' },
    { en: 'Penny eats pineapple on the beach!', es: '¡Penny come piña en la playa!' },
  ],

  // --- Breakfast Foods ---
  'water': [
    { en: 'Water! Drink water every day!', es: '¡Agua! ¡Bebe agua todos los días!' },
    { en: 'Water is good for you!', es: '¡El agua es buena para ti!' },
    { en: 'Penny drinks cold water every day!', es: '¡Penny bebe agua fría todos los días!' },
  ],
  'orange juice': [
    { en: 'Orange juice! Sweet and orange!', es: '¡Jugo de naranja! ¡Dulce y anaranjado!' },
    { en: 'Orange juice comes from oranges!', es: '¡El jugo de naranja viene de las naranjas!' },
    { en: 'Penny drinks orange juice every morning!', es: '¡Penny toma jugo de naranja cada mañana!' },
  ],
  'yogurt': [
    { en: 'Yogurt! White and good for you!', es: '¡Yogur! ¡Blanco y bueno para ti!' },
    { en: 'Yogurt is sweet and cold!', es: '¡El yogur es dulce y frío!' },
    { en: "Penny's favorite yogurt is vanilla!", es: '¡El yogur favorito de Penny es de vainilla!' },
  ],
  'bread': [
    { en: 'Bread! Brown or white!', es: '¡Pan! ¡Marrón o blanco!' },
    { en: 'Eat bread for breakfast!', es: '¡Come pan en el desayuno!' },
    { en: 'Penny puts butter on her bread!', es: '¡Penny le pone mantequilla a su pan!' },
  ],
  'cereal': [
    { en: 'Cereal! With cold milk!', es: '¡Cereal! ¡Con leche fría!' },
    { en: 'Eat cereal with milk every morning!', es: '¡Come cereal con leche cada mañana!' },
    { en: "Penny's favorite cereal is yellow!", es: '¡El cereal favorito de Penny es amarillo!' },
  ],
  'coffee': [
    { en: 'Coffee! That is for big people!', es: '¡Café! ¡Eso es para los grandes!' },
    { en: 'Coffee is hot and brown!', es: '¡El café es caliente y marrón!' },
    { en: 'Penny does not drink coffee — she is too young!', es: '¡Penny no toma café — ¡es muy joven!' },
  ],
  'milk': [
    { en: 'Milk! White and cold!', es: '¡Leche! ¡Blanca y fría!' },
    { en: 'Drink milk — it is good for your bones!', es: '¡Bebe leche — ¡es buena para tus huesos!' },
    { en: 'Penny drinks two glasses of milk every day!', es: '¡Penny toma dos vasos de leche todos los días!' },
  ],
  'honey': [
    { en: 'Honey! Sweet and golden!', es: '¡Miel! ¡Dulce y dorada!' },
    { en: 'Bees make honey!', es: '¡Las abejas hacen la miel!' },
    { en: 'Penny puts honey on everything!', es: '¡Penny le pone miel a todo!' },
  ],
  'sugar': [
    { en: 'Sugar! Very sweet!', es: '¡Azúcar! ¡Muy dulce!' },
    { en: 'Sugar makes things sweet!', es: '¡El azúcar hace las cosas dulces!' },
    { en: 'Penny puts sugar in her tea!', es: '¡Penny le pone azúcar a su té!' },
  ],
  'toast': [
    { en: 'Toast! Hot and crunchy!', es: '¡Tostada! ¡Caliente y crujiente!' },
    { en: 'Put butter on your toast!', es: '¡Ponle mantequilla a tu tostada!' },
    { en: 'Penny eats two pieces of toast!', es: '¡Penny come dos tostadas!' },
  ],
  'butter': [
    { en: 'Butter! Yellow and soft!', es: '¡Mantequilla! ¡Amarilla y suave!' },
    { en: 'Butter goes on bread and toast!', es: '¡La mantequilla va en el pan y la tostada!' },
    { en: 'Penny loves butter on everything!', es: '¡A Penny le encanta la mantequilla en todo!' },
  ],
  'jelly': [
    { en: 'Jelly! Red, purple, or orange!', es: '¡Mermelada! ¡Roja, morada o anaranjada!' },
    { en: 'Put jelly on your bread!', es: '¡Ponle mermelada a tu pan!' },
    { en: 'Penny loves strawberry jelly!', es: '¡A Penny le encanta la mermelada de fresa!' },
  ],
  'oatmeal': [
    { en: 'Oatmeal! Hot and good for you!', es: '¡Avena! ¡Caliente y buena para ti!' },
    { en: 'Eat oatmeal with honey!', es: '¡Come avena con miel!' },
    { en: 'Penny eats oatmeal every morning!', es: '¡Penny come avena cada mañana!' },
  ],
  'avocado': [
    { en: 'Avocado! Green and creamy!', es: '¡Aguacate! ¡Verde y cremoso!' },
    { en: 'Avocado is green inside!', es: '¡El aguacate es verde por dentro!' },
    { en: 'Penny puts avocado on her toast!', es: '¡Penny pone aguacate en su tostada!' },
  ],
  'cheese': [
    { en: 'Cheese! Yellow and delicious!', es: '¡Queso! ¡Amarillo y delicioso!' },
    { en: 'Cheese is yellow or white!', es: '¡El queso es amarillo o blanco!' },
    { en: 'Penny loves yellow cheese!', es: '¡A Penny le encanta el queso amarillo!' },
  ],

  // --- Weather ---
  'sunny': [
    { en: 'Sunny! The sun is yellow!', es: '¡Soleado! ¡El sol es amarillo!' },
    { en: 'A sunny day is hot and bright!', es: '¡Un día soleado es caliente y brillante!' },
    { en: 'Penny loves sunny days at the beach!', es: '¡A Penny le encantan los días soleados en la playa!' },
  ],
  'cloudy': [
    { en: 'Cloudy! Gray and white clouds!', es: '¡Nublado! ¡Nubes grises y blancas!' },
    { en: 'Clouds are white and gray!', es: '¡Las nubes son blancas y grises!' },
    { en: 'Penny loves cloudy and cold days!', es: '¡A Penny le encantan los días nublados y fríos!' },
  ],
  'stormy': [
    { en: 'Stormy! Stay inside!', es: '¡Tormentoso! ¡Quédate adentro!' },
    { en: 'A storm has rain and thunder!', es: '¡Una tormenta tiene lluvia y truenos!' },
    { en: 'Penny is scared of storms!', es: '¡Penny tiene miedo de las tormentas!' },
  ],
  'windy': [
    { en: 'Windy! The wind is strong!', es: '¡Ventoso! ¡El viento es fuerte!' },
    { en: 'Hold on — the wind is strong!', es: '¡Agárrate — ¡el viento es fuerte!' },
    { en: "The wind blows Penny's hat away!", es: '¡El viento se lleva el sombrero de Penny!' },
  ],
  'rainy': [
    { en: 'Rainy! Get your umbrella!', es: '¡Lluvioso! ¡Agarra tu paraguas!' },
    { en: 'It is raining — the sky is gray!', es: '¡Está lloviendo — el cielo está gris!' },
    { en: 'Penny loves the rain — she is a water bird!', es: '¡A Penny le encanta la lluvia — ¡es un ave acuática!' },
  ],
  'snowy': [
    { en: 'Snowy! White snow everywhere!', es: '¡Nevado! ¡Nieve blanca por todas partes!' },
    { en: 'Snow is white and cold!', es: '¡La nieve es blanca y fría!' },
    { en: 'Penny lives in the snow — Antarctica!', es: '¡Penny vive en la nieve — ¡la Antártida!' },
  ],

  // --- Pets ---
  'dog': [
    { en: 'Dog! Woof woof!', es: '¡Perro! ¡Guau guau!' },
    { en: 'Dogs are happy and friendly!', es: '¡Los perros son felices y amigables!' },
    { en: 'Penny wants a pet dog!', es: '¡Penny quiere un perro como mascota!' },
  ],
  'cat': [
    { en: 'Cat! Meow!', es: '¡Gato! ¡Miau!' },
    { en: 'Cats are soft and quiet!', es: '¡Los gatos son suaves y tranquilos!' },
    { en: 'Penny and the cat are best friends!', es: '¡Penny y el gato son mejores amigos!' },
  ],
  'guinea pig': [
    { en: 'Guinea pig! Small and soft!', es: '¡Cobayo! ¡Pequeño y suave!' },
    { en: 'Guinea pigs are small and friendly!', es: '¡Los cobayos son pequeños y amigables!' },
    { en: 'Penny has a pet guinea pig!', es: '¡Penny tiene un cobayo de mascota!' },
  ],
  'rabbit': [
    { en: 'Rabbit! Hop hop hop!', es: '¡Conejo! ¡Hop hop hop!' },
    { en: 'Rabbits have long ears!', es: '¡Los conejos tienen orejas largas!' },
    { en: 'Penny hops like a rabbit!', es: '¡Penny salta como un conejo!' },
  ],
  'chicken': [
    { en: 'Chicken! Cluck cluck!', es: '¡Gallina! ¡Cloc cloc!' },
    { en: 'Chickens are yellow and white!', es: '¡Las gallinas son amarillas y blancas!' },
    { en: 'Penny is a bird — just like a chicken!', es: '¡Penny es un ave — ¡igual que una gallina!' },
  ],
  'bird': [
    { en: 'Bird! Tweet tweet!', es: '¡Pájaro! ¡Pío pío!' },
    { en: 'Birds are red, blue, and yellow!', es: '¡Los pájaros son rojos, azules y amarillos!' },
    { en: 'Penny is a bird too!', es: '¡Penny también es un pájaro!' },
  ],
  'parrot': [
    { en: 'Parrot! Green, red, and blue!', es: '¡Loro! ¡Verde, rojo y azul!' },
    { en: 'Parrots copy what you say!', es: '¡Los loros copian lo que dices!' },
    { en: 'Penny and the parrot both have beaks!', es: '¡Penny y el loro tienen pico!' },
  ],
  'fish': [
    { en: 'Fish! Blue, red, and orange!', es: '¡Pez! ¡Azul, rojo y anaranjado!' },
    { en: 'Fish live in the water!', es: '¡Los peces viven en el agua!' },
    { en: "Fish is Penny's favorite food!", es: '¡El pescado es la comida favorita de Penny!' },
  ],
  'turtle': [
    { en: 'Turtle! Green and slow!', es: '¡Tortuga! ¡Verde y lenta!' },
    { en: 'Turtles are slow but happy!', es: '¡Las tortugas son lentas pero felices!' },
    { en: 'Penny swims faster than a turtle!', es: '¡Penny nada más rápido que una tortuga!' },
  ],

  // --- Zoo Animals ---
  'tiger': [
    { en: 'Tiger! Orange with black stripes!', es: '¡Tigre! ¡Anaranjado con rayas negras!' },
    { en: 'Tigers are orange, black, and white!', es: '¡Los tigres son anaranjados, negros y blancos!' },
    { en: 'Penny is scared of the tiger!', es: '¡Penny tiene miedo del tigre!' },
  ],
  'lion': [
    { en: 'Lion! Big and yellow!', es: '¡León! ¡Grande y amarillo!' },
    { en: 'Lions are big and strong!', es: '¡Los leones son grandes y fuertes!' },
    { en: 'Penny and the lion are not friends!', es: '¡Penny y el león no son amigos!' },
  ],
  'monkey': [
    { en: 'Monkey! Brown and funny!', es: '¡Mono! ¡Marrón y chistoso!' },
    { en: 'Monkeys love to climb and jump!', es: '¡A los monos les encanta trepar y saltar!' },
    { en: 'Penny and the monkey are best friends!', es: '¡Penny y el mono son mejores amigos!' },
  ],
  'dolphin': [
    { en: 'Dolphin! Gray and fast!', es: '¡Delfín! ¡Gris y rápido!' },
    { en: 'Dolphins swim fast and jump high!', es: '¡Los delfines nadan rápido y saltan alto!' },
    { en: 'Penny and the dolphin race in the water!', es: '¡Penny y el delfín compiten en el agua!' },
  ],
  'crocodile': [
    { en: 'Crocodile! Green and scary!', es: '¡Cocodrilo! ¡Verde y aterrador!' },
    { en: 'Crocodiles have big teeth — careful!', es: '¡Los cocodrilos tienen dientes grandes — ¡cuidado!' },
    { en: 'Penny runs away from the crocodile!', es: '¡Penny corre lejos del cocodrilo!' },
  ],
  'elephant': [
    { en: 'Elephant! Big and gray!', es: '¡Elefante! ¡Grande y gris!' },
    { en: 'Elephants are big and gray!', es: '¡Los elefantes son grandes y grises!' },
    { en: 'Penny sits on the elephant!', es: '¡Penny se sienta en el elefante!' },
  ],
  'zebra': [
    { en: 'Zebra! Black and white stripes!', es: '¡Cebra! ¡Rayas negras y blancas!' },
    { en: 'Zebras are black and white — like Penny!', es: '¡Las cebras son negras y blancas — ¡como Penny!' },
    { en: 'Penny and the zebra are the same colors!', es: '¡Penny y la cebra son del mismo color!' },
  ],
  'bear': [
    { en: 'Bear! Big and brown!', es: '¡Oso! ¡Grande y marrón!' },
    { en: 'Bears are big and strong!', es: '¡Los osos son grandes y fuertes!' },
    { en: 'Penny is scared of the big bear!', es: '¡Penny tiene miedo del gran oso!' },
  ],
  'giraffe': [
    { en: 'Giraffe! Tall with a long neck!', es: '¡Jirafa! ¡Alta con un cuello largo!' },
    { en: 'Giraffes are yellow and brown!', es: '¡Las jirafas son amarillas y marrones!' },
    { en: 'Penny wants to be tall like the giraffe!', es: '¡Penny quiere ser alta como la jirafa!' },
  ],
  'penguin': [
    { en: 'Penguin! That is me!', es: '¡Pingüino! ¡Ese soy yo!' },
    { en: 'Penguins are black and white!', es: '¡Los pingüinos son negros y blancos!' },
    { en: 'Penny is a penguin — hello!', es: '¡Penny es una pingüina — ¡hola!' },
  ],
  'polar bear': [
    { en: 'Polar bear! White and big!', es: '¡Oso polar! ¡Blanco y grande!' },
    { en: 'Polar bears are white and live in the snow!', es: '¡Los osos polares son blancos y viven en la nieve!' },
    { en: 'Penny and the polar bear are cold neighbors!', es: '¡Penny y el oso polar son vecinos en el frío!' },
  ],
  'hippo': [
    { en: 'Hippo! Big and gray!', es: '¡Hipopótamo! ¡Grande y gris!' },
    { en: 'Hippos are big and gray and live in water!', es: '¡Los hipopótamos son grandes, grises y viven en el agua!' },
    { en: 'Penny swims with the hippo!', es: '¡Penny nada con el hipopótamo!' },
  ],
  'snake': [
    { en: 'Snake! Green and long!', es: '¡Serpiente! ¡Verde y larga!' },
    { en: 'Snakes are long and have no legs!', es: '¡Las serpientes son largas y no tienen patas!' },
    { en: 'Penny is scared of snakes!', es: '¡Penny tiene miedo de las serpientes!' },
  ],
  'kangaroo': [
    { en: 'Kangaroo! Hop hop hop!', es: '¡Canguro! ¡Hop hop hop!' },
    { en: 'Kangaroos are brown and jump very high!', es: '¡Los canguros son marrones y saltan muy alto!' },
    { en: 'Penny jumps like a kangaroo!', es: '¡Penny salta como un canguro!' },
  ],
  'shark': [
    { en: 'Shark! Gray and fast!', es: '¡Tiburón! ¡Gris y rápido!' },
    { en: 'Sharks are gray and live in the ocean!', es: '¡Los tiburones son grises y viven en el océano!' },
    { en: 'Penny swims away from the shark — fast!', es: '¡Penny nada lejos del tiburón — ¡rápido!' },
  ],

  // --- Farm Animals ---
  'pig': [
    { en: 'Pig! Pink and round!', es: '¡Cerdo! ¡Rosado y redondo!' },
    { en: 'Pigs are pink and say oink!', es: '¡Los cerdos son rosados y dicen oink!' },
    { en: 'Penny is not a pig — she is a penguin!', es: '¡Penny no es un cerdo — ¡es una pingüina!' },
  ],
  'sheep': [
    { en: 'Sheep! White and soft!', es: '¡Oveja! ¡Blanca y suave!' },
    { en: 'Sheep are white and say baa!', es: '¡Las ovejas son blancas y dicen bee!' },
    { en: 'Penny is white — just like a sheep!', es: '¡Penny es blanca — ¡igual que una oveja!' },
  ],
  'cow': [
    { en: 'Cow! Black, white, and big!', es: '¡Vaca! ¡Negra, blanca y grande!' },
    { en: 'Cows give us milk!', es: '¡Las vacas nos dan leche!' },
    { en: "Penny drinks the cow's milk!", es: '¡Penny toma la leche de la vaca!' },
  ],
  'duck': [
    { en: 'Duck! Yellow and small!', es: '¡Pato! ¡Amarillo y pequeño!' },
    { en: 'Ducks are yellow and they swim!', es: '¡Los patos son amarillos y nadan!' },
    { en: 'Penny swims faster than the duck!', es: '¡Penny nada más rápido que el pato!' },
  ],
  'hen': [
    { en: 'Hen! Red and brown!', es: '¡Gallina! ¡Roja y marrón!' },
    { en: 'The hen is a girl chicken!', es: '¡La gallina es un pollo hembra!' },
    { en: 'Penny and the hen are both birds!', es: '¡Penny y la gallina son las dos aves!' },
  ],
  'horse': [
    { en: 'Horse! Brown and fast!', es: '¡Caballo! ¡Marrón y rápido!' },
    { en: 'Horses are brown and run fast!', es: '¡Los caballos son marrones y corren rápido!' },
    { en: 'Penny rides the horse!', es: '¡Penny monta el caballo!' },
  ],
  'goat': [
    { en: 'Goat! White and small!', es: '¡Cabra! ¡Blanca y pequeña!' },
    { en: 'Goats are white and climb rocks!', es: '¡Las cabras son blancas y escalan rocas!' },
    { en: 'Penny and the goat are friends!', es: '¡Penny y la cabra son amigas!' },
  ],
  'rooster': [
    { en: 'Rooster! Red and loud!', es: '¡Gallo! ¡Rojo y ruidoso!' },
    { en: 'The rooster wakes up early!', es: '¡El gallo se despierta temprano!' },
    { en: 'The rooster wakes up Penny every morning!', es: '¡El gallo despierta a Penny cada mañana!' },
  ],

  // --- Classroom ---
  'ruler': [
    { en: 'Ruler! Long and straight!', es: '¡Regla! ¡Larga y recta!' },
    { en: 'Use a ruler to draw a straight line!', es: '¡Usa una regla para trazar una línea recta!' },
    { en: 'Penny uses a ruler in school!', es: '¡Penny usa una regla en la escuela!' },
  ],
  'book': [
    { en: 'Book! Open it and read!', es: '¡Libro! ¡Ábrelo y lee!' },
    { en: 'Books have words and pictures!', es: '¡Los libros tienen palabras e imágenes!' },
    { en: 'Penny reads a book every night!', es: '¡Penny lee un libro cada noche!' },
  ],
  'notebook': [
    { en: 'Notebook! Write in it!', es: '¡Cuaderno! ¡Escribe en él!' },
    { en: 'Write your words in the notebook!', es: '¡Escribe tus palabras en el cuaderno!' },
    { en: 'Penny has a pink notebook!', es: '¡Penny tiene un cuaderno rosado!' },
  ],
  'pen': [
    { en: 'Pen! Write with it!', es: '¡Bolígrafo! ¡Escribe con él!' },
    { en: 'A pen writes in blue or black!', es: '¡Un bolígrafo escribe en azul o negro!' },
    { en: 'Penny uses a blue pen to write!', es: '¡Penny usa un bolígrafo azul para escribir!' },
  ],
  'pencil': [
    { en: 'Pencil! Write and erase!', es: '¡Lápiz! ¡Escribe y borra!' },
    { en: 'A pencil is yellow!', es: '¡Un lápiz es amarillo!' },
    { en: 'Penny writes with a yellow pencil!', es: '¡Penny escribe con un lápiz amarillo!' },
  ],
  'crayon': [
    { en: 'Crayon! Draw with colors!', es: '¡Crayón! ¡Dibuja con colores!' },
    { en: 'Crayons come in every color!', es: '¡Los crayones vienen en todos los colores!' },
    { en: 'Penny draws with a pink crayon!', es: '¡Penny dibuja con un crayón rosado!' },
  ],
  'eraser': [
    { en: 'Eraser! No problem — erase it!', es: '¡Borrador! ¡Sin problema — bórralo!' },
    { en: 'Use the eraser to fix your mistake!', es: '¡Usa el borrador para corregir tu error!' },
    { en: 'Penny erases with a big eraser!', es: '¡Penny borra con un borrador grande!' },
  ],
  'desk': [
    { en: 'Desk! Sit and work!', es: '¡Escritorio! ¡Siéntate y trabaja!' },
    { en: 'Put your book on the desk!', es: '¡Pon tu libro en el escritorio!' },
    { en: "Penny's desk is clean and organized!", es: '¡El escritorio de Penny está limpio y organizado!' },
  ],
  'chair': [
    { en: 'Chair! Sit down!', es: '¡Silla! ¡Siéntate!' },
    { en: 'Sit in your chair and learn!', es: '¡Siéntate en tu silla y aprende!' },
    { en: 'Penny sits in a blue chair!', es: '¡Penny se sienta en una silla azul!' },
  ],
  'backpack': [
    { en: 'Backpack! For your school things!', es: '¡Mochila! ¡Para tus cosas de la escuela!' },
    { en: 'Put your books in your backpack!', es: '¡Pon tus libros en la mochila!' },
    { en: 'Penny has a pink backpack!', es: '¡Penny tiene una mochila rosada!' },
  ],
  'glue': [
    { en: 'Glue! Stick it!', es: '¡Pegamento! ¡Pégalo!' },
    { en: 'Glue sticks things together!', es: '¡El pegamento une las cosas!' },
    { en: 'Penny uses glue to make art!', es: '¡Penny usa pegamento para hacer arte!' },
  ],

  // --- Shapes ---
  'triangle': [
    { en: 'Triangle! Three sides!', es: '¡Triángulo! ¡Tres lados!' },
    { en: 'A triangle has three sides and three corners!', es: '¡Un triángulo tiene tres lados y tres esquinas!' },
    { en: 'Penny draws a triangle!', es: '¡Penny dibuja un triángulo!' },
  ],
  'circle': [
    { en: 'Circle! Round like the sun!', es: '¡Círculo! ¡Redondo como el sol!' },
    { en: 'A circle is round — no corners!', es: '¡Un círculo es redondo — ¡sin esquinas!' },
    { en: 'Penny draws circles all day!', es: '¡Penny dibuja círculos todo el día!' },
  ],
  'square': [
    { en: 'Square! Four equal sides!', es: '¡Cuadrado! ¡Cuatro lados iguales!' },
    { en: 'A square has four sides — all the same!', es: '¡Un cuadrado tiene cuatro lados — ¡todos iguales!' },
    { en: "Penny's house is a square!", es: '¡La casa de Penny es un cuadrado!' },
  ],
  'rectangle': [
    { en: 'Rectangle! Long and wide!', es: '¡Rectángulo! ¡Largo y ancho!' },
    { en: 'A rectangle has two long and two short sides!', es: '¡Un rectángulo tiene dos lados largos y dos cortos!' },
    { en: "Penny's door is a rectangle!", es: '¡La puerta de Penny es un rectángulo!' },
  ],
  'star': [
    { en: 'Star! Five points!', es: '¡Estrella! ¡Cinco puntas!' },
    { en: 'Stars have five points!', es: '¡Las estrellas tienen cinco puntas!' },
    { en: 'Penny is a star!', es: '¡Penny es una estrella!' },
  ],
  'diamond': [
    { en: 'Diamond! Like a square on its side!', es: '¡Rombo! ¡Como un cuadrado de lado!' },
    { en: 'A diamond has four sides!', es: '¡Un rombo tiene cuatro lados!' },
    { en: 'Penny loves diamonds!', es: '¡A Penny le encantan los diamantes!' },
  ],
  'pentagon': [
    { en: 'Pentagon! Five sides!', es: '¡Pentágono! ¡Cinco lados!' },
    { en: 'A pentagon has five sides!', es: '¡Un pentágono tiene cinco lados!' },
    { en: 'Penny draws a pentagon!', es: '¡Penny dibuja un pentágono!' },
  ],
  'oval': [
    { en: 'Oval! Like a big egg!', es: '¡Óvalo! ¡Como un huevo grande!' },
    { en: 'An oval is round but not a circle!', es: '¡Un óvalo es redondo pero no es un círculo!' },
    { en: "Penny's egg is oval!", es: '¡El huevo de Penny es un óvalo!' },
  ],
  'heart': [
    { en: 'Heart! I love you!', es: '¡Corazón! ¡Te quiero!' },
    { en: 'A heart is pink and red!', es: '¡Un corazón es rosado y rojo!' },
    { en: 'Penny draws a heart for you!', es: '¡Penny dibuja un corazón para ti!' },
  ],
  'hexagon': [
    { en: 'Hexagon! Six sides!', es: '¡Hexágono! ¡Seis lados!' },
    { en: 'A hexagon has six sides!', es: '¡Un hexágono tiene seis lados!' },
    { en: 'Bees make hexagons in their home!', es: '¡Las abejas hacen hexágonos en su casa!' },
  ],
  'octagon': [
    { en: 'Octagon! Eight sides!', es: '¡Octágono! ¡Ocho lados!' },
    { en: 'A stop sign is an octagon — eight sides!', es: '¡Una señal de alto es un octágono — ¡ocho lados!' },
    { en: 'Penny counts eight sides — octagon!', es: '¡Penny cuenta ocho lados — ¡octágono!' },
  ],
  'cross': [
    { en: 'Cross! Like a plus sign!', es: '¡Cruz! ¡Como un signo de más!' },
    { en: 'A cross has four arms!', es: '¡Una cruz tiene cuatro brazos!' },
    { en: 'Penny draws a cross!', es: '¡Penny dibuja una cruz!' },
  ],

  // --- Lunch & Dinner ---
  'rice': [
    { en: 'Rice! White and delicious!', es: '¡Arroz! ¡Blanco y delicioso!' },
    { en: 'Rice is white and good for you!', es: '¡El arroz es blanco y bueno para ti!' },
    { en: 'Penny eats rice every day!', es: '¡Penny come arroz todos los días!' },
  ],
  'potatoes': [
    { en: 'Potatoes! Brown outside, white inside!', es: '¡Papas! ¡Marrones por fuera, blancas por dentro!' },
    { en: 'Potatoes can be hot or cold!', es: '¡Las papas pueden ser calientes o frías!' },
    { en: 'Penny loves potatoes with butter!', es: '¡A Penny le encantan las papas con mantequilla!' },
  ],
  'beef': [
    { en: 'Beef! Brown and delicious!', es: '¡Carne de res! ¡Marrón y deliciosa!' },
    { en: 'Beef is red meat from a cow!', es: '¡La carne de res es carne roja de una vaca!' },
    { en: 'Penny loves beef for dinner!', es: '¡A Penny le encanta la carne de res para cenar!' },
  ],
  'soup': [
    { en: 'Soup! Hot and good!', es: '¡Sopa! ¡Caliente y rica!' },
    { en: 'Eat soup when you are sick!', es: '¡Come sopa cuando estás enfermo!' },
    { en: 'Penny makes fish soup!', es: '¡Penny hace sopa de pescado!' },
  ],
  'pasta': [
    { en: 'Pasta! Long and delicious!', es: '¡Pasta! ¡Larga y deliciosa!' },
    { en: 'Pasta is long and white!', es: '¡La pasta es larga y blanca!' },
    { en: "Pasta is Penny's favorite food!", es: '¡La pasta es la comida favorita de Penny!' },
  ],
  'salad': [
    { en: 'Salad! Green and healthy!', es: '¡Ensalada! ¡Verde y saludable!' },
    { en: 'A salad has green and red vegetables!', es: '¡Una ensalada tiene verduras verdes y rojas!' },
    { en: 'Penny eats a big green salad!', es: '¡Penny come una gran ensalada verde!' },
  ],
  'sweet potatoes': [
    { en: 'Sweet potatoes! Orange and sweet!', es: '¡Camotes! ¡Anaranjados y dulces!' },
    { en: 'Sweet potatoes are orange inside!', es: '¡Los camotes son anaranjados por dentro!' },
    { en: 'Penny loves sweet potatoes!', es: '¡A Penny le encantan los camotes!' },
  ],
  'tea': [
    { en: 'Tea! Hot and warm!', es: '¡Té! ¡Caliente y calientito!' },
    { en: 'Tea is brown and hot!', es: '¡El té es marrón y caliente!' },
    { en: 'Penny drinks hot tea every morning!', es: '¡Penny toma té caliente cada mañana!' },
  ],
  'lemonade': [
    { en: 'Lemonade! Yellow and sweet!', es: '¡Limonada! ¡Amarilla y dulce!' },
    { en: 'Lemonade is cold and yellow!', es: '¡La limonada es fría y amarilla!' },
    { en: 'Penny drinks lemonade in the summer!', es: '¡Penny toma limonada en el verano!' },
  ],
  'steak': [
    { en: 'Steak! Brown and delicious!', es: '¡Bistec! ¡Marrón y delicioso!' },
    { en: 'A steak is a big piece of beef!', es: '¡Un bistec es un gran trozo de carne de res!' },
    { en: 'Penny eats a big steak for dinner!', es: '¡Penny come un gran bistec para cenar!' },
  ],
  'lasagna': [
    { en: 'Lasagna! Hot and with cheese!', es: '¡Lasaña! ¡Caliente y con queso!' },
    { en: 'Lasagna has pasta, cheese, and sauce!', es: '¡La lasaña tiene pasta, queso y salsa!' },
    { en: 'Penny loves lasagna!', es: '¡A Penny le encanta la lasaña!' },
  ],
  'lentils': [
    { en: 'Lentils! Small and healthy!', es: '¡Lentejas! ¡Pequeñas y saludables!' },
    { en: 'Lentils are small and brown!', es: '¡Las lentejas son pequeñas y marrones!' },
    { en: 'Penny eats lentil soup!', es: '¡Penny come sopa de lentejas!' },
  ],
  'turkey': [
    { en: 'Turkey! Brown and big!', es: '¡Pavo! ¡Marrón y grande!' },
    { en: 'A turkey is a big brown bird!', es: '¡Un pavo es un ave grande y marrón!' },
    { en: 'Penny eats turkey on big holidays!', es: '¡Penny come pavo en las grandes fiestas!' },
  ],
  'cocoa': [
    { en: 'Cocoa! Hot chocolate!', es: '¡Cacao! ¡Chocolate caliente!' },
    { en: 'Hot cocoa is brown and sweet!', es: '¡El cacao caliente es marrón y dulce!' },
    { en: 'Penny drinks cocoa when it is cold!', es: '¡Penny toma cacao cuando hace frío!' },
  ],
  'wine': [
    { en: 'Wine! That is for big people!', es: '¡Vino! ¡Eso es para los grandes!' },
    { en: 'Wine is red or white — only for adults!', es: '¡El vino es rojo o blanco — solo para adultos!' },
    { en: 'Penny does not drink wine!', es: '¡Penny no toma vino!' },
  ],
  'beans': [
    { en: 'Beans! Black, red, or white!', es: '¡Frijoles! ¡Negros, rojos o blancos!' },
    { en: 'Beans are small and good for you!', es: '¡Los frijoles son pequeños y buenos para ti!' },
    { en: 'Penny loves black beans!', es: '¡A Penny le encantan los frijoles negros!' },
  ],
  'tuna': [
    { en: 'Tuna! Gray and from the ocean!', es: '¡Atún! ¡Gris y del océano!' },
    { en: 'Tuna is a big gray fish!', es: '¡El atún es un pez gris grande!' },
    { en: "Tuna is Penny's second favorite fish!", es: '¡El atún es el segundo pez favorito de Penny!' },
  ],

  // --- Vegetables ---
  'broccoli': [
    { en: 'Broccoli! Green like a little tree!', es: '¡Brócoli! ¡Verde como un pequeño árbol!' },
    { en: 'Broccoli is green and good for you!', es: '¡El brócoli es verde y bueno para ti!' },
    { en: 'Penny eats broccoli every day!', es: '¡Penny come brócoli todos los días!' },
  ],
  'onions': [
    { en: 'Onions! White and strong!', es: '¡Cebollas! ¡Blancas y fuertes!' },
    { en: 'Onions make you cry when you cut them!', es: '¡Las cebollas te hacen llorar cuando las cortas!' },
    { en: 'Penny cries when she cuts onions!', es: '¡Penny llora cuando corta cebollas!' },
  ],
  'carrots': [
    { en: 'Carrots! Orange and crunchy!', es: '¡Zanahorias! ¡Anaranjadas y crujientes!' },
    { en: 'Carrots are orange and good for your eyes!', es: '¡Las zanahorias son anaranjadas y buenas para los ojos!' },
    { en: 'Penny eats carrots every day!', es: '¡Penny come zanahorias todos los días!' },
  ],
  'tomatoes': [
    { en: 'Tomatoes! Red and juicy!', es: '¡Tomates! ¡Rojos y jugosos!' },
    { en: 'Tomatoes are red and round!', es: '¡Los tomates son rojos y redondos!' },
    { en: 'Penny loves red tomatoes!', es: '¡A Penny le encantan los tomates rojos!' },
  ],
  'corn': [
    { en: 'Corn! Yellow and sweet!', es: '¡Maíz! ¡Amarillo y dulce!' },
    { en: 'Corn is yellow and grows tall!', es: '¡El maíz es amarillo y crece alto!' },
    { en: 'Penny loves yellow corn!', es: '¡A Penny le encanta el maíz amarillo!' },
  ],
  'cucumbers': [
    { en: 'Cucumbers! Green and crunchy!', es: '¡Pepinos! ¡Verdes y crujientes!' },
    { en: 'Cucumbers are long and green!', es: '¡Los pepinos son largos y verdes!' },
    { en: 'Penny eats cold cucumbers!', es: '¡Penny come pepinos fríos!' },
  ],
  'lettuce': [
    { en: 'Lettuce! Green and crunchy!', es: '¡Lechuga! ¡Verde y crujiente!' },
    { en: 'Lettuce is green and goes in salads!', es: '¡La lechuga es verde y va en las ensaladas!' },
    { en: 'Penny puts lettuce on everything!', es: '¡Penny le pone lechuga a todo!' },
  ],
  'peppers': [
    { en: 'Peppers! Red, green, or yellow!', es: '¡Pimientos! ¡Rojos, verdes o amarillos!' },
    { en: 'Peppers come in red, green, and yellow!', es: '¡Los pimientos vienen en rojo, verde y amarillo!' },
    { en: "Penny's favorite pepper is red!", es: '¡El pimiento favorito de Penny es rojo!' },
  ],
  'garlic': [
    { en: 'Garlic! White and strong!', es: '¡Ajo! ¡Blanco y fuerte!' },
    { en: 'Garlic is white and very strong!', es: '¡El ajo es blanco y muy fuerte!' },
    { en: 'Penny puts garlic in all her food!', es: '¡Penny le pone ajo a toda su comida!' },
  ],
  'spinach': [
    { en: 'Spinach! Dark green and healthy!', es: '¡Espinaca! ¡Verde oscura y saludable!' },
    { en: 'Spinach is dark green and good for you!', es: '¡La espinaca es verde oscura y buena para ti!' },
    { en: 'Penny eats spinach to swim fast!', es: '¡Penny come espinaca para nadar rápido!' },
  ],
  'cabbage': [
    { en: 'Cabbage! Round and green!', es: '¡Repollo! ¡Redondo y verde!' },
    { en: 'Cabbage is round and light green!', es: '¡El repollo es redondo y verde claro!' },
    { en: 'Penny puts cabbage in her soup!', es: '¡Penny pone repollo en su sopa!' },
  ],
  'beets': [
    { en: 'Beets! Purple and sweet!', es: '¡Remolacha! ¡Morada y dulce!' },
    { en: 'Beets are purple and round!', es: '¡La remolacha es morada y redonda!' },
    { en: 'Penny loves purple beets!', es: '¡A Penny le encanta la remolacha morada!' },
  ],
  'peas': [
    { en: 'Peas! Small and green!', es: '¡Guisantes! ¡Pequeños y verdes!' },
    { en: 'Peas are small, green, and round!', es: '¡Los guisantes son pequeños, verdes y redondos!' },
    { en: 'Penny eats peas with every meal!', es: '¡Penny come guisantes con cada comida!' },
  ],
  'green beans': [
    { en: 'Green beans! Long and green!', es: '¡Ejotes! ¡Largos y verdes!' },
    { en: 'Green beans are long and thin!', es: '¡Los ejotes son largos y delgados!' },
    { en: 'Penny eats green beans for dinner!', es: '¡Penny come ejotes para cenar!' },
  ],
};

export default VOCAB_PHRASES;
