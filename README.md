# Newsletters

Newsletter source API bootstrapped with [ts-node-starter-kit](https://github.com/guardian/ts-node-starter-kit)

## Setting up your development environment

* Configuration is fetched from AWS Parameter Store. You will need Frontend credentials from Janus. You can override this configuration by setting the following environment variables:
    * `GOOGLE_SERVICE_ACCOUNT_JSON` - Service account JSON file as a string
    * `SPREADSHEET_ID` - The ID of the spreadsheet to access
* `yarn dev` runs the dev server (default port 4000)
* `yarn test` runs the tests

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
