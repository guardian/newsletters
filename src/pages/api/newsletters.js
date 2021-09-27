// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @param {NextApiRequest} _
 * @param {NextApiResponse} res
 */
export default function handler(_, res) {
  res.status(200).json(getSheetsNewsletters());
}

const getSheetsNewsletters = () => {
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
      sign_up_page:
        "https://www.theguardian.com/world/2018/feb/12/the-upside-sign-up-for-our-weekly-email",
      notes: undefined,
      treat: "world/series/the-upside",
    },
  ];
};
