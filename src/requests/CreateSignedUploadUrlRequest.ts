/**
 * Fields in a request to get a signed upload url.
 */
export interface CreateSignedUploadUrlRequest {
    Bucket: string
    Expires: number
    Key: string
}
