import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { processConnect } from '../../businessLogic/connections'

export const handler: APIGatewayProxyHandler = async (
event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

    await processConnect(event)
    return {
        statusCode: 200,
        body: ''
    }
}
