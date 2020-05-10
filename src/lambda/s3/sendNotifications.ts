import 'source-map-support/register'
import { SNSHandler, SNSEvent } from 'aws-lambda'
import { processUpdateNotification } from '../../businessLogic/notifications'

export const handler: SNSHandler = async (event: SNSEvent) => {
    await processUpdateNotification(event)
}
