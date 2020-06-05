import { GaxiosResponse, GaxiosError } from 'gaxios'
import { MethodOptions } from 'googleapis-common'
import Decoder from 'jsonous'
import { err, Result } from 'resulty'
import { youtube_v3 as yt } from 'googleapis'

export default class PlaylistsAPI {
  private youtube: yt.Youtube

  public constructor(youtube: yt.Youtube) {
    this.youtube = youtube
  }

  public async getPlaylist<T>(
    dataDecoder: Decoder<T>,
    params?: yt.Params$Resource$Playlists$List,
    options?: MethodOptions,
  ): Promise<Result<string, T>> {
    try {
      const response: GaxiosResponse<yt.Schema$PlaylistListResponse> = await this.youtube.playlists.list(
        params,
        options,
      )

      if (response.status !== 200) {
        return err(response.statusText)
      }

      return dataDecoder.decodeAny(response.data)
    } catch (error) {
      if (!(error instanceof GaxiosError)) return err('Unknown error')

      if (!error.response) return err(error.message)

      console.log(error.response.data.error)
      return err(error.response.statusText)
    }
  }
}
