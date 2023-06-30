const http = require('http')
const fs = require('fs')
var path = require('path');
const https = require('https');
const axios = require('axios');
const appKeys = require('../config/app.config');
// const dateUtil = require('../utils/message.util');
// const callQuery = require('../utils/query.util');
const callQuery = require('../utils/q2');
const postDataDB = require('../utils/create.util');
const app = require('../app');

const ydayDate = () => {
    const dateField = new Date();
    const year = dateField.getFullYear();
    const month = dateField.getMonth() + 1;
    const datee = dateField.getDate();
    const day = dateField.getDay();
    return `${datee}-${month}-${year}`
}
const run = () => {

    const greet = async (req, res) => {
        const name = req.body.name;

        res.status(200).json(`Hello, ${name}`)
    }



    const tunnel = (req, res) => {
        var tunnel = require('tunnel');

        const dataJs = JSON.stringify({
            "messages": [
                {
                    "sender": "919972977888",
                    "to": "919482193769",
                    "messageId": "xxxxx",
                    "transactionId": "",
                    "channel": "wa",
                    "type": "template",
                    "template": {
                        "body": [
                            {
                                "type": "text",
                                "text": "30-03-2023"
                            },
                            {
                                "type": "text",
                                "text": "23049.55(22945.22)"
                            },
                            {
                                "type": "text",
                                "text": "4922.88(4719.81)"
                            },
                            {
                                "type": "text",
                                "text": "280.21(293.26)"
                            },
                            {
                                "type": "text",
                                "text": "86590.94(86249.24)"
                            },
                            {
                                "type": "text",
                                "text": "59814.28(59903.17)"
                            },
                            {
                                "type": "text",
                                "text": "58613.18(58580.03)"
                            }
                        ],
                        "templateId": "bfsd_actual",
                        "langCode": "en"
                    }
                }
            ],
            "responseType": "json"
        });


        var tunnelingAgent = tunnel.httpsOverHttp({
            proxy: {
                host: '172.20.102.123',
                port: 8080
            },
            rejectUnauthorized: false
        });


        let config = {
            method: 'POST',
            maxBodyLength: Infinity,
            httpsAgent: tunnelingAgent,
            proxy: false,
            timeout: 3000,
            url: appKeys.ENDPOINT,
            headers: {
                'Content-Type': 'application/json',
                'user': appKeys.ACL_CREDENTIALS.ACL_USERNAME,
                'pass': appKeys.ACL_CREDENTIALS.ACL_PASSWORD
            },
            data: dataJs
        };
        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                res.status(200).json(response.data)
            })
            .catch((error) => {
                console.log(error);
            });

    }
    const bulkPost = async (req, res) => {
        const dateStamp = ydayDate();
        const cdcQueryResponse = await callQuery()
        const recipients = appKeys.TRY_GROUP
        const copyItems = [];
        recipients.forEach((item) => {
            console.log(item)
            posting(cdcQueryResponse, item)
            copyItems.push(item);

        });

        res.status(200).json(`Posted to ${copyItems.length} Executives of KBL ${copyItems}`)
    }

    const sendBFSD = async () => {
        console.log('Started', new Date().toLocaleString());
        const cdcQueryResponse = await callQuery()
        // const dataCreate = await postDataDB(cdcQueryResponse)
        console.log("Quer Resp ==>", cdcQueryResponse)
        const { GTOT } = cdcQueryResponse
        console.log("TOTAL", GTOT)
        const recipients = appKeys.TOP_GROUP
        const copyItems = [];
        const tallyValue = Math.abs(GTOT)
        if (tallyValue == 0) {
            recipients.forEach((item) => {
                console.log(item)
                posting(cdcQueryResponse, item)
                copyItems.push(item);

            });
            console.log('Completed', new Date().toLocaleString());
        } else {
            console.log(`Balance Tally Failed ==> ${GTOT}`, new Date().toLocaleString());
        }

    }

    return {
        greet: greet,
        tunnel: tunnel,
        bulkpost: bulkPost,
        sendBFSD: sendBFSD
    }
}

const posting = (dataCdc, to) => {
    var tunnel = require('tunnel');
    console.log(dataCdc)
    const { DATE, SB, CA, ODD, Dep, Adv } = dataCdc
    const dataJs = JSON.stringify(
    //     {
    //     "messages": [
    //         {
    //             "sender": appKeys.PHONE_NUMBER,
    //             "to": to,
    //             "messageId": "xxxxx",
    //             "transactionId": "",
    //             "channel": "wa",
    //             "type": "template",
    //             "template": {
    //                 "body": [
    //                     {
    //                         "type": "text",
    //                         "text": DATE
    //                     },
    //                     {
    //                         "type": "text",
    //                         "text": SB
    //                     },
    //                     {
    //                         "type": "text",
    //                         "text": CA
    //                     },
    //                     {
    //                         "type": "text",
    //                         "text": ODD
    //                     },
    //                     {
    //                         "type": "text",
    //                         "text": Dep
    //                     },
    //                     {
    //                         "type": "text",
    //                         "text": Adv
    //                     }
    //                     // {
    //                     //     "type": "text",
    //                     //     "text": "00.00(00.00)"
    //                     // }
    //                 ],
    //                 "buttons": [
    //                     {
    //                     "index": "0",
    //                     "subType": "quickReply",
    //                     "parameters": {
    //                     "type": "payload",
    //                     "payload": "This is Region button testing"
    //                     }
    //                     }],
    //                 "templateId": "bfsdnewmenu",
    //                 // "templateId": "bfsd_actual",
    //                 // "templateId": "bfsd_new_23", //Actual Template
    //                 "langCode": "en"
    //             }
    //         }
    //     ],
    //     "responseType": "json"
    // }
    

    {
        "messages": [
            {
                "sender": appKeys.ACL_CREDENTIALS.PRODUCTION_NUMBER,
                "to": to,
                "messageId": "xxxxx",
                "transactionId": "",
                "channel": "wa",
                "type": "template",
                "template": {
                    "body": [
                        {
                            "type": "text",
                            "text": DATE
                        },
                        {
                            "type": "text",
                            "text": SB
                        },
                        {
                            "type": "text",
                            "text": CA
                        },
                        {
                            "type": "text",
                            "text": ODD
                        },
                        {
                            "type": "text",
                            "text": Dep
                        },
                        {
                            "type": "text",
                            "text": Adv
                        }
                    ],
                    // "buttons": [
                    //     {
                    //         "index": "0",
                    //         "subType": "quickReply",
                    //         "parameters": {
                    //             "type": "payload",
                    //             "payload": "This is Region button testing"
                    //         }
                    //     }
                    // ],
                    "templateId": "bfsd_new_23",
                    "langCode": "en"
                }
            }
        ],
        "responseType": "json"
    }
    );


    var tunnelingAgent = tunnel.httpsOverHttp({
        proxy: {
            host: '172.20.102.123',
            port: 8080
        },
        rejectUnauthorized: false
    });


    let config = {
        method: 'POST',
        maxBodyLength: Infinity,
        httpsAgent: tunnelingAgent,
        proxy: false,
        // timeout: 3000,
        url: 'https://push.aclwhatsapp.com/pull-platform-receiver/wa/messages',
        headers: {
            'Content-Type': 'application/json',
            'user': appKeys.ACL_CREDENTIALS.ACL_USERNAME,
            'pass': appKeys.ACL_CREDENTIALS.ACL_PASSWORD
        },
        data: dataJs
    };
    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            // res.status(200).json(response.data)
            return JSON.stringify(response.data)
        })
        .catch((error) => {
            console.log(error);
            return error
        });

}


module.exports = run()
