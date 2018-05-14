import users from './users'
import interfases from './interfases'
import modules from './modules'
import projects from './projects'
import records from './records'

export default app=>{
  app.use(users.routes(), users.allowedMethods());
  app.use(interfases.routes(), interfases.allowedMethods());
  app.use(modules.routes(), modules.allowedMethods());
  app.use(projects.routes(), projects.allowedMethods());
  app.use(records.routes(), records.allowedMethods());
}
