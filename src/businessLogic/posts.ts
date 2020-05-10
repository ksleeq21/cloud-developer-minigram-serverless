import * as uuid from 'uuid'
import { PostItem } from '../models/PostItem'
import { PostsAccess } from '../dataLayer/postsAccess'
import { ImageBucketAccess } from '../dataLayer/imageBucketAccess'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { CreatePostRequest } from '../requests/CreatePostRequest'
import { UpdatePostRequest } from '../requests/UpdatePostRequest'
import { getUserId } from '../lambda/utils'

const postsAccess = new PostsAccess()
const imageBucketAccess = new ImageBucketAccess()

export async function getAllPosts(event: APIGatewayProxyEvent): Promise<PostItem[]> {
  const userId = getUserId(event)
  return postsAccess.getAllPosts(userId)
}

export async function createPost(
  event: APIGatewayProxyEvent,
  createPostRequest: CreatePostRequest
): Promise<PostItem> {

  const { title } = createPostRequest
  const userId = getUserId(event)
  const postId = uuid.v4()
  const attachmentUrl = `https://${imageBucketAccess.getBucketName()}.s3.amazonaws.com/${postId}`
  const createdAt = new Date().toISOString()

  return await postsAccess.createPost({
    userId,
    postId,
    title,
    attachmentUrl,
    createdAt
  })
}

export function generateSignedUploadUrl(
  postId: string
): string {

  const bucketName = imageBucketAccess.getBucketName()
  const urlExpiration = imageBucketAccess.getUrlExpiration()

  console.log('Parameters:', { urlExpiration, bucketName, postId })
  return imageBucketAccess.getSignedUploadUrl({
    Bucket: bucketName,
    Expires: urlExpiration,
    Key: postId
  })
}

export async function updatePost(
  event: APIGatewayProxyEvent,
  postId: string,
  updatedPost: UpdatePostRequest) {

  const userId = getUserId(event)

  await postsAccess.updatePost(
    userId,
    postId,
    updatedPost
  )
}

export async function deletePost(event: APIGatewayProxyEvent) {
  const userId = getUserId(event)
  const postId = event.pathParameters.postId

  await postsAccess.deletePost({
    userId,
    postId
  })

  const bucketName = imageBucketAccess.getBucketName()
  
  await imageBucketAccess.deletePostImage({
    Bucket: bucketName,
    Key: postId
  })
}
