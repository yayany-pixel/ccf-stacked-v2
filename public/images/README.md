# Acuity Workshop Images

This directory contains images for Acuity workshop series cards.

## Directory Structure

- `workshops/` - Specific workshop images (matched by title)
- `categories/` - Category fallback images

## Required Images

### Category Fallbacks (9 required)

Place these in `categories/`:

1. `pottery.jpg` - For all pottery-related workshops
2. `mosaic.jpg` - For mosaic workshops
3. `glass-fusion.jpg` - For glass fusion workshops
4. `candle.jpg` - For candle making
5. `terrarium-bonsai.jpg` - For plant-related workshops
6. `painting.jpg` - For painting classes
7. `kids-family.jpg` - For kids/family events
8. `private.jpg` - For private events
9. `other.jpg` - Default fallback for unknown categories

### Workshop-Specific Images (optional but recommended)

Place these in `workshops/`:

- `date-night-wheel.jpg` - Date night pottery
- `beginner-wheel-throwing.jpg` - Beginner wheel classes
- `intermediate-wheel-throwing.jpg` - Intermediate wheel
- `hand-building-pottery.jpg` - Hand building
- `simple-mosaic.jpg` - Basic mosaic
- `intermediate-mosaic.jpg` - Intermediate mosaic
- `turkish-lamp.jpg` - Turkish lamp mosaics
- `glass-fusion-basic.jpg` - Glass fusion intro
- `glass-fusion-advanced.jpg` - Advanced glass
- `candle-making.jpg` - Candle workshops
- `terrarium.jpg` - Terrarium building
- `bonsai.jpg` - Bonsai workshops
- `paint-night.jpg` - Painting events
- `kids-pottery.jpg` - Kids pottery
- `kids-painting.jpg` - Kids painting
- `private-pottery.jpg` - Private pottery
- `private-event.jpg` - General private events

## Image Requirements

- **Aspect Ratio**: 16:9 (recommended)
- **Minimum Width**: 800px
- **Format**: JPG or PNG
- **Quality**: High quality, well-lit photos showing the workshop activity

## How Images Are Selected

The system uses a 3-tier matching priority:

1. **Exact Match**: Looks for workshop-specific image by normalized title
2. **Partial Match**: Searches for substring matches (e.g., "wheel" matches "date-night-wheel.jpg")
3. **Category Fallback**: Uses category image if no specific match found

## Adding New Images

1. Take/source a high-quality photo (16:9 aspect ratio)
2. Save with descriptive filename (lowercase, hyphens for spaces)
3. Place in `workshops/` directory
4. Update `lib/acuityImages.ts` to add mapping:

```typescript
export const appointmentImages: Record<string, string> = {
  // ... existing mappings ...
  "new workshop name": "/images/workshops/new-workshop.jpg",
};
```

## Example Setup

```
public/images/
├── categories/
│   ├── pottery.jpg
│   ├── mosaic.jpg
│   ├── glass-fusion.jpg
│   ├── candle.jpg
│   ├── terrarium-bonsai.jpg
│   ├── painting.jpg
│   ├── kids-family.jpg
│   ├── private.jpg
│   └── other.jpg
└── workshops/
    ├── date-night-wheel.jpg
    ├── beginner-wheel-throwing.jpg
    ├── turkish-lamp.jpg
    └── ... (more specific workshops)
```

## Temporary Placeholders

Until real photos are added, you can:
1. Use stock photos from free sources (Unsplash, Pexels)
2. Re-use existing Eventbrite event images from your site
3. Use solid color placeholders with text overlays

All images are lazy-loaded with Next.js Image optimization for performance.
