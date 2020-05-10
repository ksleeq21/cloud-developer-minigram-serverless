import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { DeletePostRequest } from '../requests/DeletePostRequest'
import { UpdatePostRequest } from '../requests/UpdatePostRequest'
import { PostItem } from '../models/PostItem'

const XAWS = AWSXRay.captureAWS(AWS)

export class PostsAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly postsTable = process.env.POSTS_TABLE,
    private readonly userIdIndex = process.env.POSTS_USER_ID_INDEX
  ) {}

  async getAllPosts(userId: String): Promise<PostItem[]> {

    const result = await this.docClient.query({
      TableName: this.postsTable,
      IndexName: this.userIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const items = result.Items
    return items as PostItem[]
  }

  async getPost(postId: string, userId: string) {
    const result = await this.docClient.get({
      TableName: this.postsTable,
      Key: {
        postId,
        userId
      }
    }).promise()

    return result.Item
  }

  async createPost(post: PostItem): Promise<PostItem> {
    await this.docClient.put({
      TableName: this.postsTable,
      Item: post
    }).promise()

    return post
  }

  async updatePost(
    userId: string,
    postId: string,
    updatePostRequest: UpdatePostRequest) {
    const { title } = updatePostRequest

    await this.docClient.update({
      TableName: this.postsTable,
      Key: {
        userId,
        postId
      },
      UpdateExpression: 'set #title = :title',
      ExpressionAttributeNames: {
        '#title': 'title'
      },
      ExpressionAttributeValues: {
        ':title': title
      }
    }).promise()
  }

  async deletePost(deletePostRequest: DeletePostRequest) {
    await this.docClient.delete({
      TableName: this.postsTable,
      Key: deletePostRequest
    }).promise()
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
