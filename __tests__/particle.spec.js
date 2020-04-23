'use strict'

import AWS from 'aws-sdk'
import { particlePublishEvent } from '../src/particle'

const AWSMock = require('aws-sdk-mock')
AWSMock.setSDKInstance(AWS);

describe('Particle Publish Event', () => {
    beforeAll(() => {
        AWSMock.mock('SecretsManager', 'getSecretValue', (params, callback) => {
            callback(null, {"SecretString": '{"username": "****", "password": "****"}'})
        })
    })

    afterAll(() => {
        AWSMock.restore()
    })

    test('turn light on', (done) => {
        return particlePublishEvent({
                "body": "{\"action\":\"switchLightsState\",\"params\":\"on,livingroom,1\", \"secretId\": \"none\"}"
            }, {}, (msg) => {
                done(msg)
            }).then((data) => {
                expect(data.statusCode).toEqual(200)
                done()
            })
    })

    test('bad username and password', (done) => {
        AWSMock.remock('SecretsManager', 'getSecretValue', (params, callback) => {
            callback(null, {"SecretString": '{"username": "blah@gmail.com", "password": "none"}'})
        })
        return particlePublishEvent({
                "body": "{\"action\":\"switchLightsState\",\"params\":\"on,livingroom,1\", \"secretId\": \"none\"}"
            }, {}, (msg) => {
                done(msg)
            }).then((data) => {
                expect(data.statusCode).toEqual(400)
                done()
            })
    })

    //TODO: need to add two more cases
    //1)Failure to publish the Particle event
    //2)Exception thrown during the try block
})