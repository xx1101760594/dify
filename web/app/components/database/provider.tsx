export const provider: any = {
  tenant_id: "5455071e-6420-4107-9cf7-3e35e9595439",
  provider: "langgenius/openai_api_compatible/openai_api_compatible",
  label: {
    zh_Hans: "数据源",
    en_US: "Database",
  },
  description: {
    zh_Hans: "支持多种数据库类型的数据源接入。",
    en_US: "Support for multiple database types.",
  },
  icon_small: {
    zh_Hans: "/path/to/icon/database.png",
    en_US: "/path/to/icon/database.png",
  },
  icon_large: null,
  background: null,
  supported_model_types: ["database"],
  configurate_methods: ["predefined-model"],
  provider_credential_schema: {
    credential_form_schemas: [
      {
        variable: "db_type",
        label: {
          zh_Hans: "数据源类型",
          en_US: "Database Type",
        },
        type: "select",
        required: true,
        default: "mysql",
        options: [
          {
            label: { zh_Hans: "Mysql", en_US: "Mysql" },
            value: "mysql",
            show_on: [],
          },
          {
            label: { zh_Hans: "Postgresql", en_US: "Postgresql" },
            value: "postgresql",
            show_on: [],
          },
          {
            label: { zh_Hans: "Oracle", en_US: "Oracle" },
            value: "oracle",
            show_on: [],
          },
          {
            label: { zh_Hans: "Sqlite", en_US: "Sqlite" },
            value: "sqlite",
            show_on: [],
          },
          {
            label: { zh_Hans: "ElasticSearch", en_US: "ElasticSearch" },
            value: "elasticsearch",
            show_on: [],
          },
        ],
        show_on: [],
      },
      {
        variable: "database_name",
        label: {
          zh_Hans: "数据源名称",
          en_US: "Data Source Name",
        },
        type: "text-input",
        required: true,
        placeholder: {
          zh_Hans: "请输入",
          en_US: "Please input",
        },
        show_on: [],
      },
      {
        variable: "host",
        label: {
          zh_Hans: "数据库IP地址",
          en_US: "Database IP Address",
        },
        type: "text-input",
        required: true,
        placeholder: {
          zh_Hans: "请输入",
          en_US: "Please input",
        },
        show_on: [],
      },
      {
        variable: "port",
        label: {
          zh_Hans: "端口",
          en_US: "Port",
        },
        type: "text-input",
        required: true,
        default: "3306",
        placeholder: {
          zh_Hans: "请输入",
          en_US: "Please input",
        },
        show_on: [],
      },
      {
        variable: "username",
        label: {
          zh_Hans: "用户名",
          en_US: "Username",
        },
        type: "text-input",
        required: true,
        placeholder: {
          zh_Hans: "请输入",
          en_US: "Please input",
        },
        show_on: [],
      },
      {
        variable: "password",
        label: {
          zh_Hans: "密码",
          en_US: "Password",
        },
        type: "secret-input",
        required: true,
        placeholder: {
          zh_Hans: "请输入",
          en_US: "Please input",
        },
        show_on: [],
      },
      {
        variable: "description",
        label: {
          zh_Hans: "数据源描述",
          en_US: "Description",
        },
        type: "text-input",
        required: false,
        placeholder: {
          zh_Hans: "请输入",
          en_US: "Please input",
        },
        show_on: [],
      },
    ],
  },
  model_credential_schema: {},
  preferred_provider_type: "custom",
  custom_configuration: {
    status: "active",
  },
  system_configuration: {
    enabled: false,
    current_quota_type: null,
    quota_configurations: [],
  },
};
