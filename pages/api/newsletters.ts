// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Newsletter } from '../../types/newsletters'


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Newsletter>>
) {
  res.status(200).json(getSheetsNewsletters())
}

const getSheetsNewsletters = () : Array<Newsletter> => {
  return [
    {
      pillar: "FEATURES",
      email: "The Upside",
      previews: "https://www.theguardian.com/",
      topic: "Series of same name",
      frequency: "Weekly, Friday/ad usually, ~12-2pm",
      format: "Article",
      contact: "A contact",
      opha_alert: undefined,
      sign_up_page: "https://www.theguardian.com/world/2018/feb/12/the-upside-sign-up-for-our-weekly-email",
      notes: undefined,
      treat: "world/series/the-upside",
    },
  ]
}