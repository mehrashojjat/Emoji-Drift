// ─── js/data.js ──────────────────────────────────────────────────────────────
// Static emoji data: pools, names, rarity tables, weighted world pool.

'use strict';

/** Expressive / face-like emojis — also used as world objects (uncommon rarity) */
export const FACE_POOL = [
  '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😊','😇','🥰','😍','🤩','😘',
  '😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🧐','😎','🥳','🥸','😏',
  '😒','🙄','😬','😌','😔','😪','😵','🤯','🤠','😕','🙁','☹️','😦','😧','😨',
  '😱','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾',
  '🤖','😺','😸','😹','😻','😼','😽','🙀','😿','😾','🫠','🫡','🫢','🫣','🥹',
  '😤','😩','😫','🥱','🤥','🤤','🤢','🤮','🤧','🥵','🥶','🥴','🤕','🤒','😷',
];

/** World-object emoji pools organised by category */
export const POOLS = {
  food: [
    '🍎','🍊','🍋','🍇','🍓','🫐','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🥑',
    '🥦','🥬','🥒','🌶️','🌽','🥕','🧄','🧅','🥐','🥖','🫓','🧀','🥚','🥞',
    '🧇','🥓','🥩','🍗','🍖','🌮','🌯','🍝','🍜','🍲','🍛','🍣','🍱','🥟',
    '🍤','🍙','🍚','🥮','🧁','🎂','🍰','🍮','🍭','🍬','🍫','🍿','🍩','🍪',
    '🍯','🍺','🍸','🍹','🥤','🧋','☕','🍵','🧃','🥛','🥂','🍾','🍷','🥗',
    '🫙','🥫','🍱','🥙','🧆','🥘','🫕','🥣','🥧','🍼','🫗','🍶','🫖',
  ],
  animals: [
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸',
    '🐵','🙈','🙉','🙊','🐔','🐧','🐦','🦆','🦅','🦉','🦇','🐺','🐴','🦄',
    '🐝','🦋','🐌','🐞','🦟','🕷️','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑',
    '🦐','🦀','🐠','🐟','🐬','🐳','🦈','🐊','🐅','🐆','🦓','🐘','🦛','🦏',
    '🐪','🦒','🦘','🐎','🐑','🦙','🐐','🦌','🐕','🐈','🐓','🦃','🦚','🦜',
    '🦢','🦩','🕊️','🐇','🦝','🦨','🦦','🦥','🐁','🐿️','🦔','🦬','🦣','🦤',
    '🪲','🪳','🪰','🪱','🦭','🦫','🐾',
  ],
  nature: [
    '🌸','🌺','🌻','🌹','🌷','💐','🌼','🪷','🌿','☘️','🍀','🍁','🍂','🍃',
    '🌱','🌲','🌳','🌴','🪨','🪵','🌵','🎋','🌾','🍄','🌊','🌈','⭐','🌟',
    '✨','💫','⚡','🔥','💧','🌙','☀️','❄️','☃️','⛄','🌪️','🌝','🌚','🌕',
    '🌠','☄️','🪐','🏔️','⛰️','🌋','🏝️','🌅','🌄','🎇','🎆','🌃','🌌','🌠',
    '🌬️','🌫️','⛅','🌤️','🌦️','🌧️','⛈️','🌩️','🌨️','🌑','🌒','🌓','🌔',
  ],
  objects: [
    '⚽','🏀','🏈','⚾','🎾','🏐','🎱','🎯','🎲','🎮','🕹️','🧩','🎸','🎺',
    '🎷','🎹','🥁','🎵','🎶','🎤','🎧','📱','💻','⌚','📷','🔭','🔬','💡',
    '🔦','🕯️','🪔','🧲','💊','💉','🔑','🗝️','💎','💍','👑','🏆','🥇','🎖️',
    '🎗️','🎫','🎪','🎡','🎢','🎠','🎭','🎨','🪆','🧸','🪅','🎀','🎁','🎊',
    '🎉','🎈','🔮','🧿','🪄','⚜️','🏵️','🎎','🎐','🎑','🧧','🪬','🪩','🪞',
    '🪟','🛋️','🚪','🪣','🧺','🧻','🧼','🪥','🫧','⚗️','🧪','🧫','🧬',
  ],
  symbols: [
    '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓',
    '💗','💖','💘','💝','💟','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤',
    '💠','🔶','🔷','🔸','🔹','🔺','🔻','♠️','♥️','♦️','♣️','🃏','🀄','🎴',
    '💯','✅','❎','⭕','❌','❓','❗','💥','💢','💫','💦','💨','💤','🕳️',
    '🌀','🔔','🔕','📌','📍','🔖','🏷️','💬','💭','🗨️','🗯️','📣','📢',
  ],
};

/** Per-tier spawn weight */
export const RARITY_WEIGHTS = {
  common:    1.000,
  uncommon:  0.200,
  rare:      0.045,
  epic:      0.008,
  legendary: 0.001,
};

/** Hex glow / badge colour per tier */
export const RARITY_COLORS = {
  common:    '#9ca3af',
  uncommon:  '#4ade80',
  rare:      '#60a5fa',
  epic:      '#c084fc',
  legendary: '#facc15',
};

/** Human-readable names for every emoji in the game */
export const EMOJI_NAMES = {
  // Faces
  '😀':'Grinning Face','😃':'Grinning Face with Big Eyes','😄':'Grinning Face with Smiling Eyes',
  '😁':'Beaming Face with Smiling Eyes','😆':'Grinning Squinting Face','😅':'Grinning Face with Sweat',
  '🤣':'Rolling on the Floor Laughing','😂':'Face with Tears of Joy','🙂':'Slightly Smiling Face',
  '😊':'Smiling Face with Smiling Eyes','😇':'Smiling Face with Halo','🥰':'Smiling Face with Hearts',
  '😍':'Smiling Face with Heart-Eyes','🤩':'Star-Struck','😘':'Face Blowing a Kiss',
  '😋':'Face Savoring Food','😛':'Face with Tongue','😜':'Winking Face with Tongue',
  '🤪':'Zany Face','😝':'Squinting Face with Tongue','🤑':'Money-Mouth Face',
  '🤗':'Smiling Face with Open Hands','🤭':'Face with Hand Over Mouth','🤫':'Shushing Face',
  '🤔':'Thinking Face','🧐':'Face with Monocle','😎':'Smiling Face with Sunglasses',
  '🥳':'Partying Face','🥸':'Disguised Face','😏':'Smirking Face','😒':'Unamused Face',
  '🙄':'Face with Rolling Eyes','😬':'Grimacing Face','😌':'Relieved Face',
  '😔':'Pensive Face','😪':'Sleepy Face','😵':'Dizzy Face','🤯':'Exploding Head',
  '🤠':'Cowboy Hat Face','😕':'Confused Face','🙁':'Slightly Frowning Face',
  '☹️':'Frowning Face','😦':'Frowning Face with Open Mouth','😧':'Anguished Face',
  '😨':'Fearful Face','😱':'Face Screaming in Fear','😡':'Enraged Face','😠':'Angry Face',
  '🤬':'Face with Symbols on Mouth','😈':'Smiling Face with Horns','👿':'Angry Face with Horns',
  '💀':'Skull','☠️':'Skull and Crossbones','💩':'Pile of Poo','🤡':'Clown Face',
  '👹':'Ogre','👺':'Goblin','👻':'Ghost','👽':'Alien','👾':'Alien Monster','🤖':'Robot',
  '😺':'Grinning Cat','😸':'Grinning Cat with Smiling Eyes','😹':'Cat with Tears of Joy',
  '😻':'Smiling Cat with Heart-Eyes','😼':'Cat with Wry Smile','😽':'Kissing Cat',
  '🙀':'Weary Cat','😿':'Crying Cat','😾':'Pouting Cat','🫠':'Melting Face',
  '🫡':'Saluting Face','🫢':'Face with Open Eyes and Hand Over Mouth','🫣':'Face with Peeking Eye',
  '🥹':'Face Holding Back Tears','😤':'Face with Steam from Nose','😩':'Weary Face',
  '😫':'Tired Face','🥱':'Yawning Face','🤥':'Lying Face','🤤':'Drooling Face',
  '🤢':'Nauseated Face','🤮':'Face Vomiting','🤧':'Sneezing Face','🥵':'Hot Face',
  '🥶':'Cold Face','🥴':'Woozy Face','🤕':'Face with Head-Bandage','🤒':'Face with Thermometer',
  '😷':'Face with Medical Mask',
  // Food
  '🍎':'Red Apple','🍊':'Tangerine','🍋':'Lemon','🍇':'Grapes','🍓':'Strawberry',
  '🫐':'Blueberries','🍒':'Cherries','🍑':'Peach','🥭':'Mango','🍍':'Pineapple',
  '🥥':'Coconut','🥝':'Kiwi Fruit','🍅':'Tomato','🥑':'Avocado','🥦':'Broccoli',
  '🥬':'Leafy Greens','🥒':'Cucumber','🌶️':'Hot Pepper','🌽':'Ear of Corn','🥕':'Carrot',
  '🧄':'Garlic','🧅':'Onion','🥐':'Croissant','🥖':'Baguette Bread','🫓':'Flatbread',
  '🧀':'Cheese Wedge','🥚':'Egg','🥞':'Pancakes','🧇':'Waffle','🥓':'Bacon',
  '🥩':'Cut of Meat','🍗':'Poultry Leg','🍖':'Meat on Bone','🌮':'Taco','🌯':'Burrito',
  '🍝':'Spaghetti','🍜':'Steaming Bowl','🍲':'Pot of Food','🍛':'Curry Rice','🍣':'Sushi',
  '🍱':'Bento Box','🥟':'Dumpling','🍤':'Fried Shrimp','🍙':'Rice Ball','🍚':'Cooked Rice',
  '🥮':'Moon Cake','🧁':'Cupcake','🎂':'Birthday Cake','🍰':'Shortcake','🍮':'Custard',
  '🍭':'Lollipop','🍬':'Candy','🍫':'Chocolate Bar','🍿':'Popcorn','🍩':'Doughnut',
  '🍪':'Cookie','🍯':'Honey Pot','🍺':'Beer Mug','🍸':'Cocktail Glass','🍹':'Tropical Drink',
  '🥤':'Cup with Straw','🧋':'Bubble Tea','☕':'Hot Beverage','🍵':'Teacup Without Handle',
  '🧃':'Beverage Box','🥛':'Glass of Milk','🥂':'Clinking Glasses',
  '🍾':'Bottle with Popping Cork','🍷':'Wine Glass','🥗':'Green Salad','🫙':'Jar',
  '🥫':'Canned Food','🥙':'Stuffed Flatbread','🧆':'Falafel','🥘':'Shallow Pan of Food',
  '🫕':'Fondue','🥣':'Bowl with Spoon','🥧':'Pie','🍼':'Baby Bottle',
  '🫗':'Pouring Liquid','🍶':'Sake','🫖':'Teapot',
  // Animals
  '🐶':'Dog Face','🐱':'Cat Face','🐭':'Mouse Face','🐹':'Hamster','🐰':'Rabbit Face',
  '🦊':'Fox','🐻':'Bear','🐼':'Panda','🐨':'Koala','🐯':'Tiger Face','🦁':'Lion',
  '🐮':'Cow Face','🐷':'Pig Face','🐸':'Frog','🐵':'Monkey Face','🙈':'See-No-Evil Monkey',
  '🙉':'Hear-No-Evil Monkey','🙊':'Speak-No-Evil Monkey','🐔':'Chicken','🐧':'Penguin',
  '🐦':'Bird','🦆':'Duck','🦅':'Eagle','🦉':'Owl','🦇':'Bat','🐺':'Wolf',
  '🐴':'Horse Face','🦄':'Unicorn','🐝':'Honeybee','🦋':'Butterfly','🐌':'Snail',
  '🐞':'Lady Beetle','🦟':'Mosquito','🕷️':'Spider','🦂':'Scorpion','🐢':'Turtle',
  '🐍':'Snake','🦎':'Lizard','🦖':'T-Rex','🦕':'Sauropod','🐙':'Octopus','🦑':'Squid',
  '🦐':'Shrimp','🦀':'Crab','🐠':'Tropical Fish','🐟':'Fish','🐬':'Dolphin','🐳':'Whale',
  '🦈':'Shark','🐊':'Crocodile','🐅':'Tiger','🐆':'Leopard','🦓':'Zebra','🐘':'Elephant',
  '🦛':'Hippopotamus','🦏':'Rhinoceros','🐪':'Camel','🦒':'Giraffe','🦘':'Kangaroo',
  '🐎':'Horse','🐑':'Ewe','🦙':'Llama','🐐':'Goat','🦌':'Deer','🐕':'Dog','🐈':'Cat',
  '🐓':'Rooster','🦃':'Turkey','🦚':'Peacock','🦜':'Parrot','🦢':'Swan','🦩':'Flamingo',
  '🕊️':'Dove','🐇':'Rabbit','🦝':'Raccoon','🦨':'Skunk','🦦':'Otter','🦥':'Sloth',
  '🐁':'Mouse','🐿️':'Chipmunk','🦔':'Hedgehog','🦬':'Bison','🦣':'Mammoth',
  '🦤':'Dodo','🪲':'Beetle','🪳':'Cockroach','🪰':'Fly','🪱':'Worm','🦭':'Seal',
  '🦫':'Beaver','🐾':'Paw Prints',
  // Nature
  '🌸':'Cherry Blossom','🌺':'Hibiscus','🌻':'Sunflower','🌹':'Rose','🌷':'Tulip',
  '💐':'Bouquet','🌼':'Blossom','🪷':'Lotus','🌿':'Herb','☘️':'Shamrock','🍀':'Four-Leaf Clover',
  '🍁':'Maple Leaf','🍂':'Fallen Leaf','🍃':'Leaf Fluttering in Wind','🌱':'Seedling',
  '🌲':'Evergreen Tree','🌳':'Deciduous Tree','🌴':'Palm Tree','🪨':'Rock','🪵':'Wood',
  '🌵':'Cactus','🎋':'Tanabata Tree','🌾':'Sheaf of Rice','🍄':'Mushroom','🌊':'Water Wave',
  '🌈':'Rainbow','⭐':'Star','🌟':'Glowing Star','✨':'Sparkles','💫':'Dizzy',
  '⚡':'Lightning','🔥':'Fire','💧':'Droplet','🌙':'Crescent Moon','☀️':'Sun',
  '❄️':'Snowflake','☃️':'Snowman','⛄':'Snowman Without Snow','🌪️':'Tornado',
  '🌝':'Full Moon Face','🌚':'New Moon Face','🌕':'Full Moon','🌠':'Shooting Star',
  '☄️':'Comet','🪐':'Ringed Planet','🏔️':'Snow-Capped Mountain','⛰️':'Mountain',
  '🌋':'Volcano','🏝️':'Desert Island','🌅':'Sunrise over Mountains','🌄':'Sunrise',
  '🎇':'Sparkler','🎆':'Fireworks','🌃':'Night with Stars','🌌':'Milky Way',
  '🌬️':'Wind Face','🌫️':'Fog','⛅':'Sun Behind Cloud','🌤️':'Sun Behind Small Cloud',
  '🌦️':'Sun Behind Rain Cloud','🌧️':'Cloud with Rain','⛈️':'Cloud with Lightning and Rain',
  '🌩️':'Cloud with Lightning','🌨️':'Cloud with Snow','🌑':'New Moon','🌒':'Waxing Crescent Moon',
  '🌓':'First Quarter Moon','🌔':'Waxing Gibbous Moon',
  // Objects
  '⚽':'Soccer Ball','🏀':'Basketball','🏈':'American Football','⚾':'Baseball',
  '🎾':'Tennis','🏐':'Volleyball','🎱':'Pool 8 Ball','🎯':'Bullseye','🎲':'Game Die',
  '🎮':'Video Game','🕹️':'Joystick','🧩':'Puzzle Piece','🎸':'Guitar','🎺':'Trumpet',
  '🎷':'Saxophone','🎹':'Musical Keyboard','🥁':'Drum','🎵':'Musical Note',
  '🎶':'Musical Notes','🎤':'Microphone','🎧':'Headphones','📱':'Mobile Phone',
  '💻':'Laptop','⌚':'Watch','📷':'Camera','🔭':'Telescope','🔬':'Microscope',
  '💡':'Light Bulb','🔦':'Flashlight','🕯️':'Candle','🪔':'Diya Lamp','🧲':'Magnet',
  '💊':'Pill','💉':'Syringe','🔑':'Key','🗝️':'Old Key','💎':'Gem Stone','💍':'Ring',
  '👑':'Crown','🏆':'Trophy','🥇':'1st Place Medal','🎖️':'Military Medal',
  '🎗️':'Reminder Ribbon','🎫':'Ticket','🎪':'Circus Tent','🎡':'Ferris Wheel',
  '🎢':'Roller Coaster','🎠':'Carousel Horse','🎭':'Performing Arts','🎨':'Artist Palette',
  '🪆':'Nesting Dolls','🧸':'Teddy Bear','🪅':'Piñata','🎀':'Ribbon','🎁':'Wrapped Gift',
  '🎊':'Confetti Ball','🎉':'Party Popper','🎈':'Balloon','🔮':'Crystal Ball',
  '🧿':'Nazar Amulet','🪄':'Magic Wand','⚜️':'Fleur-de-Lis','🏵️':'Rosette',
  '🎎':'Japanese Dolls','🎐':'Wind Chime','🎑':'Moon Viewing Ceremony','🧧':'Red Envelope',
  '🪬':'Hamsa','🪩':'Mirror Ball','🪞':'Mirror','🪟':'Window','🛋️':'Couch and Lamp',
  '🚪':'Door','🪣':'Bucket','🧺':'Basket','🧻':'Roll of Paper','🧼':'Soap',
  '🪥':'Toothbrush','🫧':'Bubbles','⚗️':'Alembic','🧪':'Test Tube','🧫':'Petri Dish',
  '🧬':'DNA',
  // Symbols
  '❤️':'Red Heart','🧡':'Orange Heart','💛':'Yellow Heart','💚':'Green Heart',
  '💙':'Blue Heart','💜':'Purple Heart','🖤':'Black Heart','🤍':'White Heart',
  '🤎':'Brown Heart','💔':'Broken Heart','❣️':'Heart Exclamation','💕':'Two Hearts',
  '💞':'Revolving Hearts','💓':'Beating Heart','💗':'Growing Heart','💖':'Sparkling Heart',
  '💘':'Heart with Arrow','💝':'Heart with Ribbon','💟':'Heart Decoration',
  '🔴':'Red Circle','🟠':'Orange Circle','🟡':'Yellow Circle','🟢':'Green Circle',
  '🔵':'Blue Circle','🟣':'Purple Circle','⚫':'Black Circle','⚪':'White Circle',
  '🟤':'Brown Circle','💠':'Diamond with a Dot','🔶':'Large Orange Diamond',
  '🔷':'Large Blue Diamond','🔸':'Small Orange Diamond','🔹':'Small Blue Diamond',
  '🔺':'Red Triangle Pointed Up','🔻':'Red Triangle Pointed Down','♠️':'Spade Suit',
  '♥️':'Heart Suit','♦️':'Diamond Suit','♣️':'Club Suit','🃏':'Joker','🀄':'Mahjong Red Dragon',
  '🎴':'Flower Playing Cards','💯':'Hundred Points','✅':'Check Mark Button',
  '❎':'Cross Mark Button','⭕':'Red Circle','❌':'Cross Mark','❓':'Red Question Mark',
  '❗':'Red Exclamation Mark','💥':'Collision','💢':'Anger Symbol','💦':'Sweat Droplets',
  '💨':'Dashing Away','💤':'Zzz','🕳️':'Hole','🌀':'Cyclone','🔔':'Bell','🔕':'Bell with Slash',
  '📌':'Pushpin','📍':'Round Pushpin','🔖':'Bookmark','🏷️':'Label','💬':'Speech Balloon',
  '💭':'Thought Balloon','🗨️':'Left Speech Bubble','🗯️':'Right Anger Bubble',
  '📣':'Megaphone','📢':'Loudspeaker',
};

/** Specific emojis elevated above their pool default */
export const RARITY_OVERRIDES = {
  '👺': 'legendary',
  '💀': 'epic', '☠️': 'epic', '👿': 'epic', '😈': 'epic',
  '🤖': 'epic', '👾': 'epic', '👽': 'epic', '🤡': 'epic',
  '💎': 'epic', '👑': 'epic', '🏆': 'epic', '🔮': 'epic',
  '☄️': 'epic', '🪄': 'epic', '🌌': 'epic',
  '👻': 'rare', '💩': 'rare', '🤯': 'rare', '😵': 'rare', '😱': 'rare',
  '🦄': 'rare', '🦋': 'rare', '🕷️': 'rare', '🦂': 'rare',
  '🦖': 'rare', '🦕': 'rare', '🦈': 'rare', '🐊': 'rare',
  '🐅': 'rare', '🐆': 'rare', '🎭': 'rare', '🎨': 'rare',
  '🌈': 'rare', '🔥': 'rare', '⭐': 'rare', '🌟': 'rare',
  '✨': 'rare', '💫': 'rare', '⚡': 'rare', '❤️': 'rare',
  '💠': 'rare', '🎆': 'rare', '🎇': 'rare', '🧿': 'rare',
};

/** Rarity tiers in descending order of prestige (used for sorting/display) */
export const RARITY_TIERS = [
  { key: 'legendary', label: 'Legendary' },
  { key: 'epic',      label: 'Epic' },
  { key: 'rare',      label: 'Rare' },
  { key: 'uncommon',  label: 'Uncommon' },
  { key: 'common',    label: 'Common' },
];

/** Set for O(1) face lookup */
export const FACE_SET = new Set(FACE_POOL);

export function getRarity(e) {
  if (RARITY_OVERRIDES[e]) return RARITY_OVERRIDES[e];
  if (FACE_SET.has(e))     return 'uncommon';
  return 'common';
}

/** Flat weighted pool built once at module load — all pool + face emojis */
export const WORLD_POOL_FLAT = [];
export let   WORLD_POOL_TOTAL = 0;

(function buildWorldPool() {
  const seen = new Set();
  const add = (e) => {
    if (seen.has(e)) return;
    seen.add(e);
    const rarity = getRarity(e);
    const w      = RARITY_WEIGHTS[rarity];
    WORLD_POOL_FLAT.push({ e, rarity, w });
    WORLD_POOL_TOTAL += w;
  };
  for (const cat of Object.values(POOLS)) for (const e of cat) add(e);
  for (const e of FACE_POOL)                                    add(e);
}());

export function pickWorldItem() {
  let r = Math.random() * WORLD_POOL_TOTAL;
  for (const item of WORLD_POOL_FLAT) {
    r -= item.w;
    if (r <= 0) return item;
  }
  return WORLD_POOL_FLAT[0];
}

export function pickWorld() { return pickWorldItem().e; }
