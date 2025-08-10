import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/app.module'
import { HTTPMethod, RoleName } from 'src/shared/constants/role.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

const SellerModule = ['AUTH', 'MEDIA', 'MANAGE-PRODUCT', 'PRODUCT-TRANSLATION', 'PROFILE', 'ORDER', 'REVIEW']
const ClientModule = ['AUTH', 'MEDIA', 'PROFILE', 'CART', 'ORDER', 'REVIEW']

const prisma = new PrismaService()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(3010)
  const server = app.getHttpAdapter().getInstance()
  const router = server.router
  const permissionsInDb = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  })

  const availableRoutes: { path: string; method: keyof typeof HTTPMethod; name: string }[] = router.stack
    .map((layer) => {
      if (layer.route) {
        const path = layer.route?.path
        const method = String(layer.route?.stack[0].method).toUpperCase() as keyof typeof HTTPMethod
        const moduleName = String(path.split('/')[1]).toUpperCase()
        return {
          path,
          method,
          name: method + ' ' + path,
          module: moduleName,
        }
      }
    })
    .filter((item) => item !== undefined)

  // Create object permissionInDbMap with key [method-path]
  const permissionInDbMap: Record<string, (typeof permissionsInDb)[0]> = permissionsInDb.reduce((acc, item) => {
    acc[`${item.method}-${item.path}`] = item
    return acc
  }, {})

  // Create object availableRoutesMap with key [method-path]
  const availableRoutesMap: Record<string, (typeof availableRoutes)[0]> = availableRoutes.reduce((acc, item) => {
    acc[`${item.method}-${item.path}`] = item
    return acc
  }, {})

  const permissionsToDelete = permissionsInDb.filter((item) => {
    return !availableRoutesMap[`${item.method}-${item.path}`]
  })

  // Delete permissions not exist in availableRoutes
  if (permissionsToDelete.length > 0) {
    const deleteResult = await prisma.permission.deleteMany({
      where: {
        id: {
          in: permissionsToDelete.map((item) => item.id),
        },
      },
    })
    console.log('Deleted permissions:', deleteResult.count)
  } else {
    console.log('No permissions to delete')
  }

  //Find routes which not exist in permissionsInDb
  const routesToAdd = availableRoutes.filter((item) => {
    return !permissionInDbMap[`${item.method}-${item.path}`]
  })

  // Add routes as permissions database
  if (routesToAdd.length > 0) {
    const permissionsToAdd = await prisma.permission.createMany({
      data: routesToAdd,
      skipDuplicates: true,
    })
    console.log('Added permissions:', permissionsToAdd.count)
  } else {
    console.log('No permissions to add')
  }

  // Get permission in db after insert or delete
  const updatedPermissionsInDb = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  })

  const adminPermissionIds = updatedPermissionsInDb.map((item) => ({ id: item.id }))

  const sellerPermissionIds = updatedPermissionsInDb
    .filter((item) => SellerModule.includes(item.module))
    .map((item) => ({ id: item.id }))

  const clientPermissionIds = updatedPermissionsInDb
    .filter((item) => ClientModule.includes(item.module))
    .map((item) => ({ id: item.id }))

  await Promise.all([
    updateRole(adminPermissionIds, RoleName.Admin),
    updateRole(sellerPermissionIds, RoleName.Seller),
    updateRole(clientPermissionIds, RoleName.Client),
  ])
  process.exit(0)
}

const updateRole = async (permissionIds: { id: number }[], roleName: string) => {
  // Cập nhật lại các permissions trong Admin Role
  const role = await prisma.role.findFirstOrThrow({
    where: {
      name: roleName,
      deletedAt: null,
    },
  })
  await prisma.role.update({
    where: {
      id: role.id,
    },
    data: {
      permissions: {
        set: permissionIds,
      },
    },
  })
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
