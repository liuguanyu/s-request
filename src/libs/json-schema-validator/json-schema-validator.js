// 错误信息
const messages = {
  invalidType: types => `Expected ${types[ 0 ]} but got ${types[ 1 ]}.`,
  arrayMinItems: num => `Array must have at least ${num} items.`,
  arrayMaxItems: num => `Array must not have more than ${num} items.`,
  invalidEnum: enums => `Value must be one of: ${enums}.`,
  numberMinValue: num => `Value must not be less than ${num}.`,
  numberMaxValue: num => `Value must not be greater than ${num}.`,
  stringMinLength: len => `String must be at least ${len} characters long.`,
  stringMaxLength: len =>
    `String must not be more than ${len} characters long.`,
  stringPattern: pattern => `String must match the pattern: ${pattern}.`,
  schemaRequired: () => 'Schema value required.',
  unknownSchemaReference: () => 'Unknown schema reference: *.',
  unexpectedProperty: prop => `Unexpected property ${prop}.`,
  propertyRequired: prop => `Missing required property ${prop}.`
}

const toStr = val => Object.prototype.toString.call(val).slice(8, -1)

/**
 *
 * JSON Schema Validator
 * @export
 * @class JSONSchemaValidator
 */
export default class JSONSchemaValidator {
  constructor() {
    this.errors = []
    this.types = []
  }

  /**
   * 添加错误信息
   *
   * @param {*} path
   * @param {*} key
   * @param {*} val
   * @memberof JSONSchemaValidator
   */
  addError(path, key, val) {
    this.errors.push({
      path,
      message: this.formatError(key, val)
    })
  }

  resetError() {
    this.errors = []
  }

  /**
   * 格式化错误信息
   * @param {string} key
   * @param {any | array} error
   */
  formatError(key, error) {
    return messages[key](error)
  }

  /**
   * 获取类型
   * @param {any} value
   */
  getType(value) {
    const str = typeof value

    if (str === 'object') {
      return value === null ? null : toStr(value).toLowerCase()
    }

    return str
  }

  /**
   * 获取 schema 的类型定义
   * 例如：schema.type = Array | 'array'
   * 应当返回：'array'
   * @param {*} value
   * @memberof JSONSchemaValidator
   */
  getSchemaType(value) {
    if (typeof value === 'function') {
      // Array 形式类型定义
      return value.name.toLowerCase()
    } else if (value instanceof Array) {
      return value.map(item => {
        return this.getSchemaType(item)
      });
    }
    // console.log(value, value.toLowerCase());
    return value.toLowerCase()
  }

  /**
   * 校验
   * @param {any} instance
   * @param {any} schema
   * @param {string} optionalPath
   */
  validate(instance, schema, optionalPath) {
    const path = optionalPath || ''
    if (!schema) {
      // 未定义 schema
      this.addError(path, 'schemaRequired')
      return
    }

    // 枚举属性
    if (schema.enum) {
      if (!this.validateEnum(instance, schema, path)) {
        return
      }
    }
    if (!schema.required && instance === undefined) {
      return;
    }
    if (schema.type && this.getSchemaType(schema.type) !== 'any') {
      if (!this.validateType(instance, schema, path)) {
        return
      }
      let cType = this.getSchemaType(schema.type);
      let res = this.validateMultiply(cType, instance, schema, path);
      res.forEach(item => {
        this.addError(item[0], item[1], item[2]);
      });
    }
  }

  /**
   * 校验枚举值
   * @param {*} instance
   * @param {*} schema
   * @param {*} path
   * @returns Boolean
   * @memberof JSONSchemaValidator
   */
  validateEnum(instance, schema, path) {
    let len = schema.enum.length

    for (let i = 0; i < len; ++i) {
      if (String(instance) === String(schema.enum[i])) {
        // FIXME: 可能会有问题
        return true
      }
    }

    this.addError(path, 'invalidEnum', schema.enum)

    return false
  }

  validateMultiply(type, instance, schema, path) {
    let resErrors = [];
    if (type instanceof Array) {
      let pass = false;
      type.forEach(item => {
        let res = this.validateMultiply(item, instance, item, path)
        if (res.length === 0) {
          pass = true;
        } else {
          resErrors = resErrors.concat(res);
        }
      });
      if (pass) {
        resErrors = [];
      }
    } else if (type === 'object') {
      resErrors = resErrors.concat(this.validateObject(instance, schema, path))
    } else if (type === 'array') {
      resErrors = resErrors.concat(this.validateArray(instance, schema, path))
    } else if (type === 'string') {
      resErrors = resErrors.concat(this.validateString(instance, schema, path))
    } else if (type === 'number') {
      resErrors = resErrors.concat(this.validateNumber(instance, schema, path))
    }
    return resErrors;
  }
  /**
   * 校验是否符合 schema 定义的类型
   * @param {*} instance
   * @param {*} schema
   * @param {*} path
   * @returns
   * @memberof JSONSchemaValidator
   */
  validateType(instance, schema, path) {
    const actualType = this.getType(instance)
    const schemaType = this.getSchemaType(schema.type)
    if (schema.required) {
      let cError = false;
      if (schemaType instanceof Array) {
        if (schemaType.indexOf(actualType) !== -1) {
          cError = true
        }
      } else if (actualType === schemaType) {
        cError = true
      }
      if (!cError) {
        this.addError(path, 'invalidType', [schemaType, actualType])
        return false
      }
    }
    return true
  }

  /**
   * 检验对象
   * @param {*} instance
   * @param {*} schema
   * @param {*} path
   * @memberof JSONSchemaValidator
   */
  validateObject(instance, schema, path) {
    let resErrors = [];
    if (schema.properties && !schema.optional) {
      Object.keys(schema.properties).forEach(key => {
        const keyPath = path ? path + '.' + key : key

        if (
          (instance[key] === null || instance[key] === undefined) &&
          schema.properties[key].default
        ) {
          // default
          const defaultVal = schema.properties[key].default

          instance[key] =
            typeof defaultVal === 'function' ? defaultVal() : defaultVal
        }
        if (instance[key] !== null || instance[key] !== undefined) {
          this.validate(instance[key], schema.properties[key], keyPath)
        } else if (!schema.properties[key].optional) {
          // 非可选值
          resErrors.push([keyPath, 'propertyRequired', key]);
        }
      })
    }

    if (!schema.additionalProperties) {
      return resErrors
    }

    // 附加 any 类型
    if (
      schema.additionalProperties.type &&
      schema.additionalProperties.type === 'any'
    ) {
      return resErrors
    }

    // 检验附加属性
    Object.keys(instance).forEach(key => {
      const keyPath = path ? path + '.' + key : key

      if (schema.additionalProperties) {
        this.validate(instance[key], schema.additionalProperties, keyPath)
      } else {
        resErrors.push([keyPath, 'unexpectedProperty', keyPath]);
      }
    })
    return resErrors;
  }

  /**
   * 检验数组
   * @param {*} instance
   * @param {*} schema
   * @param {*} path
   * @memberof JSONSchemaValidator
   */
  validateArray(instance, schema, path) {
    let resErrors = [];
    if ((!instance || !instance.length) && schema.optional) {
      // 可选值未定义也可以
      return true
    }

    const typeofItems = this.getType(schema.items)

    if (typeofItems === 'object') {
      if (schema.minItems && instance.length < schema.minItems) {
        // 最小数目
        resErrors.push([path, 'arrayMinItems', [schema.minItems]]);
      }

      if (schema.maxItems && instance.length > schema.maxItems) {
        // 最大数目
        resErrors.push([path, 'arrayMaxItems', [schema.maxItems]]);
      }

      let len = instance.length

      while (len--) {
        this.validate(instance[len], schema.items, path + '.' + len)
      }
    }
    return resErrors;
  }

  /**
   * 检验字符串
   * @param {*} instance
   * @param {*} schema
   * @param {*} path
   * @memberof JSONSchemaValidator
   */
  validateString(instance, schema, path) {
    let resErrors = [];
    const actualType = this.getType(instance)
    if (schema.minLength && instance.length < schema.minLength) {
      resErrors.push([path, 'stringMinLength', [schema.minLength]]);
    }
    if (schema.maxLength && instance.length > schema.maxLength) {
      resErrors.push([path, 'stringMaxLength', [schema.maxLength]]);
    }

    if (schema.pattern && !schema.pattern.test(instance)) {
      resErrors.push([path, 'stringPattern', [schema.pattern]]);
    }

    if (actualType !== 'string') {
      resErrors.push([path, 'invalidType', ['string', actualType]]);
    }
    return resErrors;
  }

  /**
   * 检验数字
   * @param {*} instance
   * @param {*} schema
   * @param {*} path
   * @memberof JSONSchemaValidator
   */
  validateNumber(instance, schema, path) {
    let resErrors = [];
    const actualType = this.getType(instance)
    if (actualType !== 'number') {
      resErrors.push([path, 'invalidType', ['number', actualType]]);
    }
    return resErrors;
  }
}