import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Inject,
} from '@nestjs/common'
import { REQUEST_ROLE_PERMISSIONS, REQUEST_USER_KEY } from 'src/shared/constants/auth.constant'
import { TokenService } from 'src/shared/services/token.service'
import { PrismaService } from '../services/prisma.service'
import { AccessTokenPayload } from '../types/jwt.type'
import { HTTPMethod } from '../constants/role.constant'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { RolePermissionsType } from '../models/shared-role.model'
import { keyBy } from 'lodash'

type Permission = RolePermissionsType['permissions'][number]
type CachedRole = RolePermissionsType & {
  permissions: {
    [key: string]: Permission
  }
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    // Extract and validate token
    const decodedAccessToken = await this.extractAndValidateToken(request)

    //Check user permission
    await this.validateUserPermission(decodedAccessToken, request)
    return true
  }

  private async extractAndValidateToken(request: any): Promise<AccessTokenPayload> {
    const accessToken = this.extractAccessTokenFromHeader(request)
    try {
      const decodedAcessToken = await this.tokenService.verifyAccessToken(accessToken)
      request[REQUEST_USER_KEY] = decodedAcessToken
      return decodedAcessToken
    } catch (error) {
      throw new UnauthorizedException('Error.InvalidAccesToken')
    }
  }

  private extractAccessTokenFromHeader(request: any): string {
    const accessToken = request.headers.authorization?.split(' ')[1]
    if (!accessToken) {
      throw new UnauthorizedException('Error.MissingAccessToken')
    }
    return accessToken
  }

  private async validateUserPermission(decodedAccessToken: AccessTokenPayload, request: any): Promise<void> {
    const roleId: number = decodedAccessToken.roleId
    const path: string = request.route.path
    const method = request.method as keyof typeof HTTPMethod
    const cacheKey = `role:${roleId}`
    // Get cache
    let cachedRole = await this.cacheManager.get<CachedRole>(cacheKey)
    // If there is no cache, query from db
    if (cachedRole === undefined) {
      const role = await this.prismaService.role
        .findUniqueOrThrow({
          where: {
            id: roleId,
            deletedAt: null,
            isActive: true,
          },
          include: {
            permissions: {
              where: {
                deletedAt: null,
              },
            },
          },
        })
        .catch(() => {
          throw new ForbiddenException()
        })

      const permissionObject = keyBy(
        role.permissions,
        (permission) => `${permission.path}:${permission.method}`,
      ) as CachedRole['permissions']
      cachedRole = { ...role, permissions: permissionObject }
      await this.cacheManager.set(cacheKey, cachedRole, 1000 * 60 * 60) // Cache for 1 hour

      request[REQUEST_ROLE_PERMISSIONS] = role
    }

    // 3. Kiểm tra quyền truy cập
    const canAccess: Permission | undefined = cachedRole.permissions[`${path}:${method}`]
    if (!canAccess) {
      throw new ForbiddenException()
    }
  }
}
