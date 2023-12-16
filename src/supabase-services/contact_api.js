const supabase = require("../../supabase");

module.exports.insertMessage = async function(email, topic, message){
  const x = await db.collection("message").add({email, topic,message});
  
 
  const { data, error } = await supabase.from('message')
    .insert({ email_sender: email , topic, message })
    .select();
  
  if(error){
    console.error(error);
    throw new Error("Could not do the insertion of the message!");
  }

  return data;
}