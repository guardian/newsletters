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

### Deployment

The service is an AWS scheduled lambda, run every 5 minutes.
The newsletters file is generated on s3 and cached by fastly on CODE and PROD.
The urls are:

* [CODE](https://newsletters.code.dev-guardianapis.com/newsletters)
* [PROD](https://newsletters.guardianapis.com/newsletters)
* [DEVELOPMENT](https://aws-frontend-newsletters-source.s3.eu-west-1.amazonaws.com/DEVELOPMENT/newsletters)

### sheet changelog

Version in cell A1

#### 0.3

Column added:

* AD: campaignName
* AE: campaignCode

#### 0.2

Column added:

* C: displayed name
* D: restricted
* H: displayed frequency
* K: signup page
* N: group
* O: displayed theme
* P: description
* Q: listIdV1
* R: listId
* S: identity name
* T: brazeSubscribeEventNamePrefix
* U: brazeNewsletterName
* V: brazeSubscribeAttributeName blank if can be derived from brazeSubscribeEventNamePrefix
* W: mailName blank if same as name
* X: mailTitle blank if can be derived from name
* Y: mailDescription blank if same as description
* Z: mailSuccessDescription
* AA:: mailHexCode blank if default
* AB: mailImageUrl
* AC: illustration

removed duplicate format column
removed unused ophan column

Added 2 newsletters:

* The Rural Network
* Australia's Modern Outback

## Core technologies included

* TypeScript
* Node
* Jest (testing library)
