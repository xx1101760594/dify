import type { FC } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/app/components/base/modal";
import Button from "@/app/components/base/button";
import {
  createDatabase,
  updateDatabase,
  testDatabaseConnection,
} from "@/service/database";
import Input from "@/app/components/header/account-setting/model-provider-page/model-modal/Input";
import { SimpleSelect } from "@/app/components/base/select";
import { useLanguage } from "@/app/components/header/account-setting/model-provider-page/hooks";
import {
  DatabaseConnection,
  DatabaseEngine,
  DatabaseFormData,
} from "@/types/database";

// 扩展的数据库连接类型，包含创建/编辑时需要的字段

export type DatabaseModalProps = {
  database?: DatabaseConnection;
  isEditMode?: boolean;
  onCancel: () => void;
  onSave: () => void;
};

const DatabaseModal: FC<DatabaseModalProps> = ({
  database,
  isEditMode = false,
  onCancel,
  onSave,
}) => {
  const { t } = useTranslation();
  const language = useLanguage();
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean;
    message?: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 重置错误状态
  const resetErrors = () => {
    setErrors({});
    setConnectionResult(null);
  };

  const [formData, setFormData] = useState<DatabaseFormData>({
    database_name: database?.database_name || "",
    engine: (database?.engine as DatabaseEngine) || DatabaseEngine.mysql,
    ip: database?.parameters?.host || "",
    database: database?.parameters?.database || "",
    port: database?.parameters?.port || "3306",
    username: database?.parameters?.username || "",
    password: database?.parameters?.password || "",
    description: database?.parameters?.description || "",
  });

  const handleSave = async () => {
    if (loading) return;

    // 校验表单
    if (!validateForm()) {
      // 显示错误提示
      setConnectionResult({
        success: false,
        message: t("custom.database.pleaseFillRequiredFields"),
      });
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && database && database.id) {
        console.log(database, formData);

        await updateDatabase(database.id, {
          database_name: formData.database_name,
          engine: formData.engine,
          parameters: {
            host: formData.ip,
            port: formData.port,
            username: formData.username,
            password: formData.password,
            database: formData.database,
          },
        });
      } else {
        await createDatabase({
          database_name: formData.database_name,
          engine: formData.engine,
          parameters: {
            host: formData.ip,
            port: formData.port,
            username: formData.username,
            password: formData.password,
            database: formData.database,
          },
        });
      }
      // 传递保存的数据给父组件
      onSave();
    } catch (error) {
      console.error("Failed to save database:", error);
    } finally {
      setLoading(false);
    }
  };

  // IP地址校验函数
  const validateIPAddress = (ip: string): boolean => {
    // IPv4 正则表达式
    const ipv4Regex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    // IPv6 正则表达式（简化版）
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
    // 域名正则表达式
    const domainRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    const trimmedIP = ip.trim();

    // 检查是否为 localhost
    if (trimmedIP.toLowerCase() === "localhost") return true;

    // 检查是否为 IPv4
    if (ipv4Regex.test(trimmedIP)) return true;

    // 检查是否为 IPv6
    if (ipv6Regex.test(trimmedIP)) return true;

    // 检查是否为域名
    if (domainRegex.test(trimmedIP)) return true;

    return false;
  };

  // 端口校验函数
  const validatePort = (port: string): boolean => {
    const portNum = parseInt(port);
    if (isNaN(portNum)) return false;

    // 端口范围：1-65535
    if (portNum < 1 || portNum > 65535) return false;

    return true; // 其他端口也允许
  };

  // 检查端口是否为常用端口
  const isCommonPort = (port: string): boolean => {
    const portNum = parseInt(port);
    if (isNaN(portNum)) return false;

    // 数据库常用端口
    const dbPorts = [3306, 5432, 1433, 1521, 27017, 6379, 5984];
    return dbPorts.includes(portNum);
  };

  /**
   * 校验表单字段
   * @param key 字段名
   * @param value 字段值
   * @returns 错误信息
   */
  const validateField = (key: string, value: string): string => {
    switch (key) {
      case "database_name":
        if (!value.trim()) return t("custom.database.nameRequired");
        break;
      case "database":
        if (!value.trim()) return t("custom.database.databaseRequired");
        break;
      case "ip":
        if (!value.trim()) return t("custom.database.hostRequired");
        if (!validateIPAddress(value)) return t("custom.database.hostInvalid");
        break;
      case "port":
        if (!value) return t("custom.database.portRequired");
        if (!validatePort(value)) return t("custom.database.portInvalid");
        break;
      case "username":
        if (!value.trim()) return t("custom.database.usernameRequired");
        break;
      case "password":
        if (!value.trim()) return t("custom.database.passwordRequired");
        break;
    }
    return "";
  };

  /**
   * 校验整个表单
   * @returns
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // 校验所有必填字段
    const requiredFields = [
      "database_name",
      "database",
      "ip",
      "port",
      "username",
      "password",
    ];
    requiredFields.forEach((field) => {
      const error = validateField(
        field,
        formData[field as keyof DatabaseFormData] || ""
      );
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // 单独校验 engine 字段
    if (!formData.engine) {
      newErrors.engine = t("custom.database.typeRequired");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * 表单字段变化
   * @param key 字段名
   * @param val 字段值
   */
  const handleFormChange = (key: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: val,
    }));

    // 实时校验字段
    const error = validateField(key, val);
    if (error) {
      setErrors((prev) => ({ ...prev, [key]: error }));
    } else {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }

    // 清除之前的连接测试结果
    setConnectionResult(null);
  };

  /**
   * 测试数据库连接
   * @returns
   */
  const handleTestConnection = async () => {
    if (testingConnection) return;

    // 校验表单
    if (!validateForm()) {
      setConnectionResult({
        success: false,
        message: t("custom.database.pleaseFillRequiredFields"),
      });
      return;
    }

    setTestingConnection(true);
    setConnectionResult(null);

    try {
      const { data } = await testDatabaseConnection({
        database_name: formData.database_name,
        engine: formData.engine,
        parameters: {
          host: formData.ip,
          port: formData.port,
          username: formData.username,
          password: formData.password,
          database: formData.database,
        },
      });

      setConnectionResult(data);
    } catch (error) {
      setConnectionResult({
        success: false,
        message: t("custom.database.connectionTestFailed"),
      });
    } finally {
      setTestingConnection(false);
    }
  };

  /**
   * 获取数据库类型的默认端口
   * @param engine
   * @returns
   */
  const getDefaultPort = (engine: DatabaseEngine): string => {
    switch (engine) {
      case DatabaseEngine.mysql:
        return "3306";
      case DatabaseEngine.postgresql:
        return "5432";
      case DatabaseEngine.sqlite:
        return ""; // SQLite 不需要端口
      default:
        return "3306";
    }
  };

  const DatabaseEngineOptions = [
    {
      value: DatabaseEngine.mysql,
      label: { [language]: t("custom.database.mysql"), en_US: "MySQL" },
    },
    {
      value: DatabaseEngine.postgresql,
      label: {
        [language]: t("custom.database.postgresql"),
        en_US: "PostgreSQL",
      },
    },
    // {
    //   value: DatabaseEngine.sqlite,
    //   label: { [language]: t("custom.database.sqlite"), en_US: "SQLite" },
    // },
    // {
    //   value: DatabaseEngine.oracle,
    //   label: { [language]: t("custom.database.oracle"), en_US: "Oracle" },
    // },
    // {
    //   value: DatabaseEngine.mssql,
    //   label: { [language]: t("custom.database.mssql"), en_US: "MSSQL" },
    // },
    // {
    //   value: DatabaseEngine.elasticsearch,
    //   label: {
    //     [language]: t("custom.database.elasticsearch"),
    //     en_US: "Elasticsearch",
    //   },
    // },
    {
      value: DatabaseEngine.clickhouse,
      label: {
        [language]: t("custom.database.clickhouse"),
        en_US: "Clickhouse",
      },
    },
  ];

  return (
    <Modal
      isShow
      onClose={onCancel}
      title={
        isEditMode
          ? t("custom.database.editDatabase")
          : t("custom.database.createDatabase")
      }
      className="w-[600px]"
    >
      <div className="space-y-4">
        {/* 数据库名称 */}
        <div>
          <div className="flex items-center py-2 system-sm-semibold text-text-secondary">
            {t("custom.database.name")}
            <span className="ml-1 text-red-500">*</span>
          </div>
          <Input
            value={formData.database_name}
            onChange={(val) => handleFormChange("database_name", val)}
            placeholder={t("common.placeholder.input")}
            className={`w-full ${errors.database_name ? "border-red-500" : ""}`}
          />
          {errors.database_name && (
            <div className="mt-1 text-sm text-red-500">
              {errors.database_name}
            </div>
          )}
        </div>

        {/* 数据库类型 */}
        <div>
          <div className="flex items-center py-2 system-sm-semibold text-text-secondary">
            {t("custom.database.type")}
            <span className="ml-1 text-red-500">*</span>
          </div>
          <SimpleSelect
            wrapperClassName="h-8"
            className="w-full"
            defaultValue={formData.engine}
            items={DatabaseEngineOptions.map((option) => ({
              value: option.value,
              name: option.label[language] || option.label.en_US,
            }))}
            onSelect={(item) => {
              const selectedType = item.value as DatabaseEngine;
              handleFormChange("engine", selectedType);

              // 自动设置默认端口
              const defaultPort = getDefaultPort(selectedType);
              if (defaultPort && (!formData.port || formData.port === "3306")) {
                setFormData((prev) => ({ ...prev, port: defaultPort }));
              }
            }}
          />
        </div>

        {/* 主机和端口 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center py-2 system-sm-semibold text-text-secondary">
              {t("custom.database.host")}
              <span className="ml-1 text-red-500">*</span>
            </div>
            <Input
              value={formData.ip}
              onChange={(val) => handleFormChange("ip", val)}
              placeholder={t("common.placeholder.input")}
              className={`w-full ${errors.ip ? "border-red-500" : ""}`}
            />
            {errors.ip && (
              <div className="mt-1 text-sm text-red-500">{errors.ip}</div>
            )}
            <div className="mt-1 text-xs text-text-tertiary">
              {t("custom.database.hostFormat")}
            </div>
          </div>
          <div>
            <div className="flex items-center py-2 system-sm-semibold text-text-secondary">
              {t("custom.database.port")}
              <span className="ml-1 text-red-500">*</span>
            </div>
            <Input
              value={formData.port}
              onChange={(val) => handleFormChange("port", val)}
              placeholder={getDefaultPort(formData.engine)}
              type="number"
              className={`w-full ${errors.port ? "border-red-500" : ""}`}
            />
            {errors.port && (
              <div className="mt-1 text-sm text-red-500">{errors.port}</div>
            )}
            {formData.engine !== DatabaseEngine.sqlite && (
              <div className="mt-1 text-xs text-text-tertiary">
                {t("custom.database.defaultPort", {
                  port: getDefaultPort(formData.engine),
                })}
              </div>
            )}
            {formData.port && !isCommonPort(formData.port) && (
              <div className="mt-1 text-xs text-yellow-600">
                {t("custom.database.portWarning")}
              </div>
            )}
          </div>
        </div>

        {/* 用户名和密码 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center py-2 system-sm-semibold text-text-secondary">
              {t("custom.database.username")}
              <span className="ml-1 text-red-500">*</span>
            </div>
            <Input
              value={formData.username}
              onChange={(val) => handleFormChange("username", val)}
              placeholder={t("common.placeholder.input")}
              className={`w-full ${errors.username ? "border-red-500" : ""}`}
            />
            {errors.username && (
              <div className="mt-1 text-sm text-red-500">{errors.username}</div>
            )}
          </div>
          <div>
            <div className="flex items-center py-2 system-sm-semibold text-text-secondary">
              {t("custom.database.password")}
              <span className="ml-1 text-red-500">*</span>
            </div>
            <Input
              value={formData.password}
              onChange={(val) => handleFormChange("password", val)}
              placeholder={t("common.placeholder.input")}
              type="password"
              className={`w-full ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && (
              <div className="mt-1 text-sm text-red-500">{errors.password}</div>
            )}
          </div>
        </div>

        {/* 数据库 */}
        <div>
          <div className="flex items-center py-2 system-sm-semibold text-text-secondary">
            {t("custom.database.database_name")}
            <span className="ml-1 text-red-500">*</span>
          </div>
          <Input
            value={formData.database}
            onChange={(val) => handleFormChange("database", val)}
            placeholder={t("common.placeholder.input")}
            className={`w-full ${errors.database ? "border-red-500" : ""}`}
          />
          {errors.database && (
            <div className="mt-1 text-sm text-red-500">{errors.database}</div>
          )}
        </div>

        {/* 描述 */}
        <div>
          <div className="flex items-center py-2 system-sm-semibold text-text-secondary">
            {t("custom.database.description")}
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
            className="block px-3 py-2 w-full h-20 text-sm rounded-lg border border-transparent appearance-none outline-none bg-components-input-bg-normal text-components-input-text-filled caret-primary-600 placeholder:text-sm placeholder:text-text-tertiary hover:border-components-input-border-hover hover:bg-components-input-bg-hover focus:border-components-input-border-active focus:bg-components-input-bg-active focus:shadow-xs"
            placeholder={t("common.placeholder.input")}
            rows={3}
          />
        </div>
      </div>

      {/* 连接测试结果 */}
      {connectionResult && (
        <div
          className={`mt-4 p-3 rounded-lg ${
            connectionResult.success
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div
            className={`text-sm ${
              connectionResult.success ? "text-green-800" : "text-red-800"
            }`}
          >
            {connectionResult.success
              ? t("custom.database.connectionTestSuccess")
              : connectionResult.message ||
                t("custom.database.connectionTestFailed")}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={handleTestConnection}
          loading={testingConnection}
          disabled={loading}
          variant="secondary"
        >
          {t("custom.database.testConnection")}
        </Button>

        <div className="flex gap-3">
          <Button
            onClick={() => {
              resetErrors();
              onCancel();
            }}
            disabled={loading}
          >
            {t("common.operation.cancel")}
          </Button>
          <Button variant="primary" onClick={handleSave} loading={loading}>
            {isEditMode
              ? t("common.operation.confirm")
              : t("common.operation.confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DatabaseModal;
