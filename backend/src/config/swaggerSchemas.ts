export const swaggerSchemas = {
  components: {
    schemas: {
      Candidate: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          position: { type: 'string' },
          status: {
            type: 'string',
            enum: ['pending', 'validated', 'rejected']
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateCandidateDto: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'position'],
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          position: { type: 'string' }
        }
      },
      UpdateCandidateDto: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          position: { type: 'string' },
          status: {
            type: 'string',
            enum: ['pending', 'validated', 'rejected']
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  }
};