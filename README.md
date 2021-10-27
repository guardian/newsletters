# Newsletters

Newsletter source API bootstrapped with [ts-node-starter-kit](https://github.com/guardian/ts-node-starter-kit)

## env variables

GOOGLE_APPLICATION_CREDENTIALS: Path to google credentials, Service Account with access to sheets api and authorised to read the spreadsheet
SPREADSHEET_ID: Id of the spreadsheet to read

## Commands

- yarn dev // run dev server
- yarn test // run tests

API running on port 3000 (see .env)

## Mastersheet

### TEST spreadsheet URL

    https://docs.google.com/spreadsheets/d/16ANwzbG0luiFEXeBbVHYK8Mc5mqg6Kn44SOKLe6gaeI/edit#gid=0

### changelog

Column added:
 C: displayed name
 G: displayed frequency
 N: group
 O: displayed theme
 P: order in category
 Q: description
 P: listIdv1
 R: listId
 S: identity name
 T: brazeSubscribeEventNamePrefix
 U: brazeNewsletterName
 V: brazeSubscribeAttributeName blank if can be derived from brazeSubscribeEventNamePrefix
 W: mailName blank if same as name
 X: mailTitle blank if can be derived from name
 Y: mailDescription blank if same as description
 Z: mailSuccessDescription
 AA: mailHexCode blank if default
 AB: mailImageUrl
 AC: illustration

removed duplicate format column

Added 2 newsletters:

- The Rural Network
- Australia's Modern Outback

## Core technologies included

- TypeScript
- Node
- Express (HTTP server)
- Jest (testing library)
