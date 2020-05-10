import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { ConnectionItem } from '../models/ConnectionItem'

const XAWS = AWSXRay.captureAWS(AWS)

export class ConnectionsAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly connectionsTable = process.env.CONNECTIONS_TABLE
    ) {}
    
    async getAllConnections(): Promise<ConnectionItem []> {

        const connections = await this.docClient.scan({
            TableName: this.connectionsTable
        }).promise()

        return connections.Items.map(item => ({
            id: item.id,
            timestamp: item.timestamp
        }))
    }

    async createConnection(item: ConnectionItem) {
        await this.docClient.put({
            TableName: this.connectionsTable,
            Item: item
        }).promise()
    }

    async deleteConnection(key: any) {
        await this.docClient.delete({
            TableName: this.connectionsTable,
            Key: key
        }).promise()
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}
