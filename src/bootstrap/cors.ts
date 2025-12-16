import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig: CorsOptions = {
  origin: true,
  credentials: false,
  allowedHeaders: ['content-type', 'authorization', 'x-tunnel-id'],
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
};
