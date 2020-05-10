import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deletePost } from '../../businessLogic/posts'

export const handler: APIGatewayProxyHandler = async (
event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

    await deletePost(event)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({})
    }
}
