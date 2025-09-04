const translation = {
  custom: 'Customization',
  upgradeTip: {
    title: 'Upgrade your plan',
    des: 'Upgrade your plan to customize your brand',
    prefix: 'Upgrade your plan to',
    suffix: 'customize your brand.',
  },
  webapp: {
    title: 'Customize WebApp brand',
    removeBrand: 'Remove Powered by Dify',
    changeLogo: 'Change Powered by Brand Image',
    changeLogoTip: 'SVG or PNG format with a minimum size of 40x40px',
  },
  app: {
    title: 'Customize app header brand',
    changeLogoTip: 'SVG or PNG format with a minimum size of 80x80px',
  },
  upload: 'Upload',
  uploading: 'Uploading',
  uploadedFail: 'Image upload failed, please re-upload.',
  change: 'Change',
  apply: 'Apply',
  restore: 'Restore Defaults',
  customize: {
    contactUs: ' contact us ',
    prefix: 'To customize the brand logo within the app, please',
    suffix: 'to upgrade to the Enterprise edition.',
  },
  database: {
    reateDatabase: 'Create Database',
    editDatabase: 'Edit Database',
    name: 'Database Name',
    type: 'Database Type',
    host: 'Host',
    port: 'Port',
    username: 'Username',
    password: 'Password',
    description: 'Description',
    testConnection: 'Test Connection',
    connectionTestSuccess: 'Connection test successful!',
    connectionTestFailed: 'Connection test failed',
    pleaseFillRequiredFields: 'Please fill in all required fields',
    database_name: 'Database',

    // Database types
    mysql: 'MySQL',
    postgresql: 'PostgreSQL',
    sqlite: 'SQLite',
    mongodb: 'MongoDB',
    redis: 'Redis',
    oracle: 'Oracle',
    mssql: 'MSSQL',
    elasticsearch: 'Elasticsearch',
    clickhouse: 'Clickhouse',

    // Common operations
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',

    // Validation messages
    nameRequired: 'Database name is required',
    typeRequired: 'Database type is required',
    nameMinLength: 'Database name must be at least 2 characters',
    databaseRequired: 'Database name is required',
    hostRequired: 'Host is required',
    hostInvalid: 'Please enter a valid host address (IP, domain, or localhost)',
    hostFormat: 'Supported formats: IP address, domain name, or localhost',
    portRequired: 'Port is required',
    portInvalid: 'Port must be a number between 1 and 65535',
    defaultPort: 'Default port: {{port}}',
    portWarning: 'Warning: This is not a common database port',
    usernameRequired: 'Username is required',
    passwordRequired: 'Password is required',

    // Success/Error messages
    createSuccess: 'Database created successfully',
    updateSuccess: 'Database updated successfully',
    deleteSuccess: 'Database deleted successfully',
    createFailed: 'Failed to create database',
    updateFailed: 'Failed to update database',
    deleteFailed: 'Failed to delete database',

    // Connection test messages
    testingConnection: 'Testing connection...',
    connectionSuccessful: 'Connection successful',
    connectionFailed: 'Connection failed',
    invalidCredentials: 'Invalid credentials',
    networkError: 'Network error',
    serverUnreachable: 'Server is unreachable',

    // Form placeholders
    enterDatabaseName: 'Enter database name',
    enterHost: 'Enter host address',
    enterPort: 'Enter port number',
    enterUsername: 'Enter username',
    enterPassword: 'Enter password',
    enterDescription: 'Enter description (optional)',

    // Tips and help
    connectionTip: 'Test the connection before saving to ensure the database is accessible',
    passwordTip: 'Password will be encrypted and stored securely',
    portTip: 'Default ports: MySQL (3306), PostgreSQL (5432), MongoDB (27017), Redis (6379)',
  }
}

export default translation
