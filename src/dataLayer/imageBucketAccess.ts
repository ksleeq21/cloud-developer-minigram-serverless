import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { CreateSignedUploadUrlRequest } from '../requests/CreateSignedUploadUrlRequest'
import { DeletePostImageRequest } from '../requests/DeletePostImageRequest'
import { GetImageObjectRequest } from '../requests/GetImageObjectRequest'

const XAWS = AWSXRay.captureAWS(AWS)

export class ImageBucketAccess {
    constructor(
        private readonly bucketName = process.env.IMAGES_S3_BUCKET,
        private readonly urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10),
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' })
    ) {}

    getSignedUploadUrl(createSignedUploadUrlRequest: CreateSignedUploadUrlRequest): string {
        return this.s3.getSignedUrl('putObject', createSignedUploadUrlRequest)
    }

    getBucketName(): string {
        return this.bucketName
    }

    getUrlExpiration(): number {
        return this.urlExpiration
    }

    async deletePostImage(deletePostImageRequest: DeletePostImageRequest) {
        await this.s3.deleteObject(deletePostImageRequest).promise()
    }

    async getImageObject(getImageObjectRequest: GetImageObjectRequest) {
        return await this.s3.getObject(getImageObjectRequest).promise()
    }
}