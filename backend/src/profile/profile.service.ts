import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async getProfile(): Promise<Profile> {
    let profile = await this.profileRepository.findOne({
      where: {},
      order: { id: 'ASC' },
    });

    if (!profile) {
      // Seed default profile if not yet created
      profile = this.profileRepository.create({
        username: 'default_user',
        displayName: 'Default User',
        email: 'user@example.com',
      });
      profile = await this.profileRepository.save(profile);
    }

    return profile;
  }

  async updateProfile(updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.getProfile();
    Object.assign(profile, updateProfileDto);
    return this.profileRepository.save(profile);
  }
}
