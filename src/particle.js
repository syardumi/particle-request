/* eslint-disable no-unused-vars */
'use strict'

const Particle = require('particle-api-js')
const particle = new Particle() 

const AWS = require('aws-sdk')

module.exports.particlePublishEvent = async (event, context, callback) => {

	const sm = new AWS.SecretsManager()
    
    try{
		let bodyJson = JSON.parse(event.body)
		
		let authData = await sm.getSecretValue({ SecretId: bodyJson.secretId }).promise()
		let secretStr = JSON.parse(authData.SecretString)

		return await particle.login({username: secretStr.username, password: secretStr.password})
			.then(async (data) => {
				let token = data.body.access_token
				
				return await particle.publishEvent({ name: bodyJson.action, data: bodyJson.params, auth: token })
					.then((data) => {
						return {
							"statusCode": 200,
							headers: {
								'Access-Control-Allow-Origin': '*', // Required for CORS support to work
								'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
							},
							"body": "Particle event published succesfully!"
						}
					},
					(err) => {
						return {
							statusCode: 400,
							body: JSON.stringify(err),
						}
					})
			},
			(err) => {
				return {
					statusCode: 400,
					body: JSON.stringify(err),
				}
			})
        
    }catch(error) {
        return {
			statusCode: 400,
			body: JSON.stringify(error),
		}
    }
}
