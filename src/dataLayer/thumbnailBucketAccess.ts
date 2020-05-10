import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { CreateThumbNailImageRequest } from '../requests/CreateThumbNailImageRequest'

const XAWS = AWSXRay.captureAWS(AWS)

export class ThumbnailBucketAccess {
    constructor(
        private readonly thumbnailBucketName = process.env.THUMBNAILS_S3_BUCKET,
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' })
    ) {}
    
    getBucketName(): string {
        return this.thumbnailBucketName
    }

    async putThumbnailImage(createThumbnailImageRequest: CreateThumbNailImageRequest) {
        await this.s3.putObject(createThumbnailImageRequest).promise()
    }
}