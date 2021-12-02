# Newsletters

Newsletter source bootstrapped with [ts-node-starter-kit](https://github.com/guardian/ts-node-starter-kit)
Cron job which create a newsletter file from the newsletter master sheet

## Setting up your development environment

* Configuration is fetched from AWS Parameter Store. You will need Frontend credentials from Janus.
* `yarn install` to install the dependencies
* `yarn dev` to run the job
* `yarn test` to run the tests

Running the application locally uses the DEVELOPMENT stage.

### Configuration

Stored is AWS Systems Manager > Parameter Store, under path: /frontend/${STAGE}/newsletters-source/

* spreadsheet.id
* google.key

### changelog

Added Version in cell A1, current version 0.1

Column added:

* C: displayed name
* G: displayed frequency
* J: signup page
* M: group
* N: displayed theme
* O: description
* P: listIdV1
* Q: listId
* R: identity name
* S: brazeSubscribeEventNamePrefix
* T: brazeNewsletterName
* U: brazeSubscribeAttributeName blank if can be derived from brazeSubscribeEventNamePrefix
* V: mailName blank if same as name
* W: mailTitle blank if can be derived from name
* X: mailDescription blank if same as description
* Y: mailSuccessDescription
* Z:: mailHexCode blank if default
* AA: mailImageUrl
* AB: illustration

removed duplicate format column
removed unused ophan column

Added 2 newsletters:

* The Rural Network
* Australia's Modern Outback

## Core technologies included

* TypeScript
* Node
* Jest (testing library)
