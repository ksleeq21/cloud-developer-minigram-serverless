import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdatePostRequest } from '../../requests/UpdatePostRequest'
import { updatePost } from '../../businessLogic/posts'

export const handler: APIGatewayProxyHandler = async (
event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    
    const postId: string = event.pathParameters.postId
    const updatedPost: UpdatePostRequest = JSON.parse(event.body)

    await updatePost(event, postId, updatedPost)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            item: updatedPost
        })
    }
}
