import { Injectable, NotFoundException, Inject } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { File } from "./entities/file.entity"
import { UploadFileDto } from "./dto/upload-file.dto"
import { User } from "../user/entities/user.entity"
import { ConfigService } from "@nestjs/config"
import * as fs from "fs"

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @Inject(ConfigService)
    private configService: ConfigService
  ) {}

  async uploadFile(file: Express.Multer.File, uploadFileDto: UploadFileDto, user: User): Promise<File> {
    const useRelativePath = process.env.USE_RELATIVE_PATH === 'true';

    const fullPath = file.path.replace(/\\/g, "/");
    
    let filePath: string;
    
    if (useRelativePath) {
      const relativePath = fullPath.split('/uploads/')[1];
      filePath = `uploads/${relativePath}`;
    } else {
      filePath = fullPath.split('/backend/')[1];
    }
    const fileEntity = this.fileRepository.create({
      originalName: file.originalname,
      path: filePath,
      mimeType: file.mimetype,
      size: file.size,
      fileType: uploadFileDto.fileType,
      entityId: uploadFileDto.entityId,
      entityType: uploadFileDto.entityType,
      uploadedBy: user,
    })

    return await this.fileRepository.save(fileEntity)
  }

  async findOne(id: number): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { id },
      relations: ["uploadedBy"],
    })
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`)
    }
    return file
  }

  async remove(id: number): Promise<void> {
    const file = await this.findOne(id)

    // Remove the file from the file system
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path)
    }

    const result = await this.fileRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`File with ID ${id} not found`)
    }
  }
}

