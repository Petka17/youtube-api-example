import { google } from 'googleapis'
import { OAuth2Client } from 'googleapis-common'

import { web as keys } from './client_id.json'

const oAuth2Client: OAuth2Client = new google.auth.OAuth2(keys.client_id, keys.client_secret, keys.redirect_uris[0])

export default oAuth2Client
