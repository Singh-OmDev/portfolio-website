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

        if (recentTracks.length === 0) {
            return NextResponse.json({ isPlaying: false });
        }

        const track = recentTracks[0];

        if (!track) {
            return NextResponse.json({ isPlaying: false });
        }
        const isPlaying = track['@attr']?.nowplaying === 'true';

        let previewUrl = null;
        if (isPlaying) {
            try {
                const query = encodeURIComponent(`${track.artist['#text']} ${track.name}`);
                const itunesRes = await fetch(`https://itunes.apple.com/search?term=${query}&media=music&limit=1`, { cache: 'no-store' });
                const itunesData = await itunesRes.json();
                previewUrl = itunesData.results?.[0]?.previewUrl || null;
            } catch (error) {
                console.error('Error fetching iTunes preview:', error);
            }
        }

        return NextResponse.json({
            isPlaying,
            title: track.name,
            artist: track.artist['#text'],
            album: track.album['#text'],
            albumImageUrl: track.image.find((img: any) => img.size === 'medium')?.['#text'] || track.image[0]?.['#text'],
            songUrl: track.url,
            previewUrl: previewUrl
        });

    } catch (error) {
        console.error('Error in Last.fm API:', error);
        return NextResponse.json({ isPlaying: false });
    }
}
