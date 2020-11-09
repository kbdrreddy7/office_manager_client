
const getFrequencyType=(frequencyType,subFrequency)=>{
    switch(frequencyType){
      case "Daily": return "Every->1 day";
      case "Weekly":{
        switch(subFrequency){
          
          case "Sunday":return "Weekly->0 th day"
          case "Monday":return "Weekly->1 th day"
          case "Tuesday":return "Weekly->2 th day"
          case "Wednusday":return "Weekly->3 th day"
          case "Thursday":return "Weekly->4 th day"
          case "Friday":return "Weekly->5 th day"
          case "Saturday":return "Weekly->6 th day"
          default : return frequencyType
        }
      }
      case "Custom":return subFrequency?`Every->${subFrequency} day(s)`:subFrequency
        default: return frequencyType;    
    }
  }

  // it is working fine
const getActualStartDate=(date,frequencyType)=>{
    if(typeof(frequencyType)==="string"&&frequencyType.toLowerCase().includes("weekly"))
         {
           let weekDay=parseInt(frequencyType.charAt(frequencyType.indexOf(">")+1) )
           // weekly->5 th day   then ===> 5
           let dateDay=date.getDay()
             if(dateDay<weekDay)
             // if date is lesser add diff
                date.setDate(date.getDate()+(weekDay-dateDay))
             else if(dateDay>weekDay)
            // if date is bigger go to next week remove diff
               date.setDate(date.getDate()+(7-(dateDay-weekDay)))
  
         }
  
         return new Date (date.setUTCHours(0,0,0,0));
      
  }
  

// it is working fine
const getNextDay=(date,dateFrequency)=>{
    let nextDate;
  
       if(typeof(dateFrequency)==="string"&& dateFrequency.toLowerCase().includes("weekly")) 
         dateFrequency=7;
  
      if(typeof(dateFrequency)==="string" && dateFrequency.toLocaleLowerCase().includes("every"))  
      dateFrequency=parseInt(dateFrequency.charAt(dateFrequency.indexOf(">")+1) )
         
  
      if(typeof(dateFrequency)==="number")
      nextDate=date.setDate(date.getDate()+dateFrequency);
  
      else if(dateFrequency.toLowerCase().includes("monthly"))
         nextDate=date.setMonth(date.getMonth()+1)
      else  nextDate=date.setFullYear(date.getFullYear()+1);
    
      return new Date (nextDate);
  
  }
  
  
const getTaskdates=(startDate,frequencyType,noOfDays,holidays)=>{

    let taskDates=[]
    let date= new Date(new Date(startDate).setUTCHours(0,0,0,0));
    date=getActualStartDate(date,frequencyType)

  
        while(noOfDays>0)
        {
          if(date.getDay()===0)// if sunday // move to monday
          date.setDate(date.getDate()+1); 
  
  
            if(holidays&&holidays.indexOf(date.toISOString())<0)
              {
                taskDates.push(date.toISOString());
                noOfDays--;
              }
  
              date=getNextDay(date,frequencyType)            
        }
  
    return taskDates;
  
  
  }

  const manageTaskDates=(startDate,noOfDays,frequency, subFrequency,holidays)=>{


    if(!(startDate&&noOfDays&&frequency))
      return []

    if(frequency==='Custom' || frequency==='Weekly')  
       if(!subFrequency) return []

     let frequencyType=getFrequencyType(frequency,subFrequency)



     let taskDates= getTaskdates(startDate,frequencyType,noOfDays,holidays)

    return taskDates;


  }

  export default manageTaskDates