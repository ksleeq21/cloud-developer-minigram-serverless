import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { processDisconnect } from '../../businessLogic/connections'

export const handler: APIGatewayProxyHandler = async (
event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

    await processDisconnect(event)
    return {
        statusCode: 200,
        body: ''
    }
}
