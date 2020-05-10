import 'source-map-support/register'
import { SNSEvent, SNSHandler } from 'aws-lambda'
import { processThumbnail } from '../../businessLogic/thumbnails'

export const handler: SNSHandler = async (event: SNSEvent) => {
    await processThumbnail(event)
}
