# Potato Maniac

## Carousel sections

The shared carousel component is `src/components/ui/skiper49.tsx`. Section-specific slides are configured in `src/pages/index.astro`:

- TVCs are followed by TV Shows and International Films.
- Each carousel loops continuously, with arrow, keyboard, and swipe navigation.
- Add artwork under `src/images/`, import it in `src/pages/index.astro`, and set the matching item’s `logoSrc` to the imported image’s `.src`.
- Set each item’s `youtubeUrl` to enable click-to-play. The configured video plays inline; changing slides stops it.
- BLUEBAND and the TV Shows have YouTube URLs. The International Films slides have artwork but remain non-playable until their URLs are supplied. Scheduling Programs is deferred until content is provided.
