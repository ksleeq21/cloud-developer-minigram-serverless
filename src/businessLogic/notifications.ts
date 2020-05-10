import { ConnectionsAccess } from '../dataLayer/connectionsAccess'
import { createLogger } from '../utils/logger'
import { SNSEvent, S3Event } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { ConnectionItem } from '../models/ConnectionItem'

const logger = createLogger('auth')

const stage = process.env.STAGE
const apiId = process.env.API_ID
const region = process.env.REGION

const connectionParams = {
    apiVersion: "2018-11-29",
    endpoint: `${apiId}.execute-api.${region}.amazonaws.com/${stage}`
}
const apiGateway = new AWS.ApiGatewayManagementApi(connectionParams)
const connectionsAccess = new ConnectionsAccess()

export async function processUpdateNotification(event: SNSEvent) {
    
    logger.info('Processing SNS event ', JSON.stringify(event))

    for (const snsRecord of event.Records) {
        const s3EventStr = snsRecord.Sns.Message

        logger.info('Processing S3 event', s3EventStr)
        
        const s3Event = JSON.parse(s3EventStr)

        await processS3EventUpdateNotification(s3Event)
    }
}

async function processS3EventUpdateNotification(event: S3Event) {
    for (const record of event.Records) {

        const key = record.s3.object.key
        logger.info('Processing S3 item with key: ', key)

        const connectionItems: ConnectionItem [] = await connectionsAccess.getAllConnections()
        const payload = {
            postId: key
        }

        for (const connection of connectionItems) {
            const connectionId = connection.id
            await sendMessageToClient(connectionId, payload)
        }
    }
}

async function sendMessageToClient(connectionId: string, payload: { postId: string }) {
    try {
        logger.info('Sending message to a connection', connectionId)
        
        await apiGateway.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify(payload),
        }).promise()

    } catch (e) {
        logger.info('Failed to send message', JSON.stringify(e))
        if (e.statusCode === 410) {
            logger.info('Stale connection')
            await connectionsAccess.deleteConnection(connectionId)
        }
    }
}