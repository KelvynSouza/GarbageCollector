import pkg from 'celebrate';
const { Joi, Segments } = pkg; 

var postPricesValidator = {
    [Segments.BODY]: Joi.object().keys({
        item:Joi.string().required(),
        info:{
            price:Joi.number().required(),
            energy:Joi.number().integer().required(),
        }        
    })
  }

  var putPricesValidator = {
    [Segments.BODY]: Joi.object().keys({
        _id:Joi.string().required(),
        item:Joi.string().required(),
        info:{
            price:Joi.number().required(),
            energy:Joi.number().integer().required(),
        }        
    })
  }
  

  export {postPricesValidator,putPricesValidator }; 