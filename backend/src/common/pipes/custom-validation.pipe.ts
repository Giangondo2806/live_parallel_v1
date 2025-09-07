import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      // Transform the incoming payload to the DTO instance
      transform: true,
      
      // Strip properties that do not have decorators
      whitelist: true,
      
      // Throw an error if non-whitelisted properties are present
      forbidNonWhitelisted: true,
      
      // Transform primitive types
      transformOptions: {
        enableImplicitConversion: true,
      },
      
      // Custom error message format
      exceptionFactory: (errors: ValidationError[]) => {
        const result = this.formatErrors(errors);
        
        return new BadRequestException({
          statusCode: 400,
          error: 'Validation Failed',
          message: 'Dữ liệu đầu vào không hợp lệ',
          details: result,
          timestamp: new Date().toISOString(),
        });
      },
    });
  }

  private formatErrors(errors: ValidationError[]): any[] {
    return errors.map((error) => {
      const constraints = error.constraints ? Object.values(error.constraints) : [];
      
      return {
        property: error.property,
        value: error.value,
        constraints: constraints,
        message: constraints.length > 0 ? constraints[0] : 'Invalid value',
        children: error.children && error.children.length > 0 
          ? this.formatErrors(error.children)
          : undefined,
      };
    });
  }
}
