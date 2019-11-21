// 普通对象转化为formdata对象
export function toFormData(Obj) {
  const formdata = new FormData()
  for (const key in Obj) {
    formdata.set(key, Obj[key])
  }
  return formdata
}
