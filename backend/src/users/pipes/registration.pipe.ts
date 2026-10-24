import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto.js';

@Injectable()
export class RegistrationPipe implements PipeTransform<CreateUserDto> {
    transform(value: CreateUserDto, metadata: ArgumentMetadata) {
        if (!value) {
            throw new BadRequestException('Request body cannot be empty');
        }

        // 1. Password confirmation check
        if (value.password !== value.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        // 2. Sanitize and normalize inputs
        return {
            ...value,
            email: value.email?.trim().toLowerCase(),
            username: value.username?.trim(),
        };
    }
}
