# Cake Ordering System

## Description
Cake Ordering System is a Data Driven Serverless Application using Backend as a Service (BAAS) by AWS. Application built using NodeJS, aws cloud formation, aws lambda, aws kinesis, aws dynamodb.

## How To Install
```bash
  $ npm i
```
## How to Start (Dev)
```bash
  $ npm start
```
## Deploy to AWS
1. Set up the Serverless CLI

```bash
  $ npm i -g serverless
```

2. Setup Crendential
```bash
  $ serverless config credentials --provider aws --key <your key> --secret <your secret>
```

3. Deploy
```bash
  $ serverless deploy
```