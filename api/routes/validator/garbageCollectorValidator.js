import pkg from 'celebrate';
const { Joi, Segments } = pkg; 

var postGarbageValidator = {
    [Segments.BODY]: Joi.object().keys({
        user:Joi.string().required(),
        collected_garbage:{
            glass:Joi.number().integer(),
            plastic:Joi.number().integer(),
            metal:Joi.number().integer(),
            paper:Joi.number().integer()
        }
    })
  }

  var postUserValidator = {
    [Segments.BODY]: Joi.object().keys({
        user:Joi.string().required()        
    })
  }

  var putGarbageValidator = {
    [Segments.BODY]: Joi.object().keys({
        _id:Joi.string().required(),
        user:Joi.string().required(),
        collected_garbage:{
            glass:Joi.number().integer(),
            plastic:Joi.number().integer(),
            metal:Joi.number().integer(),
            paper:Joi.number().integer()
        }
    })
  }

  

  export {postGarbageValidator,putGarbageValidator,postUserValidator }; 