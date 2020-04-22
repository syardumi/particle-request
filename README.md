# Prerequisites

- AWS cloud account
- Node v12 and NPM installed on local machine

# Install

```
npm i -g git
git clone https://github.com/syardumi/particle-request.git
cd particle-request
npm i -g yarn serverless
yarn install --pure-lockfile
```

# Test

```
npm run test
```

# Code Coverage

```
npm run codecov
```

# Particle

- Create a login to Particle https://login.particle.io/signup
- Save the login information to AWS Secrets Manager
  - `{ "username": "something@email.com", "password": "else" }`

# Deploy to AWS

## Install AWS CLI version 2
https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html

## Create an AWS IAM deployment user with Programmatic Access and permissions:
- AWSLambdaFullAccess
- IAMFullAccess
- AmazonS3FullAccess
- AmazonAPIGatewayAdministrator
- AWSCloudFormationFullAccess

## Run Locally
```
aws configure       //enter access and secret keys for user here
sls deploy --aws-profile {profile name} --stage {dev or prod}
```

## Modify the AWS IAM role created automatically by the `sls deploy` by adding permission:
- SecretsManagerReadWrite

# Usage
```
$.ajax({
    method: 'POST',
    url: 'https://*****.execute-api.us-east-1.amazonaws.com/prod/particle/publishEvent',
    data: JSON.stringify({
        action: 'doSomething',
        params: {param1: 'yes', param2: 'no'},
        secretId: 'prod/app/particle'
    }),
    processData: false
}).done(function( msg ) {
    console.log( "Event published: " + JSON.stringify(msg) );
})
```