import { ImageBucketAccess } from '../dataLayer/imageBucketAccess'
import { ThumbnailBucketAccess } from '../dataLayer/thumbnailBucketAccess'
import Jimp from 'jimp/es'
import { createLogger } from '../utils/logger'
import { SNSEvent } from 'aws-lambda'

const logger = createLogger('auth')

const imageBucketAccess = new ImageBucketAccess()
const thumbnailBucketAccess = new ThumbnailBucketAccess()

export async function processThumbnail(event: SNSEvent) {
    
    for (const snsRecord of event.Records) {
        const s3EventStr = snsRecord.Sns.Message

        logger.info(`Processing S3 event ${s3EventStr}`)
        
        const s3Event = JSON.parse(s3EventStr)

        for (const record of s3Event.Records) {
            const key = record.s3.object.key
            await processImage(key)
        }
    }
}

async function processImage(key: string) {
    
    const imageBucketName = imageBucketAccess.getBucketName()

    const { Body } = await imageBucketAccess.getImageObject({
        Bucket: imageBucketName,
        Key: key
    })

    const image = await Jimp.read(Body)
    
    image.resize(150, Jimp.AUTO)
    
    const convertedBuffer = await image.getBufferAsync(Jimp.AUTO)

    const thumbnailBucketName = thumbnailBucketAccess.getBucketName()

    await thumbnailBucketAccess.putThumbnailImage({
        Bucket: thumbnailBucketName,
        Key: key,
        Body: convertedBuffer
    })
}