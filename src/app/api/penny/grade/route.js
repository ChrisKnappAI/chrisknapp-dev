/**
 * POST /api/penny/grade
 *
 * Grades Santiago's answer using Claude Haiku.
 * Returns Penny's response in English + Spanish translation.
 *
 * Requires env var: ANTHROPIC_API_KEY
 *
 * Body:   { question, answer, activeTopics }
 * Returns { correct: bool, english: string, spanish: string }
 */

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  const { question, answer } = await req.json();

  const expectedLine = question.answer ? `The correct answer is: "${question.answer}"\n` : '';

  const prompt = `You are Penny, a friendly pink penguin teaching English to Santiago (age 8, beginner).

Santiago only knows these English words so far:
- Feelings: hungry, angry, happy, sad, scared, surprised, thirsty, tired, sick, sleepy, confused, hot, cold
- Abilities: swim, fly, sing, run, jump, climb, stomp, dance, crawl
- Family: mom, dad, uncle, aunt, brother, sister, cousin, grandfather, grandmother, godfather, godmother, baby brother
- Days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
- Months: January, February, March, April, May, June, July, August, September, October, November, December
- Weather: sunny, cloudy, stormy, windy, rainy, snowy
- Body Parts: hair, head, face, forehead, eyebrow, eyelash, eye, ear, nose, cheek, mouth, lips, teeth, tongue, chin, neck, shoulder, chest, arm, elbow, stomach, wrist, hand, thumb, finger, leg, knee, foot, toe, back, butt
- Shapes: triangle, circle, square, rectangle, star, diamond, pentagon, oval, heart, hexagon, octagon, cross
- Chess: chess board, pawn, knight, queen, king, rook, bishop, square, row, column
- Classroom: ruler, book, notebook, pen, pencil, crayon, eraser, desk, chair, backpack, glue
- Rooms: living room, kitchen, bathroom, bedroom, dining room, laundry room, garden, garage, playroom, office
- Junk Food: pizza, hamburgers, french fries, fried chicken, soda, potato chips, candy, cupcakes, ice cream, milkshakes, hot dogs, chocolate bars, donuts, popcorn, cake, nuggets, pancakes, cotton candy, gum, lollipops, gummy bears, marshmallows, popsicles, brownies, onion rings, corn dogs, cookies, pretzels, syrup, whipped cream
- Fruits: apple, banana, orange, grape, pear, strawberry, mango, watermelon, pineapple
- Breakfast: water, orange juice, yogurt, bread, cereal, coffee, milk, honey, sugar, toast, butter, jelly, oatmeal, avocado, cheese
- Lunch & Dinner: rice, potatoes, chicken, beef, soup, pasta, salad, sweet potatoes, tea, lemonade, steak, lasagna, lentils, turkey, cocoa, wine, beans, tuna
- Vegetables: broccoli, onions, carrots, tomatoes, corn, cucumbers, lettuce, peppers, garlic, spinach, cabbage, beets, potatoes, sweet potatoes, peas, green beans
- Pets: dog, cat, guinea pig, rabbit, chicken, bird, parrot, fish, turtle
- Zoo Animals: tiger, lion, monkey, dolphin, crocodile, elephant, zebra, bear, giraffe, penguin, polar bear, hippo, snake, kangaroo, shark
- Farm Animals: pig, sheep, cow, duck, hen, horse, goat, rooster

Penny just asked: "${question.text}"
${expectedLine}Santiago answered: "${answer}"

Grade his answer and reply in this exact JSON format — no extra text, just JSON:
{
  "correct": true or false,
  "english": "your response to Santiago in English",
  "spanish": "the exact same response translated to Spanish"
}

Rules:
- Use ONLY words from Santiago's vocabulary list above — he won't understand others
- Prefer words that are similar in English and Spanish (pizza, chocolate, animal, banana, etc.)
- Mention Penny the penguin in about 1 out of 3 responses ("Penny loves pizza!", "Even Penny gets scared!")
- If correct: celebrate! Be enthusiastic.
- If wrong: gently correct him, show the right answer, and invite him to try again
- Keep it to 12 words or fewer
- Return only valid JSON, nothing else`;

  const message = await client.messages.create({
    model:      'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages:   [{ role: 'user', content: prompt }],
  });

  let json;
  try {
    json = JSON.parse(message.content[0].text);
  } catch {
    return Response.json({ correct: false, english: "Hmm, I didn't understand that. Try again!", spanish: "¡Inténtalo de nuevo!" }, { status: 200 });
  }

  return Response.json(json);
}
