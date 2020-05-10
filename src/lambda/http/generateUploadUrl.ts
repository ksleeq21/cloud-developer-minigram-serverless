import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateSignedUploadUrl } from '../../businessLogic/posts'

export const handler: APIGatewayProxyHandler = async (
event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

    const postId = event.pathParameters.postId
    const signedUploadUrl = generateSignedUploadUrl(postId)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            uploadUrl: signedUploadUrl
        })
    }
}
