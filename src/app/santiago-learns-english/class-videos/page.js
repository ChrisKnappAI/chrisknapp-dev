'use client';

import { useState } from 'react';

const TRANSCRIPTS = {
  hello: [
    { en: "Every day, every day, I go to school",  es: "Todos los días, voy a la escuela" },
    { en: "I meet my friends",                      es: "Conozco a mis amigos" },
    { en: "And we all say…",                        es: "Y todos decimos…" },
    { en: "Hello, hello, hello, hello!",            es: "¡Hola, hola, hola, hola!" },
    { en: "How are you?",                           es: "¿Cómo estás?" },
    { en: "I'm good! I'm great!",                  es: "¡Estoy bien! ¡Estoy genial!" },
    { en: "How about you?",                         es: "¿Y tú?" },
    { en: "Every day, every day, I go and play",   es: "Todos los días, voy a jugar" },
    { en: "I meet new friends",                     es: "Conozco nuevos amigos" },
    { en: "What's your name?",                      es: "¿Cómo te llamas?" },
    { en: "Nice to meet you!",                      es: "¡Mucho gusto!" },
    { en: "Do you want to play?",                   es: "¿Quieres jugar?" },
  ],
  'little-finger': [
    { en: "One little finger, one little finger",  es: "Un dedito, un dedito" },
    { en: "Tap tap tap",                            es: "Toca toca toca" },
    { en: "Point your finger up",                  es: "Apunta tu dedo hacia arriba" },
    { en: "Point your finger down",                es: "Apunta tu dedo hacia abajo" },
    { en: "Put it on your head",                   es: "Ponlo en tu cabeza" },
    { en: "Put it on your nose",                   es: "Ponlo en tu nariz" },
    { en: "Put it on your chin",                   es: "Ponlo en tu barbilla" },
    { en: "Put it on your arm",                    es: "Ponlo en tu brazo" },
    { en: "Put it on your leg",                    es: "Ponlo en tu pierna" },
    { en: "Put it on your foot",                   es: "Ponlo en tu pie" },
  ],
  goodbye: [
    { en: "It's time to go home",                  es: "Es hora de ir a casa" },
    { en: "It's time to say goodbye",              es: "Es hora de decir adiós" },
    { en: "I had so much fun",                     es: "Me divertí mucho" },
    { en: "And you had so much fun",               es: "Y tú te divertiste mucho" },
    { en: "We all had so much fun",                es: "Todos nos divertimos mucho" },
    { en: "And now we say goodbye",                es: "Y ahora decimos adiós" },
    { en: "Goodbye! See you again!",               es: "¡Adiós! ¡Hasta la próxima!" },
  ],
  'what-is-your-name': [
    { en: "Hello! What's your name?",              es: "¡Hola! ¿Cómo te llamas?" },
    { en: "My name is Ryan",                       es: "Me llamo Ryan" },
    { en: "My name is Anna",                       es: "Me llamo Anna" },
    { en: "Nice to meet you!",                     es: "¡Mucho gusto!" },
    { en: "My name is Ben",                        es: "Me llamo Ben" },
    { en: "My name is Bella",                      es: "Me llamo Bella" },
    { en: "My name is Kaylee",                     es: "Me llamo Kaylee" },
    { en: "My name is Owen",                       es: "Me llamo Owen" },
    { en: "Let's be friends!",                     es: "¡Seamos amigos!" },
  ],
  'broccoli-ice-cream': [
    { en: "Do you like broccoli?",                 es: "¿Te gusta el brócoli?" },
    { en: "Yes, I do!",                            es: "¡Sí, me gusta!" },
    { en: "Do you like ice cream?",                es: "¿Te gusta el helado?" },
    { en: "Do you like broccoli ice cream?",       es: "¿Te gusta el helado de brócoli?" },
    { en: "No, I don't! Yucky!",                   es: "¡No, no me gusta! ¡Qué asco!" },
    { en: "Do you like donuts?",                   es: "¿Te gustan las donas?" },
    { en: "Do you like juice?",                    es: "¿Te gusta el jugo?" },
    { en: "Do you like donut juice?",              es: "¿Te gusta el jugo de dona?" },
    { en: "Do you like popcorn?",                  es: "¿Te gustan las palomitas?" },
    { en: "Do you like pizza?",                    es: "¿Te gusta la pizza?" },
    { en: "Do you like bananas?",                  es: "¿Te gustan los plátanos?" },
    { en: "Do you like soup?",                     es: "¿Te gusta la sopa?" },
  ],
  'days-of-the-week': [
    { en: "A fun song to learn the days of the week!", es: "¡Una canción para los días de la semana!" },
    { en: "Monday",    es: "Lunes"      },
    { en: "Tuesday",   es: "Martes"     },
    { en: "Wednesday", es: "Miércoles"  },
    { en: "Thursday",  es: "Jueves"     },
    { en: "Friday",    es: "Viernes"    },
    { en: "Saturday",  es: "Sábado"     },
    { en: "Sunday",    es: "Domingo"    },
    { en: "The days of the week!", es: "¡Los días de la semana!" },
  ],
  'abc-song': [
    { en: "Let's sing the ABC song!",              es: "¡Cantemos el abecedario!" },
    { en: "(When you see a duck — quack!)",        es: "(Cuando ves un pato — ¡cuac!)" },
    { en: "A, B, C, D, E, F, G",                   es: "A, B, C, D, E, F, G" },
    { en: "H, I, J, K, L, M, N, O, P",            es: "H, I, J, K, L, M, N, O, P" },
    { en: "Q, R, S, T, U, V",                      es: "Q, R, S, T, U, V" },
    { en: "W, X, Y and Z",                          es: "W, X, Y y Z" },
    { en: "Now I know my ABCs!",                    es: "¡Ahora conozco el abecedario!" },
  ],
  'baby-shark': [
    { en: "Baby Shark",    es: "Tiburón bebé",    dodo: true },
    { en: "Mommy Shark",   es: "Mamá tiburón",    dodo: true },
    { en: "Daddy Shark",   es: "Papá tiburón",    dodo: true },
    { en: "Grandma Shark", es: "Abuela tiburón",  dodo: true },
    { en: "Grandpa Shark", es: "Abuelo tiburón",  dodo: true },
    { en: "Let's Go Hunt", es: "¡Vamos a cazar!", dodo: true },
    { en: "Run Away",      es: "¡Corre!",          dodo: true },
    { en: "Safe At Last",  es: "¡A salvo!",        dodo: true },
    { en: "It's the End",  es: "Es el fin",        dodo: true },
  ],
  'head-shoulders-knees-toes': [
    { en: "Head, shoulders, knees and toes, knees and toes", es: "Cabeza, hombros, rodillas y pies, rodillas y pies" },
    { en: "And eyes and ears and mouth and nose",            es: "Y ojos y orejas y boca y nariz" },
  ],
  'if-you-are-happy': [
    { en: "If you're happy happy happy, clap your hands!", es: "Si estás feliz feliz feliz, ¡aplaude!" },
    { en: "If you're angry angry angry, stomp your feet!", es: "Si estás enojado enojado enojado, ¡patea!" },
    { en: "If you're scared scared scared, say oh no!",    es: "Si tienes miedo miedo miedo, ¡di oh no!" },
    { en: "If you're sleepy sleepy sleepy, take a nap!",   es: "Si tienes sueño sueño sueño, ¡toma una siesta!" },
  ],
  'feelings-emotions': [
    { en: "What do you do when you're happy?",   es: "¿Qué haces cuando estás feliz?" },
    { en: "When I'm happy, I laugh!",            es: "Cuando estoy feliz, ¡me río!" },
    { en: "What do you do when you're sad?",     es: "¿Qué haces cuando estás triste?" },
    { en: "When I'm sad, I cry!",                es: "Cuando estoy triste, ¡lloro!" },
    { en: "What do you do when you're angry?",   es: "¿Qué haces cuando estás enojado?" },
    { en: "When I'm angry, I stomp my feet!",    es: "Cuando estoy enojado, ¡pateo el suelo!" },
    { en: "What do you do when you're hungry?",  es: "¿Qué haces cuando tienes hambre?" },
    { en: "When I'm hungry, I eat a snack!",     es: "Cuando tengo hambre, ¡como un bocadillo!" },
    { en: "What do you do when you're sleepy?",  es: "¿Qué haces cuando tienes sueño?" },
    { en: "When I'm sleepy, I go to sleep!",     es: "Cuando tengo sueño, ¡me voy a dormir!" },
  ],
  'are-you-hungry': [
    { en: "Are you hungry?",             es: "¿Tienes hambre?" },
    { en: "Yes I am!",                   es: "¡Sí, tengo hambre!" },
    { en: "Mmm, a banana! Yum yum yum!", es: "¡Mmm, un plátano! Ñam ñam ñam." },
    { en: "Mmm, an apple! Yum yum yum!", es: "¡Mmm, una manzana! Ñam ñam ñam." },
    { en: "Mmm, watermelon! Yum yum yum!", es: "¡Mmm, sandía! Ñam ñam ñam." },
  ],
  weather: [
    { en: "How's the weather today?",                       es: "¿Cómo está el tiempo hoy?" },
    { en: "Is it sunny? Is it rainy? Is it cloudy? Is it snowy?", es: "¿Soleado? ¿Lluvioso? ¿Nublado? ¿Nevando?" },
    { en: "Let's look outside!",                            es: "¡Miremos afuera!" },
    { en: "How's the weather? Is it sunny today?",          es: "¿Cómo está el tiempo? ¿Está soleado hoy?" },
    { en: "How's the weather? Is it rainy today?",          es: "¿Cómo está el tiempo? ¿Está lluvioso hoy?" },
    { en: "How's the weather? Is it cloudy today?",         es: "¿Cómo está el tiempo? ¿Está nublado hoy?" },
    { en: "How's the weather? Is it snowy today?",          es: "¿Cómo está el tiempo? ¿Está nevando hoy?" },
  ],
  'fly-chicken': [
    { en: "How's the weather?",   es: "¿Cómo está el tiempo?" },
    { en: "It's sunny today!",    es: "¡Está soleado hoy!" },
    { en: "It's rainy today!",    es: "¡Está lluvioso hoy!" },
    { en: "It's cloudy today!",   es: "¡Está nublado hoy!" },
    { en: "It's windy today!",    es: "¡Está ventoso hoy!" },
    { en: "It's snowy today!",    es: "¡Está nevando hoy!" },
  ],
  'yes-i-can': [
    { en: "Little Bird, Little Bird, Can you Clap?",      es: "Pajarito, pajarito, ¿puedes aplaudir?" },
    { en: "No I Can't, No I Can't, I Can't Clap.",        es: "No puedo, no puedo, no puedo aplaudir." },
    { en: "Little Bird, Little Bird, Can you Fly?",       es: "Pajarito, pajarito, ¿puedes volar?" },
    { en: "Yes I Can. Yes I Can. I Can Fly.",             es: "Sí puedo. Sí puedo. Puedo volar." },
    { en: "Elephant, Elephant, Can you Fly?",             es: "Elefante, elefante, ¿puedes volar?" },
    { en: "No I Can't, No I Can't, I Can't Fly.",         es: "No puedo, no puedo, no puedo volar." },
    { en: "Elephant, Elephant, Can you Stomp?",           es: "Elefante, elefante, ¿puedes pisar fuerte?" },
    { en: "Yes I Can, Yes I Can, I Can Stomp.",           es: "Sí puedo, sí puedo, puedo pisar fuerte." },
    { en: "Little Fish, Little Fish, Can you Stomp?",     es: "Pececito, pececito, ¿puedes pisar fuerte?" },
    { en: "No I Can't, No I Can't, I Can't Stomp.",       es: "No puedo, no puedo, no puedo pisar fuerte." },
    { en: "Little Fish, Little Fish, Can you Swim?",      es: "Pececito, pececito, ¿puedes nadar?" },
    { en: "Yes I Swim. Yes I Swim. I Can Swim.",          es: "Sí nado. Sí nado. Puedo nadar." },
    { en: "Gorilla, Gorilla, Can you Swim?",              es: "Gorila, gorila, ¿puedes nadar?" },
    { en: "No I Can't, No I Can't, I Can't Swim.",        es: "No puedo, no puedo, no puedo nadar." },
    { en: "Gorilla, Gorilla, Can you Climb?",             es: "Gorila, gorila, ¿puedes trepar?" },
    { en: "Yes I Can, Yes I Can, I Can Climb.",           es: "Sí puedo, sí puedo, puedo trepar." },
    { en: "Buffalo, Buffalo, Can you Climb?",             es: "Búfalo, búfalo, ¿puedes trepar?" },
    { en: "No I Can't, No I Can't, I Can't Climb.",       es: "No puedo, no puedo, no puedo trepar." },
    { en: "Buffalo, Buffalo, Can you Run?",               es: "Búfalo, búfalo, ¿puedes correr?" },
    { en: "Yes I Can, Yes I Can, I Can Run.",             es: "Sí puedo, sí puedo, puedo correr." },
    { en: "Boys and Girls, Boys and Girls, Can you Sing?", es: "Niños y niñas, niños y niñas, ¿pueden cantar?" },
    { en: "Yes We Can, Yes We Can, We Can Sing.",         es: "Sí podemos, sí podemos, podemos cantar." },
    { en: "Boys and Girls, Boys and Girls, Can you Dance?", es: "Niños y niñas, niños y niñas, ¿pueden bailar?" },
    { en: "Yes We Can, Yes We Can, We Can Dance.",        es: "Sí podemos, sí podemos, podemos bailar." },
    { en: "We Can Sing, We Can Dance, Yes We Can!",       es: "¡Podemos cantar, podemos bailar, sí podemos!" },
  ],
  'this-is-my-face': [
    { en: "This is my face.",                      es: "Esta es mi cara." },
    { en: "Where is my nose? Here is my nose!",    es: "¿Dónde está mi nariz? ¡Aquí está!" },
    { en: "I have one nose.",                      es: "Tengo una nariz." },
    { en: "Where are my eyes? Here are my eyes!",  es: "¿Dónde están mis ojos? ¡Aquí están!" },
    { en: "I have two eyes.",                      es: "Tengo dos ojos." },
    { en: "Where is my mouth? Here is my mouth!",  es: "¿Dónde está mi boca? ¡Aquí está!" },
    { en: "I have one mouth.",                     es: "Tengo una boca." },
    { en: "Where are my ears? Here are my ears!",  es: "¿Dónde están mis orejas? ¡Aquí están!" },
    { en: "I have two ears.",                      es: "Tengo dos orejas." },
  ],
};

const VIDEOS = [
  { id: 'hello',                     title: 'Hello Song',                            ytId: 'gghDRJVxFxU' },
  { id: 'little-finger',             title: 'Little Finger',                         ytId: 'eBVqcTEC3zQ' },
  { id: 'goodbye',                   title: 'Goodbye Song',                          ytId: '0LDArAJf7-c' },
  { id: 'weather',                   title: 'How is the Weather',                    ytId: 'KBL5aXSJTlE' },
  { id: 'what-is-your-name',         title: 'What is Your Name?',                    ytId: 'yqlbn_nI2w8' },
  { id: 'are-you-hungry',            title: 'Are You Hungry?',                       ytId: 'ykTR0uFGwE0' },
  { id: 'broccoli-ice-cream',        title: 'Do You Like Broccoli or Ice Cream?',    ytId: 'frN3nvhIHUk' },
  { id: 'days-of-the-week',          title: 'Days of the Week',                      ytId: 'mXMofxtDPUQ' },
  { id: 'abc-song',                  title: 'ABC Song',                              ytId: 'I_3mbra4dHU' },
  { id: 'baby-shark',                title: 'Baby Shark',                            ytId: 'XqZsoesa55w' },
  { id: 'head-shoulders-knees-toes', title: 'Head, Shoulders, Knees and Toes',       ytId: 'RuqvGiZi0qg' },
  { id: 'if-you-are-happy',          title: 'If You Are Happy',                      ytId: 'wqvQAcloTRQ' },
  { id: 'feelings-emotions',         title: 'Feelings and Emotions Song',            ytId: 'eMOnyPxE_w8' },
  { id: 'fly-chicken',               title: 'How is the Weather? Fly Chicken',       ytId: 'I8GeA3anPdo' },
  { id: 'this-is-my-face',           title: 'This is My Face',                       ytId: '8ChQVaEAKsk' },
  { id: 'yes-i-can',                 title: 'Yes, I Can Song',                       ytId: '_Ir0Mc6Qilo' },
];

export default function ClassVideosPage() {
  const [selected, setSelected] = useState(VIDEOS[0]);
  const [activeLine, setActiveLine] = useState(null);

  const transcript = TRANSCRIPTS[selected.id] ?? null;

  function handleSelect(e) {
    setSelected(VIDEOS.find(v => v.id === e.target.value));
    setActiveLine(null);
  }

  return (
    <div style={{ padding: '14px 24px', maxWidth: 960 }}>

      {/* Header */}
      <div style={{ marginBottom: 10 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1D3A8A', letterSpacing: '-0.4px' }}>
          Class Videos
        </h1>
      </div>

      {/* Dropdown */}
      <select
        value={selected.id}
        onChange={handleSelect}
        style={{
          width:               '100%',
          background:          '#1D4ED8',
          color:               '#fff',
          border:              'none',
          borderRadius:         10,
          padding:             '10px 40px 10px 16px',
          fontSize:             15,
          fontWeight:           700,
          cursor:              'pointer',
          outline:             'none',
          marginBottom:         16,
          appearance:          'none',
          backgroundImage:     `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat:    'no-repeat',
          backgroundPosition:  'right 16px center',
        }}
      >
        {VIDEOS.map(v => (
          <option key={v.id} value={v.id}>{v.title}</option>
        ))}
      </select>

      {/* Video + Transcript row */}
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* Video */}
        <div style={{ flex: '2 1 340px', maxWidth: 620 }}>
          <div style={{
            width:       '100%',
            aspectRatio: '16 / 9',
            background:  '#1E293B',
            borderRadius: 12,
            overflow:    'hidden',
            boxShadow:   '0 8px 32px rgba(0,0,0,0.15)',
          }}>
            <iframe
              key={selected.ytId}
              src={`https://www.youtube.com/embed/${selected.ytId}?rel=0&modestbranding=1`}
              title={selected.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            />
          </div>
        </div>

        {/* Transcript */}
        <div style={{ flex: '1 1 190px', minWidth: 170 }}>
          {transcript ? (
            <div style={{ background: '#F1F5F9', borderRadius: 10, padding: '12px 14px' }}>
              {transcript.map((line, idx) => {
                const key = `${selected.id}-${idx}`;
                const isActive = activeLine === key;
                return (
                  <div
                    key={key}
                    style={{
                      padding:      '3px 8px',
                      borderRadius:  7,
                      marginBottom:  1,
                      background:    isActive ? '#DBEAFE' : 'transparent',
                      cursor:       'pointer',
                      transition:   'background 0.12s',
                      userSelect:   'none',
                    }}
                    onPointerEnter={(e) => { if (e.pointerType === 'mouse') setActiveLine(key); }}
                    onPointerLeave={(e) => { if (e.pointerType === 'mouse') setActiveLine(null); }}
                    onClick={() => setActiveLine(p => p === key ? null : key)}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', lineHeight: 1.4 }}>
                      {line.en}
                      {line.dodo && (
                        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 400, fontStyle: 'italic' }}> do-do-do-do-do-do</span>
                      )}
                    </div>
                    {isActive && (
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1D4ED8', marginTop: 3 }}>
                        {line.es}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: '#94A3B8', fontSize: 13, fontStyle: 'italic', paddingTop: 6 }}>
              Transcript coming soon
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
