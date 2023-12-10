const supabase = require("../../supabase");

module.exports.selectUserByEmail = async function(emailSearch){
    let { data: user, error } = await supabase.from('user').select("*").eq('email', emailSearch);
    if(error){
        console.error(error);
        throw new Error(`There is no user with the email address of ${emailSearch} !`);
    }
    return user;
}

module.exports.insertUser = async function(email, password, name, lastLevel){
    const { data, error } = await supabase
    .from('user')
    .insert([
      { email , password , name , lastLevel },
    ])
    .select();

    if(error){
        console.error(error);
        throw new Error("Could not do the insertion !");
    }

    return data;
}

