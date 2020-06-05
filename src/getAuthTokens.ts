import { promises as fs } from 'fs'
import path from 'path'

import oAuth2Client from './OAuthClient'

const [, , code] = process.argv

const main = async (): Promise<void> => {
  const { tokens } = await oAuth2Client.getToken(code)

  console.log(tokens)

  await fs.writeFile(path.join(__dirname, 'tokens.json'), JSON.stringify(tokens, null, 2))
}

main().catch(console.error)
