import { Body, Controller, Get, Param, Patch, Query, Req, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../user/enums/user-role.enum"
import { NotificationService } from "./notification.service"
import { ApiTags } from "@nestjs/swagger"

@ApiTags("notification")
@Controller("notif")
export class NotificationController {
  constructor(private readonly notifService: NotificationService) { }

  // Admin get all notification
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/admin')
  async getAllAdmin() {        
    return this.notifService.getAllAdmin()
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch("/admin/read-all")
  async markManyAsReadAdmin(@Body("ids") ids: number[]) {    
    return this.notifService.markManyAsReadAdmin(ids);
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch("/read-all")
  async markManyAsRead(@Query('id') id: string, @Body("ids") ids: number[]) {
    return this.notifService.markManyAsRead(ids, Number(id));
  }
  
  // get all notification
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getAll(@Param('id') id: string) {
    return this.notifService.getAll(Number(id))
  }
}

