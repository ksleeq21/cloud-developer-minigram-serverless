import { ConnectionsAccess } from '../dataLayer/connectionsAccess'
import { createLogger } from '../utils/logger'
import { APIGatewayProxyEvent } from 'aws-lambda'

const logger = createLogger('auth')

const connectionsAccess = new ConnectionsAccess()

export async function processConnect(event: APIGatewayProxyEvent) {
    logger.info(`Websocket connect event: ${JSON.stringify(event)}`)

    const item = {
        id: event.requestContext.connectionId,
        timestamp: new Date().toISOString()
    }

    logger.info(`Storing item: ${item}`)

    await connectionsAccess.createConnection(item)
}

export async function processDisconnect(event: APIGatewayProxyEvent) {
    logger.info(`Websocket connect event: ${JSON.stringify(event)}`)

    const key = {
        id: event.requestContext.connectionId
    }

    logger.info(`Removing item with key: ${key}`)

    await connectionsAccess.deleteConnection(key)
}