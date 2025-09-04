const translation = {
  custom: '定制',
  upgradeTip: {
    title: '升级您的计划',
    des: '升级您的计划来定制您的品牌。',
    prefix: '升级您的计划以',
    suffix: '定制您的品牌。',
  },
  webapp: {
    title: '定制 WebApp 品牌',
    removeBrand: '移除 Powered by CloudWalk Cubix',
    changeLogo: '更改 Powered by Brand 图片',
    changeLogoTip: 'SVG 或 PNG 格式，最小尺寸为 40x40px',
  },
  app: {
    title: '定制应用品牌',
    changeLogoTip: 'SVG 或 PNG 格式，最小尺寸为 80x80px',
  },
  upload: '上传',
  uploading: '上传中',
  uploadedFail: '图片上传失败，请重新上传。',
  change: '更改',
  apply: '应用',
  restore: '恢复默认',
  customize: {
    contactUs: '联系我们',
    prefix: '如需自定义品牌图标，请',
    suffix: '升级至企业版。',
  },
  database: {
    createDatabase: '创建数据库',
    editDatabase: '编辑数据库',
    name: '连接名称',
    type: '数据库类型',
    host: '主机地址',
    port: '端口',
    username: '用户名',
    password: '密码',
    description: '描述',
    testConnection: '测试连接',
    connectionTestSuccess: '连接测试成功！',
    connectionTestFailed: '连接测试失败',
    pleaseFillRequiredFields: '请填写所有必填字段',
    database_name: '数据库',

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
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    create: '创建',

    // Validation messages
    nameRequired: '数据库名称是必填项',
    typeRequired: '数据库类型是必填项',
    nameMinLength: '数据库名称至少需要2个字符',
    databaseRequired: '数据库名称是必填项',
    hostRequired: '主机地址是必填项',
    hostInvalid: '请输入有效的主机地址（IP地址、域名或localhost）',
    hostFormat: '支持的格式：IP地址、域名或localhost',
    portRequired: '端口是必填项',
    portInvalid: '端口必须是1到65535之间的数字',
    defaultPort: '默认端口：{{port}}',
    portWarning: '警告：这不是常见的数据库端口',
    usernameRequired: '用户名是必填项',
    passwordRequired: '密码是必填项',

    // Success/Error messages
    createSuccess: '数据库创建成功',
    updateSuccess: '数据库更新成功',
    deleteSuccess: '数据库删除成功',
    createFailed: '创建数据库失败',
    updateFailed: '更新数据库失败',
    deleteFailed: '删除数据库失败',

    // Connection test messages
    testingConnection: '正在测试连接...',
    connectionSuccessful: '连接成功',
    connectionFailed: '连接失败',
    invalidCredentials: '无效的凭据',
    networkError: '网络错误',
    serverUnreachable: '服务器无法访问',

    // Form placeholders
    enterDatabaseName: '请输入数据库名称',
    enterHost: '请输入主机地址',
    enterPort: '请输入端口号',
    enterUsername: '请输入用户名',
    enterPassword: '请输入密码',
    enterDescription: '请输入描述（可选）',

    // Tips and help
    connectionTip: '保存前请测试连接以确保数据库可访问',
    passwordTip: '密码将被加密并安全存储',
    portTip: '默认端口：MySQL (3306)、PostgreSQL (5432)、MongoDB (27017)、Redis (6379)',
  }
}

export default translation
