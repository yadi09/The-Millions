import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'The Millions CMS API',
      version: '1.0.0',
      description: 'API documentation for The Millions CMS backend',
    },
    servers: [
      {
        url: 'http://localhost:10000',
        description: 'Development server',
      },
      {
        url: 'https://the-millions-backend.onrender.com', // Replace with your actual Render URL
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Page: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            slug: { type: 'string', example: 'home' },
            title: { type: 'string', example: 'Home Page' },
            sections: {
              type: 'array',
              items: { $ref: '#/components/schemas/Section' },
            },
            footer: { $ref: '#/components/schemas/Footer' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
          },
        },
        Section: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' },
            pageId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            type: { type: 'string', example: 'hero' },
            order: { type: 'integer', example: 1 },
            content: { type: 'object', example: { title: 'Welcome', description: 'Welcome to our site' } },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
          },
        },
        Footer: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'cjq0000000000000000000000' },
            phone: { type: 'string', example: '+1234567890' },
            email: { type: 'string', example: 'info@themillions.com' },
            address: { type: 'string', example: 'London, UK' },
            socialMedia: { type: 'object', example: { whatsapp: '+1234567890' } },
            copyright: { type: 'string', example: '© 2026 The Millions. All rights reserved.' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
          },
        },
        Service: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174002' },
            name: { type: 'string', example: 'Accounting' },
            description: { type: 'string', example: 'Financial accounting services' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
          },
        },
        ContactMessage: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174003' },
            fullName: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
            phone: { type: 'string', example: '+1234567890' },
            message: { type: 'string', example: 'I have a question about your services.' },
            serviceId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174002' },
            status: { type: 'string', enum: ['NEW', 'READ', 'REPLIED'], example: 'NEW' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
          },
        },
        BlogPost: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174004' },
            title: { type: 'string', example: 'How to save money' },
            slug: { type: 'string', example: 'how-to-save-money' },
            category: { type: 'string', example: 'Finance Tips' },
            coverImage: { type: 'string', example: '/images/save-money.jpg' },
            excerpt: { type: 'string', example: 'Learn how to save money effectively.' },
            content: { type: 'string', example: 'Saving money is important for financial health.' },
            status: { type: 'string', enum: ['DRAFT', 'PUBLISHED'], example: 'PUBLISHED' },
            author: { type: 'string', example: 'Admin' },
            publishedAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174005' },
            email: { type: 'string', example: 'admin@themillions.com' },
            // Password is hidden in responses
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
          },
        },
        SidebarItem: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'sidebar-item-1' },
            label: { type: 'string', example: 'Dashboard' },
            icon: { type: 'string', example: 'layout-dashboard' },
            route: { type: 'string', example: '/admin' },
            roles: { type: 'array', items: { type: 'string' }, example: ['admin', 'editor'] },
            order: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
          },
        },
        Widget: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'widget-1' },
            type: { type: 'string', example: 'stat' },
            title: { type: 'string', example: 'Total Pages' },
            endpoint: { type: 'string', example: '/api/admin/pages/count' },
            refreshInterval: { type: 'integer', example: 30000 },
            roles: { type: 'array', items: { type: 'string' }, example: ['admin'] },
            order: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
          },
        },
        Setting: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'setting-1' },
            key: { type: 'string', example: 'site.title' },
            value: { type: 'string', example: 'The Millions' },
            type: { type: 'string', enum: ['string', 'number', 'boolean', 'object'], example: 'string' },
            group: { type: 'string', example: 'general' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-05-09T10:00:00Z' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API docs
  apis: [
    './src/modules/**/*.routes.ts', // Path to the API routes
    './src/routes/swagger.routes.ts', // Include the swagger route itself
  ],
};

export default options;