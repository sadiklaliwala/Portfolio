import { NextResponse } from "next/server";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
  if (!client_id || !client_secret || !refresh_token) {
    throw new Error("Missing Spotify credentials");
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to get access token");
  }

  return response.json();
};

export async function GET() {
  const fallbackSong = {
    isPlaying: false,
    title: "Dil Diyan Gallan",
    artist: "Atif Aslam",
    album: "Tiger Zinda Hai",
    albumImageUrl: null, // Will use custom visual CSS gradient on frontend
    songUrl: "https://open.spotify.com/track/4G8n75g1lB0R8gR76x7r9X",
  };

  try {
    const { access_token } = await getAccessToken();

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-store",
    });

    if (response.status === 204 || response.status > 400) {
      return NextResponse.json(fallbackSong);
    }

    const song = await response.json();

    if (song.item === null) {
      return NextResponse.json(fallbackSong);
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((_artist: any) => _artist.name).join(", ");
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images[0].url;
    const songUrl = song.item.external_urls.spotify;

    return NextResponse.json({
      isPlaying,
      title,
      artist,
      album,
      albumImageUrl,
      songUrl,
    });
  } catch (error) {
    return NextResponse.json(fallbackSong);
  }
}
