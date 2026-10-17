const fs = require('fs');
const path = require('path');

const token = process.env.EVENTBRITE_PRIVATE_TOKEN || process.env.EVENTBRITE_TOKEN;
const orgId = process.env.EVENTBRITE_ORGANIZATION_ID || process.env.EVENTBRITE_ORG_ID;

if (!token || !orgId) {
  console.error("Missing EVENTBRITE credentials.");
  process.exit(1);
}

const manifestContent = fs.readFileSync('lib/homepage/manifest.ts', 'utf8');
const photosMatch = manifestContent.match(/export const APPROVED_PHOTOS: ApprovedPhoto\[\] = (\[[\s\S]*?\n\];)/);
const photos = eval(photosMatch[1]);
// We might not have .gemini_image_map.json anymore, so we need to fetch it dynamically or recreate it.
// To avoid uploading everything again, we'll implement a robust image resolver.
const IMAGE_MAP_FILE = '.gemini_image_map.json';
let imageMap = {};
if (fs.existsSync(IMAGE_MAP_FILE)) {
  imageMap = JSON.parse(fs.readFileSync(IMAGE_MAP_FILE, 'utf8'));
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function normalizeActivity(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/\b(chicago|eugene|online|virtual|zoom)\b/gi, ' ')
    .replace(/\b(workshop|class|for beginners|beginners|hands-on|byob)\b/gi, ' ')
    .replace(/color cocktail factory/gi, ' ')
    .replace(/\+.*$/, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function matchImage(title, location = '') {
  const t = title.toLowerCase();

  if (t.includes('date night on the pottery wheel') || t.includes('chicago date night pottery') || t.includes('date night on the wheel') || t.includes('date night on fire')) {
    if (t.includes('on fire')) return photos.find(p => p.filename.includes('Date Night On Fire'));
    if (location.toLowerCase().includes('eugene') || t.includes('eugene')) {
      return photos.find(p => p.filename.includes('Eugene Date Night On The Wheel')) || photos.find(p => p.filename.includes('Chicago Date Night Pottery'));
    }
    return photos.find(p => p.filename.includes('Chicago Date Night Pottery'));
  }
  if (t.includes('cauldron')) {
    if (t.includes('online')) return photos.find(p => p.filename.includes('Make a Clay Cauldron'));
    return photos.find(p => p.filename.includes('Spin A Spell- Make your Own Clay Cauldron'));
  }
  if (t.includes('beginners wheel throwing') || t.includes('wheel throwing for beginners') || t.includes('open studio wheel')) {
    if (t.includes('cup')) return photos.find(p => p.filename.includes('Cup Creations') || p.filename.includes('Cup creations'));
    if (t.includes('matcha')) return photos.find(p => p.filename.includes('Matcha Bowl'));
    if (t.includes('vase')) return photos.find(p => p.filename.includes('Vase Making'));
    if (t.includes('make and paint')) return photos.find(p => p.filename.includes('Make And Paint - Wheel throwing'));
    if (t.includes('open studio')) return photos.find(p => p.filename.includes('Open Studio Wheel throwing'));
    return photos.find(p => p.filename.includes('Wheel Throwing for Beginners - Chicago') || p.filename.includes('BEGINNERS WHEEL THROWING'));
  }
  if (t.includes('turkish') || t.includes('lamp')) {
    if (t.includes('hanging')) return photos.find(p => p.filename.includes('Hanging Turkish Mosaic Lamp'));
    return photos.find(p => p.filename.includes('Turkish Mosaic Lamp - Chicago'));
  }
  if (t.includes('terrarium')) return photos.find(p => p.filename.includes('Terrarium Workshop'));
  if (t.includes('bonsai')) {
    if (t.includes('date night') || t.includes('vip')) return photos.find(p => p.filename.includes('Date Night Bonsai VIP'));
    return photos.find(p => p.filename.includes('Bonsai for Beginners'));
  }
  if (t.includes('candle')) {
    if (t.includes('oogie boogie')) return photos.find(p => p.filename.includes('OOGIE BOOGIE'));
    if (t.includes('date night')) return photos.find(p => p.filename.includes('Date Night Candle Making'));
    return photos.find(p => p.filename.includes('Candle Making - Chicago'));
  }
  if (t.includes('soap')) {
    if (t.includes('duck')) return photos.find(p => p.filename.includes('Duck Soap holder'));
    return photos.find(p => p.filename.includes('Soap Making - Chicago'));
  }
  if (t.includes('mosaic creations')) return photos.find(p => p.filename.includes('Mosaic Creations'));
  if (t.includes('paint night') || t.includes('sip & paint') || t.includes('vip date night paint')) {
    return photos.find(p => p.filename.includes('VIP DATE NIGHT PAINT NIGHT'));
  }
  if (t.includes('water color') || t.includes('watercolor')) {
    if (t.includes('two') || t.includes('date night')) {
      if (t.includes('eugene')) return photos.find(p => p.filename.includes('Date Night Watercolor Painting for Two - Eugene'));
      return photos.find(p => p.filename.includes('Date Night Watercolor Painting for Two - Chicago'));
    }
    return photos.find(p => p.filename.includes('Water Color For Beginners'));
  }
  if (t.includes('wine glass')) return photos.find(p => p.filename.includes('Wine Glass Painting - Chicago')) || photos.find(p => p.filename.includes('Wine Glass Painting'));
  if (t.includes('paint pottery')) return photos.find(p => p.filename.includes('Paint Pottery - Chicago'));
  if (t.includes('charcuterie')) {
    if (t.includes('eugene')) return photos.find(p => p.filename.includes('Eugene : Make Your Own Charcuterie Board'));
    return photos.find(p => p.filename.includes('Charcuterie Board Make And Paint'));
  }
  if (t.includes('chess set')) return photos.find(p => p.filename.includes('Ceramic Chess Set'));
  if (t.includes('mug and a bowl')) {
    if (t.includes('eugene')) return photos.find(p => p.filename.includes('Eugene: Ceramic Mug and a Bowl'));
    return photos.find(p => p.filename.includes('Ceramic Mug and a Bowl - Chicago'));
  }
  if (t.includes('boobs')) return photos.find(p => p.filename.includes('Boobs Coffee Mug'));
  if (t.includes('dildo') || t.includes('bottles')) return photos.find(p => p.filename.includes('Dildos and Bottles'));
  if (t.includes('pussy pottery')) return photos.find(p => p.filename.includes('Pussy Pottery'));
  if (t.includes('cat vase')) return photos.find(p => p.filename.includes('Cat Vase Making'));
  if (t.includes('mushroom')) {
    if (t.includes('eugene')) return photos.find(p => p.filename.includes('Eugene Mushroom Pottery'));
    return photos.find(p => p.filename.includes('Mushroom Pottery - Chicago'));
  }
  if (t.includes('pumpkin')) {
    if (t.includes('throw') || t.includes('wheel')) return photos.find(p => p.filename.includes('Throw A Pumpkin On The Wheel'));
    return photos.find(p => p.filename.includes('Halloween Pottery: Carve Your Own Clay Pumpkin'));
  }
  if (t.includes('ghost')) return photos.find(p => p.filename.includes('Halloween Ghost Pottey!'));
  if (t.includes('lantern') || t.includes('monster')) return photos.find(p => p.filename.includes('MONSTER POTTERY! HALLOWEEN LANTERN CLASS'));
  if (t.includes('pipe') || t.includes('ashtray')) {
    if (t.includes('eugene')) return photos.find(p => p.filename.includes('Eugene Pipe and Ashtray Making Class'));
    return photos.find(p => p.filename.includes('Pipe and Ashtray Making Class - Chicago'));
  }
  if (t.includes('vase making') && t.includes('handbuilding')) return photos.find(p => p.filename.includes('Handbuilding For Beginners - Vase Making'));

  return null;
}

const venueCache = new Map();
async function getVenue(venueId) {
  if (!venueId) return null;
  if (venueCache.has(venueId)) return venueCache.get(venueId);
  try {
    const d = await apiRequest('GET', `venues/${venueId}/`);
    const city = (d.address?.city || '').toLowerCase();
    const loc = city.includes('chicago') ? 'Chicago' : city.includes('eugene') ? 'Eugene' : (d.address?.city || 'Unknown');
    const v = { id: venueId, name: d.name, city: d.address?.city, region: d.address?.region, loc };
    venueCache.set(venueId, v);
    return v;
  } catch {
    return null;
  }
}

async function apiRequest(method, urlPath, body) {
  const url = `https://www.eventbriteapi.com/v3/${urlPath.replace(/^\//, '')}`;
  let retries = 0;
  while (true) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let res;
    try {
      res = await fetch(url, {
        method,
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(body ? { 'Content-Type': 'application/json' } : {})
        },
        body: body ? JSON.stringify(body) : undefined
      });
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log(`[Timeout] Request to ${urlPath} timed out. Retrying...`);
        retries++;
        await sleep(2000);
        continue;
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }

    if (res.status === 429) {
      retries++;
      const rateLimitHeader = res.headers.get('x-rate-limit');
      let waitSeconds = 30;
      if (rateLimitHeader) {
        const match = rateLimitHeader.match(/reset=(\d+)s/);
        if (match) waitSeconds = Math.min(parseInt(match[1], 10) + 2, 320);
      }
      console.log(`\n[Rate limited] Waiting ${waitSeconds}s before retrying (${retries}/10)...`);
      await sleep(waitSeconds * 1000);
      continue;
    }

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return data;
  }
}

async function uploadImage(photo) {
  const sharp = require('sharp');
  const localPath = path.join('public', photo.path.replace(/^\//, ''));
  if (!fs.existsSync(localPath)) return null;

  const jpegBuffer = await sharp(localPath).jpeg({ quality: 90 }).toBuffer();

  const initRes = await apiRequest('GET', 'media/upload/?type=image-event-logo');
  
  const formData = new FormData();
  for (const [k, v] of Object.entries(initRes.upload_data)) {
    formData.append(k, v);
  }
  const blob = new Blob([jpegBuffer], { type: 'image/jpeg' });
  formData.append(initRes.file_parameter_name, blob, 'logo.jpeg');

  const s3Res = await fetch(initRes.upload_url, { method: 'POST', body: formData });
  if (!s3Res.ok) throw new Error('S3 upload failed: ' + s3Res.status);

  const confirmForm = new FormData();
  confirmForm.append('upload_token', initRes.upload_token);
  const confirmRes = await fetch('https://www.eventbriteapi.com/v3/media/upload/', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: confirmForm
  });
  const confirmData = await confirmRes.json();
  return confirmData.id;
}

async function setChicagoTaxSettings(eventId) {
  const body = {
    template_id: 81723,
    responses: [
      { question_id: 81723, answer_id: 81725, answer_text: 'No' },
      { question_id: 81726, answer_id: 81728, answer_text: 'No' },
      { question_id: 81729, answer_id: 81731, answer_text: 'No' },
      { question_id: 81732, answer_id: 81734, answer_text: 'No' },
      { question_id: 81735, answer_id: 81737, answer_text: 'No' },
      { question_id: 81738, answer_id: 81741, answer_text: 'No — in-person only' },
      { question_id: 81748, answer_id: 81750, answer_text: 'unchecked' }
    ]
  };
  return apiRequest('POST', `events/${eventId}/tax_settings/`, body);
}

async function main() {
  console.log('--- EVENTBRITE PUBLISHER ---');

  console.log('Loading live events for duplicate index...');
  let liveEvents = [];
  let page = 1;
  while (true) {
    const res = await apiRequest('GET', `organizations/${orgId}/events/?status=live&page=${page}`);
    if (!res.events || !res.events.length) break;
    liveEvents.push(...res.events);
    if (page >= (res.pagination?.page_count || 1)) break;
    page++;
    console.log(`Loaded ${liveEvents.length} live events...`);
  }
  const liveMap = new Map();
  liveEvents.forEach(e => {
    const norm = normalizeActivity(e.name?.text);
    const key = `${norm}|${e.start?.utc}`;
    if (!liveMap.has(key)) liveMap.set(key, e);
  });

  console.log('\nLoading all drafts...');
  let drafts = [];
  page = 1;
  while (true) {
    const res = await apiRequest('GET', `organizations/${orgId}/events/?status=draft&page=${page}`);
    if (!res.events || !res.events.length) break;
    drafts.push(...res.events);
    if (page >= (res.pagination?.page_count || 1)) break;
    page++;
    console.log(`Loaded ${drafts.length} drafts...`);
  }

  const now = new Date();
  let publishedCount = 0;
  let skippedCount = 0;

  console.log(`\nEvaluating and publishing ${drafts.length} drafts...`);

  for (let i = 0; i < drafts.length; i++) {
    const draft = drafts[i];
    const draftId = draft.id;
    const title = draft.name?.text || '';
    const startDate = new Date(draft.start?.utc);
    const timezone = draft.start?.timezone;
    const venueId = draft.venue_id;

    if (i % 25 === 0) console.log(`Processing draft ${i + 1}/${drafts.length} - Published: ${publishedCount}, Skipped/Invalid: ${skippedCount}`);

    // Past Check
    if (Number.isNaN(startDate.getTime()) || startDate < now) {
      skippedCount++;
      continue;
    }

    // Duplicate Check
    const norm = normalizeActivity(title);
    const key = `${norm}|${draft.start?.utc}`;
    if (liveMap.has(key)) {
      skippedCount++;
      continue;
    }

    // Capacity Check
    if (draft.capacity === 0) {
      skippedCount++;
      continue;
    }

    // Location / Venue
    const venue = await getVenue(venueId);
    let location = 'Unknown';
    if (draft.online_event) location = 'Online';
    else if (venue?.loc) location = venue.loc;
    else if (title.toLowerCase().includes('eugene')) location = 'Eugene';
    else if (title.toLowerCase().includes('chicago')) location = 'Chicago';

    if (location === 'Chicago' && timezone !== 'America/Chicago') { skippedCount++; continue; }
    if (location === 'Eugene' && timezone !== 'America/Los_Angeles') { skippedCount++; continue; }

    // Image Check
    const matchedPhoto = matchImage(title, location);
    if (!matchedPhoto) {
      skippedCount++;
      continue;
    }

    // Attempt to get logo ID or upload
    let targetLogoId = imageMap[matchedPhoto.filename] || imageMap[matchedPhoto.path];
    if (!targetLogoId) {
      try {
        targetLogoId = await uploadImage(matchedPhoto);
        if (targetLogoId) {
          imageMap[matchedPhoto.filename] = targetLogoId;
          imageMap[matchedPhoto.path] = targetLogoId;
          fs.writeFileSync(IMAGE_MAP_FILE, JSON.stringify(imageMap, null, 2));
        }
      } catch (err) {
        console.error(`Failed to upload image for ${title}:`, err.message);
        skippedCount++;
        continue;
      }
    }

    if (!targetLogoId) {
      skippedCount++;
      continue;
    }

    try {
      if (draft.logo_id !== targetLogoId) {
        await apiRequest('POST', `events/${draftId}/`, {
          event: { logo_id: targetLogoId }
        });
      }

      if (location === 'Chicago') {
        await setChicagoTaxSettings(draftId);
      }

      const pubRes = await apiRequest('POST', `events/${draftId}/publish/`, {});
      if (!pubRes.published) {
        // Skip it if it failed for reasons other than rate limit (which apiRequest handles internally)
        skippedCount++;
        continue;
      }

      // Mark as published and add to duplicate index to prevent double publishing in same batch
      publishedCount++;
      liveMap.set(key, draft);

    } catch (err) {
      console.log(`Failed publishing ${title}:`, err.message);
      skippedCount++;
    }
  }

  console.log(`\n================ FINAL SUMMARY ================`);
  console.log(`Total drafts processed: ${drafts.length}`);
  console.log(`Successfully published: ${publishedCount}`);
  console.log(`Skipped / Requires Attention: ${skippedCount}`);
  console.log(`===============================================`);
}

main().catch(console.error);
