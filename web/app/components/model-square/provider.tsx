export const provider: any = {
    "tenant_id": "5455071e-6420-4107-9cf7-3e35e9595439",
    "provider": "langgenius/openai_api_compatible/openai_api_compatible",
    "label": {
        "zh_Hans": "模型",
        "en_US": "model"
    },
    "description": {
        "zh_Hans": "\u517c\u5bb9 OpenAI API \u7684\u6a21\u578b\u4f9b\u5e94\u5546\uff0c\u4f8b\u5982 LM Studio \u3002",
        "en_US": "Model providers compatible with OpenAI's API standard, such as LM Studio."
    },
    "icon_small": {
        "zh_Hans": "/console/api/workspaces/5455071e-6420-4107-9cf7-3e35e9595439/model-providers/langgenius/openai_api_compatible/openai_api_compatible/icon_small/zh_Hans",
        "en_US": "/console/api/workspaces/5455071e-6420-4107-9cf7-3e35e9595439/model-providers/langgenius/openai_api_compatible/openai_api_compatible/icon_small/en_US"
    },
    "icon_large": null,
    "background": null,
    "help": null,
    "supported_model_types": [
        "llm",
        "rerank",
        "text-embedding",
        "speech2text",
        "tts"
    ],
    "configurate_methods": [
        "customizable-model"
    ],
    "provider_credential_schema": null,
    "model_credential_schema": {
        "model": {
            "label": {
                "zh_Hans": "\u6a21\u578b\u540d\u79f0",
                "en_US": "Model Name"
            },
            "placeholder": {
                "zh_Hans": "\u8f93\u5165\u6a21\u578b\u5168\u79f0",
                "en_US": "Enter full model name"
            }
        },
        "credential_form_schemas": [
            {
                "variable": "display_name",
                "label": {
                    "zh_Hans": "\u6a21\u578b\u663e\u793a\u540d\u79f0",
                    "en_US": "Model display name"
                },
                "type": "text-input",
                "required": false,
                "default": null,
                "options": [

                ],
                "placeholder": {
                    "zh_Hans": "\u6a21\u578b\u5728\u754c\u9762\u7684\u663e\u793a\u540d\u79f0",
                    "en_US": "The display name of the model in the interface."
                },
                "max_length": 0,
                "show_on": [

                ]
            },
            {
                "variable": "api_key",
                "label": {
                    "zh_Hans": "API Key",
                    "en_US": "API Key"
                },
                "type": "secret-input",
                "required": false,
                "default": null,
                "options": [

                ],
                "placeholder": {
                    "zh_Hans": "\u5728\u6b64\u8f93\u5165\u60a8\u7684 API Key",
                    "en_US": "Enter your API Key"
                },
                "max_length": 0,
                "show_on": [

                ]
            },
            {
                "variable": "endpoint_url",
                "label": {
                    "zh_Hans": "API endpoint URL",
                    "en_US": "API endpoint URL"
                },
                "type": "text-input",
                "required": true,
                "default": null,
                "options": [

                ],
                "placeholder": {
                    "zh_Hans": "Base URL, e.g. https://api.openai.com/v1",
                    "en_US": "Base URL, e.g. https://api.openai.com/v1"
                },
                "max_length": 0,
                "show_on": [

                ]
            },
            {
                "variable": "endpoint_model_name",
                "label": {
                    "zh_Hans": "API endpoint\u4e2d\u7684\u6a21\u578b\u540d\u79f0",
                    "en_US": "model name for API endpoint"
                },
                "type": "text-input",
                "required": false,
                "default": null,
                "options": [

                ],
                "placeholder": {
                    "zh_Hans": "endpoint model name, e.g. chatgpt4.0",
                    "en_US": "endpoint model name, e.g. chatgpt4.0"
                },
                "max_length": 0,
                "show_on": [

                ]
            },
            {
                "variable": "mode",
                "label": {
                    "zh_Hans": "Completion mode",
                    "en_US": "Completion mode"
                },
                "type": "select",
                "required": false,
                "default": "chat",
                "options": [
                    {
                        "label": {
                            "zh_Hans": "\u8865\u5168",
                            "en_US": "Completion"
                        },
                        "value": "completion",
                        "show_on": [

                        ]
                    },
                    {
                        "label": {
                            "zh_Hans": "\u5bf9\u8bdd",
                            "en_US": "Chat"
                        },
                        "value": "chat",
                        "show_on": [

                        ]
                    }
                ],
                "placeholder": {
                    "zh_Hans": "\u9009\u62e9\u5bf9\u8bdd\u7c7b\u578b",
                    "en_US": "Select completion mode"
                },
                "max_length": 0,
                "show_on": [
                    {
                        "variable": "__model_type",
                        "value": "llm"
                    }
                ]
            },
            {
                "variable": "context_size",
                "label": {
                    "zh_Hans": "\u6a21\u578b\u4e0a\u4e0b\u6587\u957f\u5ea6",
                    "en_US": "Model context size"
                },
                "type": "text-input",
                "required": true,
                "default": "4096",
                "options": [

                ],
                "placeholder": {
                    "zh_Hans": "\u5728\u6b64\u8f93\u5165\u60a8\u7684\u6a21\u578b\u4e0a\u4e0b\u6587\u957f\u5ea6",
                    "en_US": "Enter your Model context size"
                },
                "max_length": 0,
                "show_on": [
                    {
                        "variable": "__model_type",
                        "value": "llm"
                    }
                ]
            },
            {
                "variable": "context_size",
                "label": {
                    "zh_Hans": "\u6a21\u578b\u4e0a\u4e0b\u6587\u957f\u5ea6",
                    "en_US": "Model context size"
                },
                "type": "text-input",
                "required": true,
                "default": "4096",
                "options": [

                ],
                "placeholder": {
                    "zh_Hans": "\u5728\u6b64\u8f93\u5165\u60a8\u7684\u6a21\u578b\u4e0a\u4e0b\u6587\u957f\u5ea6",
                    "en_US": "Enter your Model context size"
                },
                "max_length": 0,
                "show_on": [
                    {
                        "variable": "__model_type",
                        "value": "text-embedding"
                    }
                ]
            },
            {
                "variable": "context_size",
                "label": {
                    "zh_Hans": "\u6a21\u578b\u4e0a\u4e0b\u6587\u957f\u5ea6",
                    "en_US": "Model context size"
                },
                "type": "text-input",
                "required": true,
                "default": "4096",
                "options": [

                ],
                "placeholder": {
                    "zh_Hans": "\u5728\u6b64\u8f93\u5165\u60a8\u7684\u6a21\u578b\u4e0a\u4e0b\u6587\u957f\u5ea6",
                    "en_US": "Enter your Model context size"
                },
                "max_length": 0,
                "show_on": [
                    {
                        "variable": "__model_type",
                        "value": "rerank"
                    }
                ]
            },
            {
                "variable": "max_tokens_to_sample",
                "label": {
                    "zh_Hans": "\u6700\u5927 token \u4e0a\u9650",
                    "en_US": "Upper bound for max tokens"
                },
                "type": "text-input",
                "required": false,
                "default": "4096",
                "options": [

                ],
                "placeholder": null,
                "max_length": 0,
                "show_on": [
                    {
                        "variable": "__model_type",
                        "value": "llm"
                    }
                ]
            },
            {
                "variable": "agent_though_support",
                "label": {
                    "zh_Hans": "Agent Thought",
                    "en_US": "Agent Thought"
                },
                "type": "select",
                "required": false,
                "default": "not_supported",
                "options": [
                    {
                        "label": {
                            "zh_Hans": "\u652f\u6301",
                            "en_US": "Support"
                        },
                        "value": "supported",
                        "show_on": [

                        ]
                    },
                    {
                        "label": {
                            "zh_Hans": "\u4e0d\u652f\u6301",
                            "en_US": "Not Support"
                        },
                        "value": "not_supported",
                        "show_on": [

                        ]
                    }
                ],
                "placeholder": null,
                "max_length": 0,
                "show_on": [
                    {
                        "variable": "__model_type",
                        "value": "llm"
                    }
                ]
            },
            {
                "variable": "function_calling_type",
                "label": {
                    "zh_Hans": "Function calling",
                    "en_US": "Function calling"
                },
                "type": "select",
                "required": false,
                "default": "no_call",
                "options": [
                    {
                        "label": {
                            "zh_Hans": "Function Call",
                            "en_US": "Function Call"
                        },
                        "value": "function_call",
                        "show_on": [

                        ]
                    },
                    {
                        "label": {
                            "zh_Hans": "Tool Call",
                            "en_US": "Tool Call"
                        },
                        "value": "tool_call",
                        "show_on": [

                        ]
                    },
                    {
                        "label": {
                            "zh_Hans": "\u4e0d\u652f\u6301",
                            "en_US": "Not Support"
                        },
                        "value": "no_call",
                        "show_on": [

                        ]
                    }
                ],
                "placeholder": null,
                "max_length": 0,
                "show_on": [
                    {
                        "variable": "__model_type",
                        "value": "llm"
                    }
                ]
            },
            {
                "variable": "stream_function_calling",
                "label": {
                    "zh_Hans": "Stream function calling",
                    "en_US": "Stream function calling"
                },
                "type": "select",
                "required": false,
                "default": "not_supported",
                "options": [
                    {
                        "label": {
                            "zh_Hans": "\u652f\u6301",
                            "en_US": "Support"
                        },
                        "value": "supported",
                        "show_on": [

                        ]
                    },
                    {
                        "label": {
                            "zh_Hans": "\u4e0d\u652f\u6301",
                            "en_US": "Not Support"
                        },
                        "value": "not_supported",
                        "show_on": [

                        ]
                    }
                ],
                "placeholder": null,
                "max_length": 0,
                "show_on": [
                    {
                        "variable": "__model_type",
                        "value": "llm"
                    }
                ]
            },
            {
                "variable": "vision_support",
                "label": {
                    "zh_Hans": "Vision \u652f\u6301",
                    "en_US": "Vision Support"
                },
                "type": "select",
                "required": false,
                "default": "no_support",
                "options": [
                    {
                        "label": {
                            "zh_Hans": "\u652f\u6301",
                            "en_US": "Support"
                        },
                        "value": "support",
                        "show_on": [

                        ]
                    },
                    {
                        "label": {
                            "zh_Hans": "\u4e0d\u652f\u6301",
                            "en_US": "Not Support"
                        },
                        "value": "no_support",
                        "show_on": [

                        ]
                    }
                ],
                "placeholder": null,
                "max_length": 0,
                "show_on": [
                    {
                        "variable": "__model_type",
                        "value": "llm"
                    }
                ]
            },
            {
                "variable": "structured_output_support",
                "label": {
                    "zh_Hans": "Structured Output",
                    "en_US": "Structured Output"
                },
                "type": "select",
                "required": false,
                "default": "not_supported",
                "options": [
                    {
                        "label": {
                            "zh_Hans": "\u652f\u6301",
                            "en_US": "Support"
                        },
                        "value": "supported",
                        "show_on": [

                        ]
                    },
                    {
                        "label": {
                            "zh_Hans": "\u4e0d\u652f\u6301",
                            "en_US": "Not Support"
                        },
                        "value": "not_supported",
                        "show_on": [

                        ]
                    }
                ],
                "placeholder": null,
                "max_length": 0,
                "show_on": [
                    {
                        "variable": "__model_type",
                        "value": "llm"
                    }
                ]
            },
            {
                "variable": "stream_mode_delimiter",
                "label": {
                    "zh_Hans": "\u6d41\u6a21\u5f0f\u8fd4\u56de\u7ed3\u679c\u7684\u5206\u9694\u7b26",
                    "en_US": "Delimiter for streaming results"
                },
                "type": "text-input",
                "required": false,
                "default": "\\n\\n",
                "options": [

                ],
                "placeholder": null,
                "max_length": 0,
                "show_on": [
                    {
                        "variable": "__model_type",
                        "value": "llm"
                    }
                ]
            },
            {
                "variable": "voices",
                "label": {
                    "zh_Hans": "\u53ef\u7528\u58f0\u97f3\uff08\u7528\u82f1\u6587\u9017\u53f7\u5206\u9694\uff09",
                    "en_US": "Available Voices (comma-separated)"
                },
                "type": "text-input",
                "required": false,
                "default": "alloy",
                "options": [

                ],
                "placeholder": {
                    "zh_Hans": "alloy,echo,fable,onyx,nova,shimmer",
                    "en_US": "alloy,echo,fable,onyx,nova,shimmer"
                },
                "max_length": 0,
                "show_on": [
                    {
                        "variable": "__model_type",
                        "value": "tts"
                    }
                ]
            }
        ]
    },
    "preferred_provider_type": "custom",
    "custom_configuration": {
        "status": "active"
    },
    "system_configuration": {
        "enabled": false,
        "current_quota_type": null,
        "quota_configurations": [

        ]
    }
}