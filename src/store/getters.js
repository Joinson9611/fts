const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  project_id: state => state.user.selected_project_id,
  project_name: state => state.user.project_name,
  company_id: state => state.user.company_id,
  // 账号类型
  Account_Type: state => state.user.level,
  addRouters: state => state.permission.addRouters,
  permission_routers: state => state.permission.routers,
  roles: state => state.user.roles
}
export default getters
