import { NextResponse } from 'next/server';
import { getRecentTracks } from '@/lib/lastfm';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const response = await getRecentTracks();

        if (response.status !== 200) {
            return NextResponse.json({ isPlaying: false });
        }

        const data = await response.json();
        const tracksData = data?.recenttracks?.track;
        const recentTracks = Array.isArray(tracksData) ? tracksData : (tracksData ? [tracksData] : []);

        let track = recentTracks[0];
        let isPlaying = false;
        let previewUrl = null;

        if (!track) {
            // FALLBACK: If Last.fm returns no data (e.g. user hasn't listened in a while or empty history),
            // fetch a default "Recommended" track so the widget isn't empty.
            // Using "Goo Goo Dolls - Iris" as a safe, popular default.
            try {
                const fallbackRes = await fetch(`https://itunes.apple.com/search?term=Goo+Goo+Dolls+Iris&media=music&limit=1`, { cache: 'no-store' });
                const fallbackData = await fallbackRes.json();
                const result = fallbackData.results?.[0];

                if (result) {
                    return NextResponse.json({
                        isPlaying: false, // Show as "Last Played" / Paused
                        title: result.trackName,
                        artist: result.artistName,
                        album: result.collectionName,
                        albumImageUrl: result.artworkUrl100?.replace("100x100", "300x300"), // Higher res if possible
                        songUrl: result.trackViewUrl,
                        previewUrl: result.previewUrl
                    });
                }
            } catch (e) {
                console.error("Fallback fetch failed", e);
            }
            // If fallback also fails, return empty
            return NextResponse.json({ isPlaying: false });
        }

        isPlaying = track['@attr']?.nowplaying === 'true';

        let albumImageUrl = track.image.find((img: any) => img.size === 'medium')?.['#text'] || track.image[0]?.['#text'];

        // The content of the former 'if (isPlaying)' block is now directly here.
        // The user's provided "Code Edit" also wraps this in 'if (track)', which is incorporated.
        if (track) {
            try {
                // Last.fm can return "Artist 1 | Artist 2", which confuses iTunes search.
                // We'll take only the first artist for a cleaner search.
                const cleanArtist = track.artist['#text'].split('|')[0].split(',')[0].split('&')[0].trim();
                const query = encodeURIComponent(`${cleanArtist} ${track.name}`);

                const itunesRes = await fetch(`https://itunes.apple.com/search?term=${query}&media=music&limit=1`, { cache: 'no-store' });
                const itunesData = await itunesRes.json();
                const itunesTrack = itunesData.results?.[0];

                if (itunesTrack) {
                    previewUrl = itunesTrack.previewUrl || null;

                    // If Last.fm image is missing or is the default placeholder, use iTunes image
                    // The placeholder usually contains "2a96cbd8b46e442fc41c2b86b821562f" or is empty
                    if (!albumImageUrl || albumImageUrl.includes('2a96cbd8b46e442fc41c2b86b821562f') || albumImageUrl === '') {
                        albumImageUrl = itunesTrack.artworkUrl100?.replace('100x100', '300x300');
                    }
                }
            } catch (error) {
                console.error('Error fetching iTunes preview:', error);
            }
        }

        return NextResponse.json({
            isPlaying,
            title: track.name,
            artist: track.artist['#text'],
            album: track.album['#text'],
            albumImageUrl: albumImageUrl,
            songUrl: track.url,
            previewUrl: previewUrl
        });

    } catch (error) {
        console.error('Error in Last.fm API:', error);
        return NextResponse.json({ isPlaying: false });
    }
}
