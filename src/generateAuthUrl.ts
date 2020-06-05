import oAuth2Client from './OAuthClient'

const scopes = ['https://www.googleapis.com/auth/youtube']

const url = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
})

console.log(url)
