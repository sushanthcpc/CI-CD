const config = {
    PORT: 9001,
    TOKEN_SECRET: 'K14545.manoj',
    EXPIRES: 120,
    URL: 'http://jsonplaceholder.typicode.com/todos/1',
    ENDPOINT: '',
    PHONE_NUMBER: '0000000',
    RECIPIENT: '919482193769',
    E_TOKEN: 'af5a86e4-5473-4ce4-b468-512dd28c70b6',
    TRY_GROUP: ['919482193769'],

    pgSqlConfig: {
        user: '',
        database: '',
        password: '',
        host: '',                   
        port: 0000,
        max: 10, // max number of clients in the pool
        statement_timeout: 864000000,
        idleTimeoutMillis: 864000000
    },

    USER_MESSAGE: {
        FLAG_STARTED: 'FLAG_QUERY_STARTED',
        FLAG_SUCCESS: 'Flag Success',
        FLAG_FAILURE: 'Flag Failure ',
        CRON_SUCCESS: 'Initiated Cron',
        CRON_FAILURE: 'Cron Failure'
    },

    BROKER_IP: {
        BROKER_1: '',
        BROKER_2: '',
        BROKER_3: ''
    },

    KAFKA_KEYS: {
        CONSUMER_NAME: 'sush consumer',
        TOPIC_NAME: 'sush topic',
        CLIENT_ID: 'sush client'
    },

    ACL_CREDENTIALS: {
        ACL_USERNAME: '',
        ACL_PASSWORD: '',
        PRODUCTION_NUMBER: ''

    },

    SCHEMA_REGISTRY: {
        REGISTRY_1: ''
    }
}

module.exports = config;
