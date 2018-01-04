const Util = require('../AllCoinZ/util')
const telegram = require('../AllCoinZ/telegram')
const slack = require('../AllCoinZ/slack')



function getWelcomeMessage (platform,displayName){

      var cardResponse = Util.m_getDefaultCardMessageResponse(platform)

      var welcomeMessage ="";
  
       console.log(new Date())
        switch (platform){
          case "telegram":
                 welcomeMessage= telegram.m_formatWelcomeMessage(displayName);
                break;
          case "slack":
                 welcomeMessage= slack.m_formatWelcomeMessage(displayName);
                break;
          default:
            "Hello Welcome to AllCoinZ"
                        }
      cardResponse.messages[0].subtitle = welcomeMessage
      return cardResponse;
}


function getResponseMessage(platform,coinResult){
    
  var responseMessage
  switch (platform){
          case "telegram":
                 responseMessage= telegram.m_ResponseMessage(coinResult);
                break;
          case "slack":
                 responseMessage= slack.m_ResponseMessage(coinResult);
                break;
        case "skype":
                 responseMessage= telegram.m_ResponseMessage(coinResult);
                break;
          default:
            "Please try again !!!"
     

}
   return responseMessage
}
  
  



module.exports= {

  m_getWelcomeMessage:getWelcomeMessage,
  m_getResponseMessage:getResponseMessage,

}
