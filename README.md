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

### changelog

Added Version in cell A1, current version 0.1

Column added:
 C: displayed name
 G: displayed frequency
 M: group
 N: displayed theme
 O: description
 P: listIdv1
 Q: listId
 R: identity name
 S: brazeSubscribeEventNamePrefix
 T: brazeNewsletterName
 U: brazeSubscribeAttributeName blank if can be derived from brazeSubscribeEventNamePrefix
 V: mailName blank if same as name
 W: mailTitle blank if can be derived from name
 X: mailDescription blank if same as description
 Y: mailSuccessDescription
 Z:: mailHexCode blank if default
 AA: mailImageUrl
 AB: illustration

removed duplicate format column
removed unused ophan column

Added 2 newsletters:

- The Rural Network
- Australia's Modern Outback

## Core technologies included

- TypeScript
- Node
- Express (HTTP server)
- Jest (testing library)
