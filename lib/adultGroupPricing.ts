export type GroupActivity = {
  name: string;
  ten: number;
  twenty: number;
  finishing?: number;
  note?: string;
};

// USD per participant. Finishing is per participant, including all stated pieces.
export const potteryGroups: GroupActivity[] = [
  { name: "Beginner Wheel Throwing", ten: 50, twenty: 45 },
  { name: "Date Night Wheel", ten: 40, twenty: 35, note: "Two people share each wheel. One piece per person: five pairs for 10 guests, ten pairs for 20." },
  { name: "Cup Creations on the Wheel", ten: 50, twenty: 45 },
  { name: "Matcha Bowl on the Wheel", ten: 50, twenty: 45 },
  { name: "Vase Making on the Wheel", ten: 55, twenty: 50 },
  { name: "Pumpkin on the Wheel", ten: 65, twenty: 60 },
  { name: "Make & Paint on the Wheel", ten: 60, twenty: 55 },
  { name: "General Handbuilding", ten: 45, twenty: 40, note: "One standard-size piece per person." },
  { name: "Ceramic Mug & Bowl", ten: 50, twenty: 45, finishing: 40, note: "Two pieces per person; the finished package covers both." },
  { name: "Handbuilt Vase Making", ten: 50, twenty: 45 },
  { name: "Cat Vase", ten: 45, twenty: 40 },
  { name: "Mushroom Pottery", ten: 45, twenty: 40 },
  { name: "Cauldron Pottery", ten: 55, twenty: 50 },
  { name: "Clay Pumpkin Lantern", ten: 55, twenty: 50 },
  { name: "Monster Lantern", ten: 55, twenty: 50 },
  { name: "Ghost Pottery", ten: 45, twenty: 40 },
  { name: "Oogie Boogie Candle Holder", ten: 50, twenty: 45 },
  { name: "Duck Soap Holder", ten: 45, twenty: 40 },
  { name: "Boobs Mug", ten: 50, twenty: 45 },
  { name: "Pussy Pottery", ten: 50, twenty: 45 },
  { name: "Dildos & Bottles", ten: 55, twenty: 50, note: "One sculptural piece per person." },
  { name: "Pipe & Ashtray", ten: 50, twenty: 45, finishing: 40, note: "Two pieces per person; the finished package covers both." },
  { name: "Make & Paint a Charcuterie Board", ten: 60, twenty: 55, finishing: 25, note: "One board each. Standard size confirmed before booking." },
  { name: "Paint Your Own Pottery", ten: 45, twenty: 40, note: "One standard ceramic blank. Without firing, the glaze remains unfinished; the fired package is recommended." },
  { name: "Ceramic Chess", ten: 65, twenty: 60, finishing: 40, note: "One set of chess pieces per pair. Finishing is $80 per shared set. Ceramic board excluded." },
  { name: "VIP Date Night on Fire", ten: 100, twenty: 95 },
  { name: "Open Studio Wheel", ten: 40, twenty: 35, note: "For experienced adults. Equipment access and supervision; no beginner lesson." },
];

export const otherGroups: GroupActivity[] = [
  { name: "Mosaic Creations", ten: 50, twenty: 45, note: "One standard mosaic base per person." },
  { name: "Hanging Turkish Mosaic Lamp", ten: 60, twenty: 55, note: "One hanging lamp per person." },
  { name: "Table Turkish Mosaic Lamp", ten: 95, twenty: 90, note: "One table lamp per person." },
  { name: "Glass Fusion", ten: 65, twenty: 60, note: "One small project per person. Kiln processing included." },
  { name: "Bonsai", ten: 75, twenty: 70, note: "One standard tree and pot per person." },
  { name: "Terrarium", ten: 55, twenty: 50, note: "One standard vessel and planting per person." },
  { name: "Candle Making", ten: 50, twenty: 45, note: "One standard candle per person." },
  { name: "Soap Making", ten: 50, twenty: 45, note: "Standard mold allocation per person." },
  { name: "Wine Glass Painting", ten: 45, twenty: 40, note: "Two glasses per person." },
  { name: "Acrylic Painting / Paint & Sip", ten: 45, twenty: 40, note: "One canvas per person." },
  { name: "Watercolor", ten: 50, twenty: 45, note: "Includes adult sessions with Yahya & Feeroozeh when available." },
  { name: "VIP Date Night Painting", ten: 60, twenty: 55, note: "One larger shared canvas per pair." },
];

export const specialGroups: GroupActivity[] = [
  { name: "Bath Bomb Making", ten: 45, twenty: 40 },
  { name: "Naughty Night Nude Painting", ten: 120, twenty: 100, note: "Adult painting session with a live model. Instructor, model, and city availability confirmed before booking." },
];

export const requestPotteryGroups: GroupActivity[] = [
  { name: "Heart Bowl", ten: 45, twenty: 40 },
  { name: "Plate Set", ten: 55, twenty: 50, finishing: 40, note: "Two small plates per person; the finished package covers both." },
];

export const usd = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
