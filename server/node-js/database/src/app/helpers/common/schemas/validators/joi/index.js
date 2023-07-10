import * as Joi from 'joi';

// accepts a valid UUID v4 string as id
export const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

export const objectIdSchema = Joi.object({
    id: ObjectId.required()
});

export const paginateValidationSchema = Joi.object({
    query: Joi.object()
        .default({}),
        //.optional(),
    option: Joi.object()
        .default({}),
        //.optional(),
});