// import PromiseBB from "bluebird";
// import { promises as fs } from "fs";
// import path from "path";
import { google } from 'googleapis'
import * as _ from 'jsonous'
import { Maybe } from 'maybeasy'
import { Result, Err, Ok } from 'resulty'

import PlaylistsAPI from './api/playlist'
import oAuth2Client from './OAuthClient'
import tokens from './tokens.json'

interface Playlist {
  id?: string
}

interface PlaylistsResponse {
  pageInfo?: {
    totalResults: number
    resultsPerPage: number
    nextPageToken: Maybe<string>
  }
  items?: Playlist[]
}

const main = async (): Promise<void> => {
  oAuth2Client.setCredentials(tokens)

  const youtube = google.youtube({ version: 'v3', auth: oAuth2Client })
  const playlistApi = new PlaylistsAPI(youtube)

  const playlists: Result<string, PlaylistsResponse> = await playlistApi.getPlaylist(
    _.succeed({})
      .assign(
        'page',
        _.succeed({})
          .assign('total', _.at(['pageInfo', 'totalResults'], _.number))
          .assign('perPage', _.at(['pageInfo', 'totalResults'], _.number))
          .assign('nextPageToken', _.maybe(_.field('nextPageToken', _.string))),
      )
      .assign('items', _.field('items', _.array(_.succeed({}).assign('id', _.field('id', _.string))))),
    {
      part: 'id,snippet1',
      maxResults: 5,
      mine: true,
    },
  )
  console.log(playlists)
  console.log(playlists.getOrElseValue({}))

  //   playlists.andThen(pl => {});

  //   const [pl, err]: [PlaylistsResponse, string] = playlists.cata({
  //     Ok: val => [val, ""],
  //     Err: msg => [null, msg]
  //   });

  //   if ()
  //   const { items } = res.data;

  //   if (items instanceof Array) {
  //     const list = await PromiseBB.mapSeries(
  //       items,
  //       async (
  //         item
  //       ): Promise<{
  //         name: string | undefined;
  //         items: any;
  //       }> => {
  //         if (item.snippet) {
  //           const { data: playlistItems } = await youtube.playlistItems.list({
  //             part: "id,snippet,contentDetails",
  //             playlistId: item.id
  //           });

  //           if (!playlistItems.items) {
  //             return { name: item.snippet.title, items: [] };
  //           }

  //           const ids: string = playlistItems.items
  //             .map((item): string => {
  //               if (
  //                 item.snippet &&
  //                 item.snippet.resourceId &&
  //                 item.snippet.resourceId.videoId
  //               ) {
  //                 return item.snippet.resourceId.videoId;
  //               }
  //               return "";
  //             })
  //             .filter((id): boolean => id.length > 0)
  //             .join(",");

  //           const { data: videos } = await youtube.videos.list({
  //             part: "id,snippet,contentDetails",
  //             id: ids
  //           });

  //           if (!videos.items) {
  //             return { name: item.snippet.title, items: [] };
  //           }

  //           const videoList = videos.items.map((video): {
  //             title: string | undefined;
  //           } => {
  //             if (!video.snippet) {
  //               return { title: "no-title" };
  //             }
  //             return { title: video.snippet.title };
  //           });

  //           return { name: item.snippet.title, items: videoList };
  //         }
  //         return { name: "no-title", items: [] };
  //       }
  //     );

  //     await fs.writeFile(
  //       path.join(__dirname, "list.json"),
  //       JSON.stringify(list, null, 2)
  //     );

  //     console.log(list);
  //   }
}

main().catch(console.error)
