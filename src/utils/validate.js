/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  if (str.length < 3 || str.length > 32) {
    return false
  } else if (check_other_char(str)) {
    return false
  } else {
    return true
  }
}

// 验证用户名是否含有特殊字符
export function check_other_char(str) {
  const UserName = '^(?=[0-9a-zA-Z_]+$)'
  const REG = new RegExp(UserName)
  if (REG.test(str)) {
    return false
  } else {
    return true
  }
}

