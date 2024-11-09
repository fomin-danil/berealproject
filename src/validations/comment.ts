import Joi from 'joi';

export const commentValidation = (data: { text: string }) => {
    const schema = Joi.object({
        text: Joi.string().min(2).max(300).required(),
        postId: Joi.string().required()
    });

    return schema.validate(data);
};

