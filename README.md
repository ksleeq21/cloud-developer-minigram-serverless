# cloud-developer-minigram-serverless
 
In this repository I implement a minimum version of Instagram(Minigram) using AWS Lambda, API Gateway, S3 and so on. This provides CRUD operations needed for Minigram.

--- 

## Set up Auth0 application
To integrate with Auth0 authentication visit [Auth0](https://auth0.com/) and create an application. Set up properties:

- Allowed Callback URLs: http://localhost:3000/callback
- JsonWebToken Signature Algorithm: RS256

Copy some properties to generate JWT Token for later use.

## Deploy project

To deploy project to AWS environment install serverless on local environment and run serverless deploy command.

Install Serverless Framework

```
npm install -g serverless
```

Install NPM dependencies
```
cd cloud-developer-minigram-serverless
npm i
```

Deploy project to dev environment
```
sls deploy -v --stage dev
```

Serverless framework provisions several AWS resource tyes. 

API Gateway

<img src="./screenshots/aws-apigateway.png" alt="AWS API Gateway" width="500"/>

Lambda functions

<img src="./screenshots/aws-lambda-functions.png" alt="AWS Lambda Functions" width="500"/>

S3 Buckets

<img src="./screenshots/aws-s3-buckets.png" alt="AWS S3 Buckets" width="500"/>

DynamoDB Tables 

<img src="./screenshots/aws-ddb-tables.png" alt="AWS S3 Buckets" width="500"/>

---

## Test API endpoints
To test out API endpoints, use Postman application with a collection file in the repository.

### Prerequisite
- Generate AuthToken using `Client Secret` from Auth0.
- Run Postman
- Import cloud-developer-minigram-serverless/postman_collection.json
- Update variables: `apiId` and `authToken`.

### Get all posts
Call GET Get all posts command.

<img src="./screenshots/postman-get-all-posts.png" alt="GET" width="500"/>


### Create a new post
Call POST Create a post command.

<img src="./screenshots/postman-create-post.png" alt="POST" width="500"/>

### Generate attachment URL
Call POST Get attachment URL command with a postId that was created by `POST Create a post command`.

<img src="./screenshots/postman-get-attachment-url.png" alt="POST" width="500"/>

### Upload Image
Call PUT command using the `uploadURL` that was created by `POST Get attachment URL command`. Need to select an image file from your local machine. 

### Update a post
Call PATCH command using the `postId` with updated title.

<img src="./screenshots/postman-update-post.png" alt="POST" width="500"/>

### Delete a post
Call DELETE command using the `postId`.

<img src="./screenshots/postman-delete-post.png" alt="POST" width="500"/>

---

## Test WebSocket connnection and New Post Update Notification

To test WebSocket connection and Update Notification, need to install wscat. 

Install wscat
```
npm install -g wscat
```

Run wscat with WebSocket endpoint
```
wscat -c wss://avz7bun2cg.execute-api.us-west-2.amazonaws.com/dev
```

Receive a Update Notification message
```
example)
$ wscat -c wss://avz7bun2cg.execute-api.us-west-2.amazonaws.com/dev
Connected (press CTRL+C to quit)
< {"postId":"8a953f47-0c83-4041-a6c1-8dce1dc3ee40"}
```

---

## Image Resizing and Post Update Notification

When a new image is uploaded to IMAGE_S3_BUCKET, an event is sent to SNS Topic where two Lambda functions are subscribed to consume to resize image and send Update Notification to connected clients. Client has a persistent WebSocket connection to API Gateway and it receives a message which has a postId just created when a new image is uploaded.

--- 

## Distributed Tracing

Access to AWS X-Ray console and view a Service map to trace API calls. 

<img src="./screenshots/aws-x-ray.png" alt="POST" width="500"/>

---

## System Monitoring

Access to AWS CloudWatch console and view Log groups for log messages. 

---

## Canary Deployment

Canary deployment is applied to `createPost`. New version of code will be taking traffic from API Gateway based on `deploymentSettings` property in serverless.yml. It sets to `Linear10PercentEvery1Minute` currently and this means a new version of Lambda function will take 10 percent more traffic every minute.

<img src="./screenshots/aws-code-deploy.png" alt="AWS Code Deploy" width="500"/>

---

## Screenshots
- aws-apigateway.png: API Gateway provisioned by Serverless
- aws-code-deploy.png: Code Deploy for Canary deployment
- aws-ddb-tables.png: DynamoDB tables for Posts and WebSocket Connections
- aws-lambda-functions.png: Lambda functions serving API endpoints
- aws-s3-buckets.png: S3 Bucket for Post attachment and resized images
- aws-x-ray.png: X-Ray Services map for tracing
- postman-create-post.png: Create a post
- postman-delete-post.png: Delete a post
- postman-get-all-posts.png: Get all posts of a user
- postman-get-attachment-url.png: Get signed upload URL for Post attachment
- postman-update-post.png: Update a post